<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path   = preg_replace('#^/Yakkai_Neri/backend/api#', '', $path);
$path   = preg_replace('#^/api#', '', $path);

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

    $stmt = $conn->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
        exit;
    }

    $token = AuthMiddleware::generateJWT([
        'id'    => $user['id'],
        'email' => $user['email'],
        'role'  => $user['role'],
        'name'  => $user['name'],
    ]);

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
