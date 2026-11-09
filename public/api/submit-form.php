<?php
/**
 * SAHARA STAFFING INC. — GODADDY FORM SUBMISSION & EMAIL DISPATCH ENDPOINT
 * Processes candidate & client contact submissions, generates #SAH-xxxx tracking ID,
 * attaches resume files, and dispatches formatted HTML emails to contact@sahara-staffing.com.
 */

// Strict error reporting suppressed for clean JSON responses
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

// Default destination email
$toEmail = 'contact@sahara-staffing.com';

// Attempt to read custom recipient from content.json if configured
$contentJsonPath = __DIR__ . '/../data/content.json';
if (file_exists($contentJsonPath)) {
    $contentData = json_decode(file_get_contents($contentJsonPath), true);
    if (!empty($contentData['settings']['recipientEmail'])) {
        $toEmail = trim($contentData['settings']['recipientEmail']);
    } elseif (!empty($contentData['contactPage']['details']['email'])) {
        $toEmail = trim($contentData['contactPage']['details']['email']);
    }
}

// Collect POST form data (supports both multipart/form-data and JSON input)
$input = $_POST;
if (empty($input)) {
    $rawInput = file_get_contents('php://input');
    if (!empty($rawInput)) {
        $decoded = json_decode($rawInput, true);
        if (is_array($decoded)) {
            $input = $decoded;
        }
    }
}

$fullName = isset($input['fullName']) ? trim($input['fullName']) : (isset($input['name']) ? trim($input['name']) : 'Prospective Candidate');
$email = isset($input['email']) ? trim($input['email']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : 'Not provided';
$targetDiscipline = isset($input['targetDiscipline']) ? trim($input['targetDiscipline']) : (isset($input['discipline']) ? trim($input['discipline']) : 'General Inquiry');
$linkedinUrl = isset($input['linkedinUrl']) ? trim($input['linkedinUrl']) : (isset($input['linkedin']) ? trim($input['linkedin']) : 'Not provided');
$careerSummary = isset($input['careerSummary']) ? trim($input['careerSummary']) : (isset($input['message']) ? trim($input['message']) : '');

// Validation
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'A valid email address is required.']);
    exit;
}

// Generate unique tracking ID: #SAH-xxxx (e.g. #SAH-8941)
$randomDigits = str_pad((string)rand(1000, 9999), 4, '0', STR_PAD_LEFT);
$trackingId = '#SAH-' . $randomDigits;

// Subject line
$subject = "[Sahara Staffing] New Submission: {$fullName} ({$trackingId})";

// Safe text formatting for HTML
$safeName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$safeDiscipline = htmlspecialchars($targetDiscipline, ENT_QUOTES, 'UTF-8');
$safeLinkedin = htmlspecialchars($linkedinUrl, ENT_QUOTES, 'UTF-8');
$safeSummary = nl2br(htmlspecialchars($careerSummary, ENT_QUOTES, 'UTF-8'));
$dateFormatted = date('F j, Y, g:i a e');

