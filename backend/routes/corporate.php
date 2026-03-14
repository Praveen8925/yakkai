<?php
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

$db   = new Database();
$conn = $db->getConnection();

// ── POST /api/corporate  — save a corporate yoga enquiry ─────────────────
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $company_name       = trim($data['company_name']       ?? '');
    $contact_name       = trim($data['contact_name']       ?? '');
    $email              = trim($data['email']              ?? '');
    $phone              = trim($data['phone']              ?? '');
    $employee_count     = trim($data['employee_count']     ?? '');
    $program_type       = trim($data['program_type']       ?? 'demo');
    $preferred_schedule = trim($data['preferred_schedule'] ?? '');
    $message            = trim($data['message']            ?? '');

    // Validation
    if (!$company_name || !$contact_name || !$email || !$phone) {
        http_response_code(400);
        echo json_encode(['error' => 'Company name, contact name, email and phone are required']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit;
    }

    $allowed_types = ['demo', 'week_trial', 'month_program', 'custom'];
    if (!in_array($program_type, $allowed_types)) {
        $program_type = 'demo';
    }

    $stmt = $conn->prepare(
        'INSERT INTO corporate_enquiries
            (company_name, contact_name, email, phone, employee_count,
             program_type, preferred_schedule, message, created_at)
         VALUES
            (:company_name, :contact_name, :email, :phone, :employee_count,
             :program_type, :preferred_schedule, :message, NOW())'
    );
    $stmt->execute([
        ':company_name'       => $company_name,
        ':contact_name'       => $contact_name,
        ':email'              => $email,
        ':phone'              => $phone,
        ':employee_count'     => $employee_count,
        ':program_type'       => $program_type,
        ':preferred_schedule' => $preferred_schedule,
        ':message'            => $message,
    ]);

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your corporate yoga enquiry has been received. We will contact you within 24 hours.',
        'id'      => $conn->lastInsertId(),
    ]);
    exit;
}

// ── GET /api/corporate  — admin list (requires admin token) ───────────────
if ($method === 'GET') {
    require_once __DIR__ . '/../middleware/AuthMiddleware.php';
    AuthMiddleware::requireAdmin();

    $status_filter = $_GET['status'] ?? '';
    $allowed_statuses = ['new', 'contacted', 'converted', 'closed'];

    if ($status_filter && in_array($status_filter, $allowed_statuses)) {
        $stmt = $conn->prepare(
            'SELECT id, company_name, contact_name, email, phone, employee_count,
                    program_type, preferred_schedule, message, status, created_at
             FROM corporate_enquiries
             WHERE status = :status
             ORDER BY created_at DESC'
        );
        $stmt->execute([':status' => $status_filter]);
    } else {
        $stmt = $conn->prepare(
            'SELECT id, company_name, contact_name, email, phone, employee_count,
                    program_type, preferred_schedule, message, status, created_at
             FROM corporate_enquiries
             ORDER BY created_at DESC'
        );
        $stmt->execute();
    }

    $enquiries = $stmt->fetchAll();

    echo json_encode(['success' => true, 'data' => $enquiries]);
    exit;
}

// ── PATCH /api/corporate/{id}  — update status (admin only) ──────────────
if ($method === 'PATCH') {
    require_once __DIR__ . '/../middleware/AuthMiddleware.php';
    AuthMiddleware::requireAdmin();

    $parts = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
    $id    = (int) end($parts);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Enquiry ID required']);
        exit;
    }

    $data   = json_decode(file_get_contents('php://input'), true) ?? [];
    $status = trim($data['status'] ?? '');
    $allowed_statuses = ['new', 'contacted', 'converted', 'closed'];

    if (!in_array($status, $allowed_statuses)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid status value']);
        exit;
    }

    $stmt = $conn->prepare('UPDATE corporate_enquiries SET status = :status WHERE id = :id');
    $stmt->execute([':status' => $status, ':id' => $id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Enquiry not found']);
        exit;
    }

    echo json_encode(['success' => true, 'message' => 'Status updated']);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
