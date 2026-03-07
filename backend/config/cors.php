<?php
// ── CORS: allowed origins ────────────────────────────────────────────────────
// The live domain is auto-derived from APP_URL in .env — no hardcoding needed.
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost',
    'http://127.0.0.1:5173',
    'http://127.0.0.1',
];

// Automatically add the production domain from APP_URL
if (!empty($_ENV['APP_URL'])) {
    $parsed = parse_url($_ENV['APP_URL']);
    if (isset($parsed['scheme'], $parsed['host'])) {
        $origin = $parsed['scheme'] . '://' . $parsed['host'];
        if (!empty($parsed['port'])) {
            $origin .= ':' . $parsed['port'];
        }
        $allowedOrigins[] = $origin;
        $allowedOrigins[] = str_replace('://', '://www.', $origin); // also allow www.
    }
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// SECURITY FIX: Improved CORS handling
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (($_ENV['APP_ENV'] ?? 'production') === 'development') {
    // Only allow localhost fallback in development
    header('Access-Control-Allow-Origin: http://localhost:5173');
    error_log("CORS: Unknown origin '$origin' allowed (development mode)");
} else {
    // Production: deny unknown origins
    error_log("CORS: Rejected origin '$origin'");
    http_response_code(403);
    echo json_encode(['error' => 'Origin not allowed']);
    exit;
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// SECURITY FIX: Add security headers
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// Content Security Policy
$csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'"
];
header('Content-Security-Policy: ' . implode('; ', $csp));

// Handle preflight (OPTIONS) requests immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
