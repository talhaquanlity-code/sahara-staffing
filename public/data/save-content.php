<?php
/**
 * SAHARA STAFFING INC. — GODADDY CMS PERSISTENCE ENDPOINT (/data/save-content.php)
 * Handles incoming JSON payload from Executive Admin Customizer and writes to /data/content.json.
 */

error_reporting(0);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/content.json';
$mirrorFile = __DIR__ . '/site-content.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        header('Cache-Control: no-cache, no-store, must-revalidate');
        echo file_get_contents($dataFile);
    } elseif (file_exists($mirrorFile)) {
        echo file_get_contents($mirrorFile);
    } else {
        echo json_encode(['status' => 'empty', 'message' => 'No content published yet']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    
    if (empty($rawInput)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Empty request body received']);
        exit;
    }

    $decoded = json_decode($rawInput, true);
    if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON payload: ' . json_last_error_msg()]);
        exit;
    }

    $decoded['_last_published_at'] = date('c');
    $decoded['_published_by'] = 'contact@sahara-staffing.com';

    $jsonToWrite = json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    
    $writeResult = file_put_contents($dataFile, $jsonToWrite, LOCK_EX);
    @file_put_contents($mirrorFile, $jsonToWrite, LOCK_EX);

    if ($writeResult === false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to write data to /data/content.json']);
        exit;
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Site Content Successfully Published & Live Worldwide!',
        'bytes_written' => $writeResult,
        'timestamp' => date('c')
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
