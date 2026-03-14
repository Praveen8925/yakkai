<?php
// Routes handled here:
//   GET    /api/hr-users              — list all HR users (admin only)
//   POST   /api/hr-users              — create HR user (admin only)
//   PUT    /api/hr-users/:id          — update HR user (admin only)
//   DELETE /api/hr-users/:id          — delete HR user (admin only)
//   POST   /api/hr-users/login        — HR user login
//   GET    /api/hr-users/stats/:id    — get HR user dashboard stats

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$db     = new Database();
$conn   = $db->getConnection();

// Parse sub-path after /hr-users
$uri = preg_replace('#^/hr-users#', '', $GLOBALS['requestUri'] ?? '');
$uri = '/' . ltrim($uri, '/');

// ── POST /api/hr-users/login ─────────────────────────────────────────────────
if ($method === 'POST' && $uri === '/login') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $usernameOrEmail = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if (!$usernameOrEmail || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Username/Email and password are required']);
        exit;
    }

    // Check if login is by username OR email
    $stmt = $conn->prepare('SELECT * FROM hr_users WHERE (username = :username OR email = :email) AND status = "active" LIMIT 1');
    $stmt->execute([':username' => $usernameOrEmail, ':email' => $usernameOrEmail]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid username/email or password']);
        exit;
    }

    // Generate JWT token
    require_once __DIR__ . '/../utils/JWTHandler.php';
    $jwt = new JWTHandler();
    $token = $jwt->encode([
        'id'       => $user['id'],
        'username' => $user['username'],
        'company'  => $user['company_name'],
        'role'     => 'hr',
        'exp'      => time() + (24 * 60 * 60), // 24 hours
    ]);

    echo json_encode([
        'success' => true,
        'token'   => $token,
        'user'    => [
            'id'            => $user['id'],
            'username'      => $user['username'],
            'company_name'  => $user['company_name'],
            'contact_person'=> $user['contact_person'],
            'email'         => $user['email'],
            'phone'         => $user['phone'],
            'role'          => 'hr',
        ]
    ]);
    exit;
}

// ── GET /api/hr-users ────────────────────────────────────────────────────────
if ($method === 'GET' && ($uri === '/' || $uri === '')) {
    AuthMiddleware::requireAdmin();

    $stmt = $conn->prepare(
        'SELECT id, username, company_name, contact_person, email, phone, status, created_at, updated_at
         FROM hr_users ORDER BY created_at DESC'
    );
    $stmt->execute();
    $users = $stmt->fetchAll();

    // Get campaign counts for each company
    foreach ($users as &$user) {
        $countStmt = $conn->prepare('SELECT COUNT(*) as count FROM hr_campaigns WHERE company = :company');
        $countStmt->execute([':company' => $user['company_name']]);
        $user['campaign_count'] = (int)$countStmt->fetch()['count'];

        // Get assessment count
        $assessStmt = $conn->prepare(
            'SELECT COUNT(*) as count FROM assessment_results ar
             INNER JOIN hr_campaigns hc ON ar.campaign_id = hc.id
             WHERE hc.company = :company'
        );
        $assessStmt->execute([':company' => $user['company_name']]);
        $user['assessment_count'] = (int)$assessStmt->fetch()['count'];
    }
    unset($user);

    echo json_encode(['success' => true, 'data' => $users]);
    exit;
}

// ── POST /api/hr-users ───────────────────────────────────────────────────────
if ($method === 'POST' && ($uri === '/' || $uri === '')) {
    AuthMiddleware::requireAdmin();

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $username       = trim($data['username']       ?? '');
    $password       = $data['password']           ?? '';
    $companyName    = trim($data['company_name']   ?? '');
    $contactPerson  = trim($data['contact_person'] ?? '');
    $email          = trim($data['email']          ?? '');
    $phone          = trim($data['phone']          ?? '');

    if (!$username || !$password || !$companyName || !$contactPerson || !$email) {
        http_response_code(400);
        echo json_encode(['error' => 'Username, password, company name, contact person and email are required']);
        exit;
    }

    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'Password must be at least 6 characters']);
        exit;
    }

    // Check if username exists
    $checkStmt = $conn->prepare('SELECT id FROM hr_users WHERE username = :username');
    $checkStmt->execute([':username' => $username]);
    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Username already exists']);
        exit;
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare(
        'INSERT INTO hr_users (username, password_hash, company_name, contact_person, email, phone)
         VALUES (:username, :password_hash, :company_name, :contact_person, :email, :phone)'
    );
    $stmt->execute([
        ':username'       => $username,
        ':password_hash'  => $passwordHash,
        ':company_name'   => $companyName,
        ':contact_person' => $contactPerson,
        ':email'          => $email,
        ':phone'          => $phone,
    ]);

    http_response_code(201);
    echo json_encode(['success' => true, 'id' => (int)$conn->lastInsertId()]);
    exit;
}

