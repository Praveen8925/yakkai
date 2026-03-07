<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db     = new Database();
$conn   = $db->getConnection();

// ── POST /api/wellness  — save a wellness assessment ─────────────────────
if ($method === 'POST') {
    $data      = json_decode(file_get_contents('php://input'), true) ?? [];
    $name      = trim($data['name']      ?? '');
    $email     = trim($data['email']     ?? '');
    $phone     = trim($data['phone']     ?? '');
    $condition = trim($data['condition'] ?? '');
    $sleep     = trim($data['sleep']     ?? '');
    $energy    = trim($data['energy']    ?? '');
    $stress    = trim($data['stress']    ?? '');
    $notes     = trim($data['notes']     ?? '');

    if (!$name || !$email) {
        http_response_code(400);
        echo json_encode(['error' => 'Name and email are required']);
        exit;
    }

    $stmt = $conn->prepare(
        'INSERT INTO wellness_assessments
            (name, email, phone, health_condition, sleep_hours, energy_level, stress_level, notes, created_at)
         VALUES
            (:name, :email, :phone, :condition, :sleep, :energy, :stress, :notes, NOW())'
    );
    $stmt->execute([
        ':name'      => $name,
        ':email'     => $email,
        ':phone'     => $phone,
        ':condition' => $condition,
        ':sleep'     => $sleep,
        ':energy'    => $energy,
        ':stress'    => $stress,
        ':notes'     => $notes,
    ]);

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Assessment submitted! Our team will reach out to you with a personalised plan.',
        'id'      => $conn->lastInsertId(),
    ]);
    exit;
}

// ── GET /api/wellness  — list all (admin only) ───────────────────────────
if ($method === 'GET') {
    require_once __DIR__ . '/../middleware/AuthMiddleware.php';
    AuthMiddleware::requireAdmin();

    $stmt = $conn->prepare(
        'SELECT * FROM wellness_assessments ORDER BY created_at DESC'
    );
    $stmt->execute();
    $rows = $stmt->fetchAll();

    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
