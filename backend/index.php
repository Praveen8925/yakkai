<?php
// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
        putenv(trim($line));
    }
}

// CORS headers
require_once __DIR__ . '/config/cors.php';

// Get the request URI and method
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove the base path and /api prefix
$requestUri = preg_replace('#^/Yakkai_Neri/backend#', '', $requestUri);
$requestUri = preg_replace('#^/api#', '', $requestUri);

// Route the request
if (preg_match('#^/auth(/.*)?$#', $requestUri)) {
    require __DIR__ . '/routes/auth.php';
} elseif (preg_match('#^/contacts(/.*)?$#', $requestUri)) {
    require __DIR__ . '/routes/contacts.php';
} elseif (preg_match('#^/wellness(/.*)?$#', $requestUri)) {
    require __DIR__ . '/routes/wellness.php';
} elseif (preg_match('#^/programs(/.*)?$#', $requestUri)) {
    require __DIR__ . '/routes/programs.php';
} elseif (preg_match('#^/pages(/.*)?$#', $requestUri)) {
    require __DIR__ . '/routes/pages.php';
} elseif (preg_match('#^/upload(/.*)?$#', $requestUri)) {
    require __DIR__ . '/routes/upload.php';
} elseif (preg_match('#^/gallery(/.*)?$#', $requestUri)) {
    require __DIR__ . '/routes/gallery.php';
} else {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Route not found']);
}