// ── PUT /api/hr-users/:id ────────────────────────────────────────────────────
if ($method === 'PUT' && preg_match('#^/(\d+)$#', $uri, $m)) {
    AuthMiddleware::requireAdmin();

    $id = (int)$m[1];
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $companyName    = trim($data['company_name']   ?? '');
    $contactPerson  = trim($data['contact_person'] ?? '');
    $email          = trim($data['email']          ?? '');
    $phone          = trim($data['phone']          ?? '');
    $status         = in_array($data['status'] ?? '', ['active', 'inactive']) ? $data['status'] : 'active';
    $newPassword    = $data['password'] ?? '';

    // Build dynamic update
    $updates = [];
    $params = [':id' => $id];

    if ($companyName) {
        $updates[] = 'company_name = :company_name';
        $params[':company_name'] = $companyName;
    }
    if ($contactPerson) {
        $updates[] = 'contact_person = :contact_person';
        $params[':contact_person'] = $contactPerson;
    }
    if ($email) {
        $updates[] = 'email = :email';
        $params[':email'] = $email;
    }
    if ($phone !== null) {
        $updates[] = 'phone = :phone';
        $params[':phone'] = $phone;
    }
    if ($status) {
        $updates[] = 'status = :status';
        $params[':status'] = $status;
    }
    if ($newPassword && strlen($newPassword) >= 6) {
        $updates[] = 'password_hash = :password_hash';
        $params[':password_hash'] = password_hash($newPassword, PASSWORD_DEFAULT);
    }

    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        exit;
    }

    $sql = 'UPDATE hr_users SET ' . implode(', ', $updates) . ' WHERE id = :id';
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['success' => true]);
    exit;
}

// ── DELETE /api/hr-users/:id ─────────────────────────────────────────────────
if ($method === 'DELETE' && preg_match('#^/(\d+)$#', $uri, $m)) {
    AuthMiddleware::requireAdmin();

    $id = (int)$m[1];
    $stmt = $conn->prepare('DELETE FROM hr_users WHERE id = :id');
    $stmt->execute([':id' => $id]);

    echo json_encode(['success' => true]);
    exit;
}

// ── GET /api/hr-users/stats/:id ──────────────────────────────────────────────
if ($method === 'GET' && preg_match('#^/stats/(\d+)$#', $uri, $m)) {
    $hrUserId = (int)$m[1];

    // Get HR user info
    $stmt = $conn->prepare('SELECT company_name FROM hr_users WHERE id = :id');
    $stmt->execute([':id' => $hrUserId]);
    $hrUser = $stmt->fetch();

    if (!$hrUser) {
        http_response_code(404);
        echo json_encode(['error' => 'HR user not found']);
        exit;
    }

    $company = $hrUser['company_name'];

    // Get campaigns for this company
    $campaignStmt = $conn->prepare('SELECT * FROM hr_campaigns WHERE company = :company ORDER BY created_at DESC');
    $campaignStmt->execute([':company' => $company]);
    $campaigns = $campaignStmt->fetchAll();

    foreach ($campaigns as &$camp) {
        $camp['employees'] = json_decode($camp['employees'], true);
    }
    unset($camp);

    // Get all assessment results for these campaigns
    $campaignIds = array_column($campaigns, 'id');
    $results = [];
    if (!empty($campaignIds)) {
        $placeholders = implode(',', array_fill(0, count($campaignIds), '?'));
        $resStmt = $conn->prepare(
            "SELECT id, name, email, mobile, city, designation, campaign_id, campaign_name,
                    physical_score, emotional_score, total_score, percentage, wellness_category, submitted_at
             FROM assessment_results
             WHERE campaign_id IN ($placeholders)
             ORDER BY submitted_at DESC"
        );
        $resStmt->execute($campaignIds);
        $results = $resStmt->fetchAll();
    }

    // Summary stats
    $totalEmployeesInvited = 0;
    $totalAssessmentsCompleted = count($results);
    foreach ($campaigns as $camp) {
        $totalEmployeesInvited += count($camp['employees'] ?? []);
    }

    echo json_encode([
        'success'   => true,
        'company'   => $company,
        'campaigns' => $campaigns,
        'results'   => $results,
        'stats'     => [
            'total_campaigns'    => count($campaigns),
            'total_invited'      => $totalEmployeesInvited,
            'total_completed'    => $totalAssessmentsCompleted,
            'completion_rate'    => $totalEmployeesInvited > 0
                ? round(($totalAssessmentsCompleted / $totalEmployeesInvited) * 100, 1)
                : 0,
        ]
    ]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'HR users route not found']);
