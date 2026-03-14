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
} else {
    // On Vercel, variables are provided in $_SERVER or $_ENV directly
    // Ensure $_ENV is populated from getenv() if not already
    foreach (['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'DB_PORT', 'JWT_SECRET', 'APP_ENV', 'APP_URL'] as $key) {
        if (!isset($_ENV[$key])) {
            $val = getenv($key);
            if ($val !== false) $_ENV[$key] = $val;
        }
    }
}

// SECURITY FIX: Enforce HTTPS in production
if (($_ENV['APP_ENV'] ?? 'production') === 'production') {
    $isVercel = isset($_SERVER['VERCEL']) || isset($_SERVER['HTTP_X_VERCEL_ID']);
    $isHttps = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    $isForwardedHttps = isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https';
    
    // On Vercel, we don't need to redirect in PHP as Vercel handles it.
    // However, if we're on a traditional server, we still want the redirect.
    if (!$isVercel && !$isHttps && !$isForwardedHttps) {
        $redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        header('HTTP/1.1 301 Moved Permanently');
        header('Location: ' . $redirect);
        exit;
    }
    
    // Add HSTS header (HTTP Strict Transport Security)
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
}

// CORS headers
require_once __DIR__ . '/config/cors.php';

// Get the request URI and method
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove the base path and /api prefix
// APP_URL e.g. "http://localhost/Yakkai_Neri/backend" or "https://yourdomain.com/backend"
$appUrl    = $_ENV['APP_URL'] ?? '';
$parsedUrl = parse_url($appUrl);
$basePath  = $parsedUrl['path'] ?? '';          // e.g. "/Yakkai_Neri/backend" or "/backend"
if ($basePath && $basePath !== '/') {
    $requestUri = preg_replace('#^' . preg_quote($basePath, '#') . '#', '', $requestUri);
}
$requestUri = preg_replace('#^/api#', '', $requestUri);

// Route the request
// Share $requestUri with route files that need sub-path parsing
$GLOBALS['requestUri'] = $requestUri;

if (preg_match('#^/auth(/.*)?$#', $requestUri)) {
    require __DIR__ . '/routes/auth.php';
} elseif (preg_match('#^/assessment(/.*)?$#', $requestUri)) {
    require __DIR__ . '/routes/assessment.php';
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
} elseif (preg_match('#^/corporate(/.*)?$#', $requestUri)) {
    require __DIR__ . '/routes/corporate.php';
} elseif (preg_match('#^/hr-users(/.*)?$#', $requestUri)) {
    require __DIR__ . '/routes/hr_users.php';
} else {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Route not found']);
}
