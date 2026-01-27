<?php
// Enable CORS for your domain
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
$uploadDir = __DIR__ . '/uploads/';
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
$maxFileSize = 10 * 1024 * 1024; // 10MB

// Create uploads directory if it doesn't exist
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Check if file was uploaded
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE',
        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the upload',
    ];
    
    $errorCode = $_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE;
    $errorMessage = $errorMessages[$errorCode] ?? 'Unknown upload error';
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $errorMessage
    ]);
    exit();
}

$file = $_FILES['file'];

// Validate file type
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

if (!in_array($mimeType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid file type. Allowed: JPG, PNG, GIF, WEBP, SVG'
    ]);
    exit();
}

// Validate file size
if ($file['size'] > $maxFileSize) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'File too large. Maximum size: 10MB'
    ]);
    exit();
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid() . '_' . time() . '.' . $extension;
$destination = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $destination)) {
    // Get the base URL (adjust this to your domain)
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $baseUrl = $protocol . '://' . $host;
    
    // Return the full URL to the uploaded file
    $fileUrl = $baseUrl . '/uploads/' . $filename;
    
    echo json_encode([
        'success' => true,
        'url' => $fileUrl,
        'filename' => $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to save file'
    ]);
}
?>
