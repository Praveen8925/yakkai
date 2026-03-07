<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

$db   = new Database();
$conn = $db->getConnection();

// ── POST /api/contacts  — save a contact inquiry ─────────────────────────
if ($method === 'POST') {
    $data    = json_decode(file_get_contents('php://input'), true) ?? [];
    $name    = trim($data['name']     ?? '');
    $email   = trim($data['email']    ?? '');
    $phone   = trim($data['phone']    ?? '');
    $interest= trim($data['interest'] ?? '');
    $message = trim($data['message']  ?? '');

    if (!$name || !$email || !$message) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, email and message are required']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit;
    }

    $stmt = $conn->prepare(
        'INSERT INTO contacts (name, email, phone, interest, message, created_at)
         VALUES (:name, :email, :phone, :interest, :message, NOW())'
    );
    $stmt->execute([
        ':name'     => $name,
        ':email'    => $email,
        ':phone'    => $phone,
        ':interest' => $interest,
        ':message'  => $message,
    ]);

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been received. We will contact you shortly.',
        'id'      => $conn->lastInsertId(),
    ]);
    exit;
}

// ── GET /api/contacts  — admin list (requires admin token) ────────────────
if ($method === 'GET') {
    require_once __DIR__ . '/../middleware/AuthMiddleware.php';
    AuthMiddleware::requireAdmin();

    $stmt = $conn->prepare(
        'SELECT id, name, email, phone, interest, message, created_at
         FROM contacts
         ORDER BY created_at DESC'
    );
    $stmt->execute();
    $contacts = $stmt->fetchAll();

    echo json_encode(['success' => true, 'data' => $contacts]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