// Build luxury branded HTML email body
$htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Submission - Sahara Staffing</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070A10; color: #FFFFFF; margin: 0; padding: 24px; }
    .card { max-width: 620px; margin: 0 auto; background: #0E131F; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; }
    .header { background: #0B0F17; padding: 32px 28px; text-align: center; border-bottom: 1px solid #1E293B; }
    .kicker { color: #E69D2B; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 6px; }
    .headline { font-size: 22px; font-weight: 800; color: #FFFFFF; margin: 0; }
    .body { padding: 32px 28px; }
    .badge { display: inline-block; background: rgba(230,157,43,0.15); color: #E69D2B; border: 1px solid #E69D2B; font-size: 13px; font-weight: 700; padding: 5px 14px; border-radius: 8px; font-family: monospace; margin-bottom: 24px; }
    .field-group { margin-bottom: 18px; }
    .label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.1em; color: #94A3B8; font-weight: 600; margin-bottom: 4px; }
    .value { font-size: 14.5px; color: #FFFFFF; font-weight: 500; }
    .value a { color: #E69D2B; text-decoration: none; }
    .message-box { background: #070A10; border: 1px solid #1E293B; border-radius: 10px; padding: 16px; font-size: 13.5px; color: #CBD5E1; line-height: 1.6; margin-top: 6px; }
    .footer { padding: 20px 28px; background: #070A10; border-top: 1px solid #1E293B; text-align: center; font-size: 11px; color: #64748B; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="kicker">SAHARA STAFFING INC. &bull; EXECUTIVE INTAKE</div>
      <h1 class="headline">New Candidate &amp; Inquiry Submission</h1>
    </div>
    <div class="body">
      <div>
        <span class="badge">TRACKING ID: {$trackingId}</span>
      </div>
      <div class="field-group">
        <div class="label">Candidate / Contact Name</div>
        <div class="value">{$safeName}</div>
      </div>
      <div class="field-group">
        <div class="label">Target Discipline / Role</div>
        <div class="value" style="color: #E69D2B; font-weight: 700;">{$safeDiscipline}</div>
      </div>
      <div class="field-group">
        <div class="label">Email Address</div>
        <div class="value"><a href="mailto:{$safeEmail}">{$safeEmail}</a></div>
      </div>
      <div class="field-group">
        <div class="label">Phone Number</div>
        <div class="value"><a href="tel:{$safePhone}">{$safePhone}</a></div>
      </div>
      <div class="field-group">
        <div class="label">LinkedIn Profile</div>
        <div class="value"><a href="{$safeLinkedin}" target="_blank">{$safeLinkedin}</a></div>
      </div>
      <div class="field-group">
        <div class="label">Candidate Summary &amp; Career Objective</div>
        <div class="message-box">{$safeSummary}</div>
      </div>
      <div class="field-group" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1E293B;">
        <div class="label">Submission Timestamp</div>
        <div class="value" style="font-size: 12px; color: #94A3B8; font-family: monospace;">{$dateFormatted}</div>
      </div>
    </div>
    <div class="footer">
      &copy; 2026 Sahara Staffing Inc. &bull; Confirmed GoDaddy Zero-DB Email Dispatch System
    </div>
  </div>
</body>
</html>
HTML;

// Check for file attachments (e.g. $_FILES['resume'] or $_FILES['resumeFile'] or base64)
$hasAttachment = false;
$attachmentData = null;
$attachmentName = null;
$attachmentType = 'application/octet-stream';

if (!empty($_FILES['resume']['tmp_name']) && is_uploaded_file($_FILES['resume']['tmp_name'])) {
    $hasAttachment = true;
    $attachmentName = basename($_FILES['resume']['name']);
    $attachmentData = file_get_contents($_FILES['resume']['tmp_name']);
    $attachmentType = $_FILES['resume']['type'] ?: 'application/pdf';
} elseif (!empty($_FILES['resumeFile']['tmp_name']) && is_uploaded_file($_FILES['resumeFile']['tmp_name'])) {
    $hasAttachment = true;
    $attachmentName = basename($_FILES['resumeFile']['name']);
    $attachmentData = file_get_contents($_FILES['resumeFile']['tmp_name']);
    $attachmentType = $_FILES['resumeFile']['type'] ?: 'application/pdf';
} elseif (!empty($input['resumeDataUrl'])) {
    // Base64 data URL provided in payload
    if (preg_match('/^data:([^;]+);base64,(.+)$/', $input['resumeDataUrl'], $matches)) {
        $hasAttachment = true;
        $attachmentType = $matches[1];
        $attachmentData = base64_decode($matches[2]);
        $attachmentName = !empty($input['resumeFileName']) ? $input['resumeFileName'] : 'Resume.pdf';
    }
}

// Mail Headers construction
$headers = [];
$headers[] = 'From: Sahara Staffing Intake <no-reply@sahara-staffing.com>';
$headers[] = 'Reply-To: ' . $safeName . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'MIME-Version: 1.0';

if ($hasAttachment && $attachmentData !== null) {
    $boundary = '==Multipart_Boundary_x' . md5(time()) . 'x';
    $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

    $messageBody = "--" . $boundary . "\r\n";
    $messageBody .= "Content-Type: text/html; charset=UTF-8\r\n";
    $messageBody .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $messageBody .= $htmlBody . "\r\n\r\n";

    $messageBody .= "--" . $boundary . "\r\n";
    $messageBody .= 'Content-Type: ' . $attachmentType . '; name="' . $attachmentName . "\"\r\n";
    $messageBody .= "Content-Transfer-Encoding: base64\r\n";
    $messageBody .= 'Content-Disposition: attachment; filename="' . $attachmentName . "\"\r\n\r\n";
    $messageBody .= chunk_split(base64_encode($attachmentData)) . "\r\n\r\n";
    $messageBody .= "--" . $boundary . "--";
} else {
    $headers[] = 'Content-Type: text/html; charset=UTF-8';
    $messageBody = $htmlBody;
}

// Dispatch email via PHP mail()
$mailSent = @mail($toEmail, $subject, $messageBody, implode("\r\n", $headers));

// Log submission for zero-DB audit record
$logDir = __DIR__ . '/../data';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}
$logEntry = [
    'tracking_id' => $trackingId,
    'timestamp' => date('c'),
    'name' => $fullName,
    'email' => $email,
    'discipline' => $targetDiscipline,
    'attachment' => $hasAttachment ? $attachmentName : null,
    'delivery_status' => $mailSent ? 'delivered' : 'queued'
];
@file_put_contents($logDir . '/submissions.log', json_encode($logEntry) . PHP_EOL, FILE_APPEND | LOCK_EX);

// JSON Response
http_response_code(200);
echo json_encode([
    'success' => true,
    'trackingId' => $trackingId,
    'tracking_id' => $trackingId,
    'message' => 'Thank you. Your credentials have been received under reference ' . $trackingId . '.',
    'delivered_to' => $toEmail,
    'mail_sent' => $mailSent
]);
