<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

// Ensure admin is authenticated
AuthMiddleware::requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    uploadImage();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

function uploadImage() {
    try {
        // Check if file was uploaded
        if (!isset($_FILES['image'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No image file provided']);
            return;
        }

        $file = $_FILES['image'];
        
        // Validate file
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        $maxSize = 5 * 1024 * 1024; // 5MB

        if (!in_array($file['type'], $allowedTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, and WebP allowed']);
            return;
        }

        if ($file['size'] > $maxSize) {
            http_response_code(400);
            echo json_encode(['error' => 'File too large. Maximum size is 5MB']);
            return;
        }

        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(500);
            echo json_encode(['error' => 'Upload failed with error code: ' . $file['error']]);
            return;
        }

        // Create uploads directory if it doesn't exist
        $uploadDir = __DIR__ . '/../../frontend/public/uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('img_') . '_' . time() . '.' . $extension;
        $filepath = $uploadDir . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save uploaded file']);
            return;
        }

        // Optimize/resize image if it's too large
        optimizeImage($filepath, $file['type']);

        // Return the URL path
        $imageUrl = '/uploads/' . $filename;
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'url' => $imageUrl,
            'message' => 'Image uploaded successfully'
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
    }
}

function optimizeImage($filepath, $mimeType) {
    $maxWidth = 1920;
    $maxHeight = 1920;
    $quality = 85;

    // Get image dimensions
    list($width, $height) = getimagesize($filepath);

    // Only resize if image is larger than max dimensions
    if ($width <= $maxWidth && $height <= $maxHeight) {
        return;
    }

    // Calculate new dimensions
    $ratio = min($maxWidth / $width, $maxHeight / $height);
    $newWidth = round($width * $ratio);
    $newHeight = round($height * $ratio);

    // Create image resource based on type
    switch ($mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            $source = imagecreatefromjpeg($filepath);
            break;
        case 'image/png':
            $source = imagecreatefrompng($filepath);
            break;
        case 'image/webp':
            $source = imagecreatefromwebp($filepath);
            break;
        default:
            return; // Unsupported type
    }

    if (!$source) {
        return;
    }

    // Create new image
    $destination = imagecreatetruecolor($newWidth, $newHeight);
    
    // Preserve transparency for PNG
    if ($mimeType === 'image/png') {
        imagealphablending($destination, false);
        imagesavealpha($destination, true);
    }

    // Resize
    imagecopyresampled($destination, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

    // Save resized image
    switch ($mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            imagejpeg($destination, $filepath, $quality);
            break;
        case 'image/png':
            imagepng($destination, $filepath, 9);
            break;
        case 'image/webp':
            imagewebp($destination, $filepath, $quality);
            break;
    }

    // Free memory
    imagedestroy($source);
    imagedestroy($destination);
}
