<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../middleware/RateLimiter.php';
require_once __DIR__ . '/../utils/PasswordValidator.php';
require_once __DIR__ . '/../utils/ErrorHandler.php';

$method = $_SERVER['REQUEST_METHOD'];
// Use the already-parsed path from index.php (strips base path + /api prefix correctly
// regardless of the server's subdirectory setup — e.g. /yakkai-main/backend vs /Yakkai_Neri/backend)
$path = $GLOBALS['requestUri'] ?? '';

$db   = new Database();
$conn = $db->getConnection();

// ── POST /api/auth/register ───────────────────────────────────────────────
if ($method === 'POST' && preg_match('#^/auth/register$#', $path)) {
    $data     = json_decode(file_get_contents('php://input'), true) ?? [];
    $name     = trim($data['name']     ?? '');
    $email    = trim($data['email']    ?? '');
    $password = trim($data['password'] ?? '');
    $role     = 'user'; // public registration is always "user"

    if (!$name || !$email || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, email and password are required']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit;
    }

    // SECURITY FIX: Validate password strength
    $passwordValidation = PasswordValidator::validate($password);
    if (!$passwordValidation['valid']) {
        http_response_code(400);
        echo json_encode(['error' => PasswordValidator::getErrorMessage($passwordValidation['errors'])]);
        exit;
    }

    // Check duplicate email
    $check = $conn->prepare('SELECT id FROM users WHERE email = :email');
    $check->execute([':email' => $email]);
    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already registered']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $conn->prepare(
        'INSERT INTO users (name, email, password, role, created_at, updated_at)
         VALUES (:name, :email, :password, :role, NOW(), NOW())'
    );
    $stmt->execute([
        ':name'     => $name,
        ':email'    => $email,
        ':password' => $hash,
        ':role'     => $role,
    ]);

    $userId = $conn->lastInsertId();
    $token  = AuthMiddleware::generateJWT(['id' => $userId, 'email' => $email, 'role' => $role, 'name' => $name]);

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful',
        'token'   => $token,
        'user'    => ['id' => $userId, 'name' => $name, 'email' => $email, 'role' => $role],
    ]);
    exit;
}

// ── POST /api/auth/login ──────────────────────────────────────────────────
if ($method === 'POST' && preg_match('#^/auth/login$#', $path)) {
    $data     = json_decode(file_get_contents('php://input'), true) ?? [];
    $email    = trim($data['email']    ?? '');
    $password = trim($data['password'] ?? '');

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        exit;
    }

    // SECURITY FIX: Rate limiting to prevent brute force attacks
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $rateLimitKey = 'login:' . $ip . ':' . $email;
    
    if (RateLimiter::tooManyAttempts($rateLimitKey, 5, 15)) {
        $retryAfter = RateLimiter::availableIn($rateLimitKey);
        ErrorHandler::logSecurityEvent('Rate limit exceeded', ['email' => $email, 'ip' => $ip]);
        http_response_code(429);
        echo json_encode([
            'error' => 'Too many login attempts. Please try again in ' . ceil($retryAfter / 60) . ' minutes.',
            'retry_after' => $retryAfter
        ]);
        exit;
    }

    $stmt = $conn->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        ErrorHandler::logSecurityEvent('Failed login attempt', ['email' => $email, 'ip' => $ip]);
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
        exit;
    }

    // Clear rate limit on successful login
    RateLimiter::clear($rateLimitKey);

    $token = AuthMiddleware::generateJWT([
        'id'    => $user['id'],
        'email' => $user['email'],
        'role'  => $user['role'],
        'name'  => $user['name'],
    ]);

    ErrorHandler::logSecurityEvent('Successful login', ['email' => $email, 'ip' => $ip, 'user_id' => $user['id']]);

    echo json_encode([
        'success' => true,
        'token'   => $token,
        'user'    => [
            'id'    => $user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ],
    ]);
    exit;
}

// ── GET /api/auth/me ──────────────────────────────────────────────────────
if ($method === 'GET' && preg_match('#^/auth/me$#', $path)) {
    $payload = AuthMiddleware::requireAuth();

    $stmt = $conn->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = :id');
    $stmt->execute([':id' => $payload['id']]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    echo json_encode(['success' => true, 'user' => $user]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Auth route not found']);
