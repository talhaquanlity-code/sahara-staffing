<?php
/**
 * SAHARA STAFFING INC. — GODADDY CMS PERSISTENCE ENDPOINT (/api/save-content.php)
 * Authenticates admin bearer token and writes published CMS state to /data/content.json.
 */

error_reporting(0);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/../data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$dataFile = $dataDir . '/content.json';
$mirrorFile = $dataDir . '/site-content.json';

// Handle GET request to read content (Public read-only for live website)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        echo file_get_contents($dataFile);
    } elseif (file_exists($mirrorFile)) {
        echo file_get_contents($mirrorFile);
    } else {
        echo json_encode(['status' => 'empty', 'message' => 'No content published yet']);
    }
    exit;
}

// ============================================================================
// TOKEN VERIFICATION HELPER (POST REQUESTS REQUIRE VALID ADMIN SESSION)
// ============================================================================
define('SERVER_JWT_SECRET', 'sahara_admin_jwt_secret_token_key_77192834718293');

function verifyAdminAuthorization() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    if (empty($authHeader) && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? ($headers['authorization'] ?? '');
    }

    if (empty($authHeader)) {
        return null;
    }

    $token = '';
    if (preg_match('/Bearer\s+(.+)$/i', $authHeader, $matches)) {
        $token = trim($matches[1]);
    }

    if (empty($token) || strpos($token, '.') === false) {
        return null;
    }

    list($encodedPayload, $signature) = explode('.', $token, 2);
    $expectedSig = hash_hmac('sha256', $encodedPayload, SERVER_JWT_SECRET);

    if (!hash_equals($expectedSig, $signature)) {
        return null;
    }

    $remainder = strlen($encodedPayload) % 4;
    if ($remainder) {
        $encodedPayload .= str_repeat('=', 4 - $remainder);
    }
    $decodedJson = base64_decode(strtr($encodedPayload, '-_', '+/'));
    $payload = json_decode($decodedJson, true);

    if (!is_array($payload) || !isset($payload['exp']) || $payload['exp'] < time()) {
        return null;
    }

    return $payload;
}

// Handle POST request to save content (SECURED)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $admin = verifyAdminAuthorization();
    if (!$admin) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Unauthorized: Invalid or expired administrator credentials. Access denied.'
        ]);
        exit;
    }

    $rawInput = file_get_contents('php://input');
    
    if (empty($rawInput)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Empty request body received'
        ]);
        exit;
    }

    $decoded = json_decode($rawInput, true);
    if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON payload: ' . json_last_error_msg()
        ]);
        exit;
    }

    // Attach timestamp metadata
    $decoded['_last_published_at'] = date('c');
    $decoded['_published_by'] = $admin['email'] ?? 'contact@sahara-staffing.com';

    $jsonToWrite = json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    
    $writeResult = file_put_contents($dataFile, $jsonToWrite, LOCK_EX);
    @file_put_contents($mirrorFile, $jsonToWrite, LOCK_EX);

    if ($writeResult === false) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to write data to /data/content.json. Check directory permissions.'
        ]);
        exit;
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Site Content Successfully Published & Live Worldwide!',
        'bytes_written' => $writeResult,
        'timestamp' => date('c'),
        'published_by' => $decoded['_published_by']
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
