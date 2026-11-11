<?php
/**
 * SAHARA STAFFING INC. — SECURE SERVER-SIDE AUTHENTICATION ENDPOINT (/api/auth.php)
 * Authenticates administrators, issues signed HMAC-SHA256 bearer tokens,
 * and rate-limits login attempts to protect against brute force attacks.
 */

error_reporting(0);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed. POST required.']);
    exit;
}

// ============================================================================
// SECURITY CONFIGURATION (SERVER-SIDE ONLY — NEVER EXPOSED TO CLIENT BUNDLES)
// ============================================================================
define('SERVER_AUTH_SALT', 'sahara_admin_auth_salt_99812734182937');
define('SERVER_JWT_SECRET', 'sahara_admin_jwt_secret_token_key_77192834718293');

// SHA256-HMAC Hash of default administrative credentials
// User: contact@sahara-staffing.com
define('EXPECTED_ADMIN_EMAIL', 'contact@sahara-staffing.com');
define('EXPECTED_ADMIN_HASH', 'd84b37722f027c55b54874cce6dad3f31f9d7fa75be04e0097a30811d5c6a3bb');

// Rate limiting storage
$rateLimitFile = __DIR__ . '/../data/.rate_limits.json';

function checkRateLimit($ip, $rateLimitFile) {
    if (!file_exists($rateLimitFile)) return true;
    $limits = json_decode(@file_get_contents($rateLimitFile), true);
    if (!is_array($limits) || !isset($limits[$ip])) return true;
    
    $record = $limits[$ip];
    $attempts = $record['attempts'] ?? 0;
    $lastAttempt = $record['last_attempt'] ?? 0;
    
    // If locked out and within 15 minute window (900 seconds)
    if ($attempts >= 5 && (time() - $lastAttempt) < 900) {
        return false;
    }
    return true;
}

function recordFailedAttempt($ip, $rateLimitFile) {
    $limits = file_exists($rateLimitFile) ? json_decode(@file_get_contents($rateLimitFile), true) : [];
    if (!is_array($limits)) $limits = [];
    
    $record = $limits[$ip] ?? ['attempts' => 0, 'last_attempt' => time()];
    
    // Reset if last attempt was more than 15 minutes ago
    if ((time() - ($record['last_attempt'] ?? 0)) > 900) {
        $record['attempts'] = 0;
    }
    
    $record['attempts'] = ($record['attempts'] ?? 0) + 1;
    $record['last_attempt'] = time();
    $limits[$ip] = $record;
    
    @file_put_contents($rateLimitFile, json_encode($limits), LOCK_EX);
}

function clearRateLimit($ip, $rateLimitFile) {
    if (!file_exists($rateLimitFile)) return;
    $limits = json_decode(@file_get_contents($rateLimitFile), true);
    if (is_array($limits) && isset($limits[$ip])) {
        unset($limits[$ip]);
        @file_put_contents($rateLimitFile, json_encode($limits), LOCK_EX);
    }
}

// Collect input
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input.']);
    exit;
}

$action = $input['action'] ?? 'login';
$clientIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

// ----------------------------------------------------------------------------
// ACTION: VERIFY EXISTING TOKEN
// ----------------------------------------------------------------------------
if ($action === 'verify') {
    $token = trim($input['token'] ?? '');
    if (empty($token) || strpos($token, '.') === false) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid token structure.']);
        exit;
    }
    
    list($encodedPayload, $signature) = explode('.', $token, 2);
    $expectedSig = hash_hmac('sha256', $encodedPayload, SERVER_JWT_SECRET);
    
    if (!hash_equals($expectedSig, $signature)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Token signature verification failed.']);
        exit;
    }
    
    $remainder = strlen($encodedPayload) % 4;
    if ($remainder) {
        $encodedPayloadPadded = $encodedPayload . str_repeat('=', 4 - $remainder);
    } else {
        $encodedPayloadPadded = $encodedPayload;
    }
    $payload = json_decode(base64_decode(strtr($encodedPayloadPadded, '-_', '+/')), true);
    if (!is_array($payload) || !isset($payload['exp']) || $payload['exp'] < time()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Token has expired. Please log in again.']);
        exit;
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'valid' => true,
        'email' => $payload['email'] ?? EXPECTED_ADMIN_EMAIL,
        'expiresAt' => $payload['exp']
    ]);
    exit;
}

// ----------------------------------------------------------------------------
// ACTION: LOGIN & ISSUE TOKEN
// ----------------------------------------------------------------------------
if (!checkRateLimit($clientIp, $rateLimitFile)) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'error' => 'Too many failed login attempts. Account temporarily locked for 15 minutes.'
    ]);
    exit;
}

$email = strtolower(trim($input['email'] ?? ''));
$password = (string)($input['password'] ?? '');

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Both email and password are required.']);
    exit;
}

// Verify credentials using timing-attack safe HMAC comparison
$providedHash = hash_hmac('sha256', $password, SERVER_AUTH_SALT);
$isEmailValid = ($email === EXPECTED_ADMIN_EMAIL);
$isPasswordValid = hash_equals(EXPECTED_ADMIN_HASH, $providedHash);

if ($isEmailValid && $isPasswordValid) {
    clearRateLimit($clientIp, $rateLimitFile);
    
    // Issue signed bearer token valid for 7 days
    $expiresAt = time() + (86400 * 7);
    $payload = [
        'email' => EXPECTED_ADMIN_EMAIL,
        'role' => 'administrator',
        'iat' => time(),
        'exp' => $expiresAt
    ];
    
    $encodedPayload = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
    $signature = hash_hmac('sha256', $encodedPayload, SERVER_JWT_SECRET);
    $token = $encodedPayload . '.' . $signature;
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Administrator authentication verified.',
        'token' => $token,
        'expiresAt' => $expiresAt,
        'user' => [
            'email' => EXPECTED_ADMIN_EMAIL,
            'role' => 'administrator'
        ]
    ]);
    exit;
}

// Authentication failed
recordFailedAttempt($clientIp, $rateLimitFile);
http_response_code(401);
echo json_encode([
    'success' => false,
    'error' => 'Invalid administrator credentials. Access denied.'
]);
