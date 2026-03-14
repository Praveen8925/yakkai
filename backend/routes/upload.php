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
        $maxSize = 5 * 1024 * 1024; // 5MB

        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(500);
            echo json_encode(['error' => 'Upload failed']);
            return;
        }

        // SECURITY FIX: Verify it's actually an image (not just MIME type)
        $imageInfo = @getimagesize($file['tmp_name']);
        if ($imageInfo === false) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid image file']);
            return;
        }

        // Check allowed image types using actual image format
        $allowedMimeTypes = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP];
        if (!in_array($imageInfo[2], $allowedMimeTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Only JPG, PNG, and WebP images are allowed']);
            return;
        }

        // Check file size
        if ($file['size'] > $maxSize) {
            http_response_code(400);
            echo json_encode(['error' => 'File too large. Maximum size is 5MB']);
            return;
        }

        // Generate safe filename using verified extension
        $extension = image_type_to_extension($imageInfo[2], false);
        $filename = uniqid('img_', true) . '_' . time() . '.' . $extension;
        
        // Create uploads directory if it doesn't exist
        $uploadDir = __DIR__ . '/../../frontend/public/uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $filepath = $uploadDir . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save uploaded file']);
            return;
        }

        // SECURITY FIX: Re-encode the image to strip any malicious data
        reencodeImage($filepath, $imageInfo[2]);

        // Optimize/resize image if it's too large
        optimizeImage($filepath, $imageInfo[2]);

        // Return the URL path
        $imageUrl = '/uploads/' . $filename;
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'url' => $imageUrl,
            'message' => 'Image uploaded successfully'
        ]);

    } catch (Exception $e) {
        error_log('Upload error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Server error occurred']);
    }
}

function reencodeImage($filepath, $imageType) {
    // Re-encode the image to remove any potential malicious data
    $quality = 85;
    
    switch ($imageType) {
        case IMAGETYPE_JPEG:
            $image = @imagecreatefromjpeg($filepath);
            if ($image) {
                imagejpeg($image, $filepath, $quality);
                imagedestroy($image);
            }
            break;
        case IMAGETYPE_PNG:
            $image = @imagecreatefrompng($filepath);
            if ($image) {
                imagepng($image, $filepath, 8);
                imagedestroy($image);
            }
            break;
        case IMAGETYPE_WEBP:
            $image = @imagecreatefromwebp($filepath);
            if ($image) {
                imagewebp($image, $filepath, $quality);
                imagedestroy($image);
            }
            break;
    }
}

function optimizeImage($filepath, $imageType) {
    $maxWidth = 1920;
    $maxHeight = 1920;
    $quality = 85;

    // Get image dimensions
    list($width, $height) = @getimagesize($filepath);
    
    if (!$width || !$height) {
        return;
    }

    // Only resize if image is larger than max dimensions
    if ($width <= $maxWidth && $height <= $maxHeight) {
        return;
    }

    // Calculate new dimensions
    $ratio = min($maxWidth / $width, $maxHeight / $height);
    $newWidth = round($width * $ratio);
    $newHeight = round($height * $ratio);

    // Create image resource based on type
    switch ($imageType) {
        case IMAGETYPE_JPEG:
            $source = @imagecreatefromjpeg($filepath);
            break;
        case IMAGETYPE_PNG:
            $source = @imagecreatefrompng($filepath);
            break;
        case IMAGETYPE_WEBP:
            $source = @imagecreatefromwebp($filepath);
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
    if ($imageType === IMAGETYPE_PNG) {
        imagealphablending($destination, false);
        imagesavealpha($destination, true);
    }

    // Resize
    imagecopyresampled($destination, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

    // Save resized image
    switch ($imageType) {
        case IMAGETYPE_JPEG:
            imagejpeg($destination, $filepath, $quality);
            break;
        case IMAGETYPE_PNG:
            imagepng($destination, $filepath, 8);
            break;
        case IMAGETYPE_WEBP:
            imagewebp($destination, $filepath, $quality);
            break;
    }

    // Free memory
    imagedestroy($source);
    imagedestroy($destination);
}
