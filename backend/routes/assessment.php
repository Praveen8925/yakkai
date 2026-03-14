<?php
// Routes handled here:
//   POST   /api/assessment/submit           — save an assessment result
//   GET    /api/assessment/check/:linkId    — has this link been submitted already?
//   POST   /api/assessment/campaign         — HR: create a campaign
//   GET    /api/assessment/campaigns        — HR: list all campaigns
//   PUT    /api/assessment/campaign/:id     — HR: update employee status in campaign
//   GET    /api/assessment/results          — Admin: all results
//   GET    /api/assessment/results/:campaign_id — HR: results for one campaign

require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db     = new Database();
$conn   = $db->getConnection();

// Parse sub-path after /assessment
// $requestUri already has /assessment stripped by index.php, leaving e.g. /submit or /check/ABC
$uri = preg_replace('#^/assessment#', '', $GLOBALS['requestUri'] ?? '');
$uri = '/' . ltrim($uri, '/');

// ── POST /api/assessment/submit ───────────────────────────────────────────────
if ($method === 'POST' && $uri === '/submit') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    $type         = in_array($data['type'] ?? '', ['individual','employee']) ? $data['type'] : 'individual';
    $name         = trim($data['name']         ?? '');
    $email        = trim($data['email']        ?? '');
    $mobile       = trim($data['mobile']       ?? '');
    $city         = trim($data['city']         ?? '');
    $designation  = trim($data['designation']  ?? '');
    $campaignId   = trim($data['campaignId']   ?? '') ?: null;
    $campaignName = trim($data['campaignName'] ?? '') ?: null;
    $linkId       = trim($data['linkId']       ?? '') ?: null;

    $physicalScore  = (int)($data['physicalScore']  ?? 0);
    $physicalMax    = (int)($data['physicalMax']    ?? 24);
    $emotionalScore = (int)($data['emotionalScore'] ?? 0);
    $emotionalMax   = (int)($data['emotionalMax']   ?? 24);
    $totalScore     = (int)($data['totalScore']     ?? 0);
    $totalMax       = (int)($data['totalMax']       ?? 48);
    $percentage     = $totalMax > 0 ? (int)round(($totalScore / $totalMax) * 100) : 0;
    $answers        = isset($data['answers']) ? json_encode($data['answers']) : null;

    // Determine category
    if ($percentage >= 80)      $category = 'Excellent';
    elseif ($percentage >= 60)  $category = 'Good';
    elseif ($percentage >= 40)  $category = 'Needs Attention';
    else                        $category = 'Critical';

    if (!$name || !$email) {
        http_response_code(400);
        echo json_encode(['error' => 'Name and email are required']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit;
    }

    // For employee type, prevent duplicate submission for the same linkId
    if ($type === 'employee' && $linkId) {
        $check = $conn->prepare('SELECT id FROM assessment_results WHERE link_id = :lid LIMIT 1');
        $check->execute([':lid' => $linkId]);
        if ($check->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'already_submitted', 'message' => 'This assessment has already been submitted.']);
            exit;
        }
    }

    $stmt = $conn->prepare(
        'INSERT INTO assessment_results
            (type, name, email, mobile, city, designation,
             campaign_id, campaign_name, link_id,
             physical_score, physical_max, emotional_score, emotional_max,
             total_score, total_max, percentage, wellness_category, answers)
         VALUES
            (:type, :name, :email, :mobile, :city, :designation,
             :campaign_id, :campaign_name, :link_id,
             :physical_score, :physical_max, :emotional_score, :emotional_max,
             :total_score, :total_max, :percentage, :category, :answers)'
    );
    $stmt->execute([
        ':type'            => $type,
        ':name'            => $name,
        ':email'           => $email,
        ':mobile'          => $mobile,
        ':city'            => $city,
        ':designation'     => $designation,
        ':campaign_id'     => $campaignId,
        ':campaign_name'   => $campaignName,
        ':link_id'         => $linkId,
        ':physical_score'  => $physicalScore,
        ':physical_max'    => $physicalMax,
        ':emotional_score' => $emotionalScore,
        ':emotional_max'   => $emotionalMax,
        ':total_score'     => $totalScore,
        ':total_max'       => $totalMax,
        ':percentage'      => $percentage,
        ':category'        => $category,
        ':answers'         => $answers,
    ]);

    // If employee type, mark that employee as 'Completed' in the campaign
    if ($type === 'employee' && $campaignId && $linkId) {
        $camp = $conn->prepare('SELECT employees FROM hr_campaigns WHERE id = :id');
        $camp->execute([':id' => $campaignId]);
        $row = $camp->fetch();
        if ($row) {
            $employees = json_decode($row['employees'], true);
            foreach ($employees as &$emp) {
                if ($emp['linkId'] === $linkId) {
                    $emp['status'] = 'Completed';
                    break;
                }
            }
            unset($emp);
            $upd = $conn->prepare('UPDATE hr_campaigns SET employees = :emp WHERE id = :id');
            $upd->execute([':emp' => json_encode($employees), ':id' => $campaignId]);
        }
    }

    http_response_code(201);
    echo json_encode([
        'success'   => true,
        'id'        => (int)$conn->lastInsertId(),
        'percentage'=> $percentage,
        'category'  => $category,
    ]);
    exit;
}

// ── GET /api/assessment/check/:linkId ─────────────────────────────────────────
if ($method === 'GET' && preg_match('#^/check/([A-Z0-9]{4,20})$#i', $uri, $m)) {
    $linkId = $m[1];
    $stmt = $conn->prepare('SELECT id, name, submitted_at FROM assessment_results WHERE link_id = :lid LIMIT 1');
    $stmt->execute([':lid' => $linkId]);
    $row = $stmt->fetch();
    echo json_encode(['submitted' => (bool)$row, 'data' => $row ?: null]);
    exit;
}

// ── POST /api/assessment/campaign ─────────────────────────────────────────────
if ($method === 'POST' && $uri === '/campaign') {
    $data      = json_decode(file_get_contents('php://input'), true) ?? [];
    $id        = trim($data['id']           ?? '');
    $name      = trim($data['name']         ?? '');
    $dept      = trim($data['department']   ?? '');
    $deadline  = trim($data['deadline']     ?? '') ?: null;
    $createdBy = trim($data['createdBy']    ?? '');
    $company   = trim($data['company']      ?? '');
    $employees = $data['employees'] ?? [];

    if (!$id || !$name || !$createdBy) {
        http_response_code(400);
        echo json_encode(['error' => 'id, name and createdBy are required']);
        exit;
    }

    $stmt = $conn->prepare(
        'INSERT INTO hr_campaigns (id, name, department, deadline, created_by, company, employees)
         VALUES (:id, :name, :dept, :deadline, :created_by, :company, :employees)
         ON DUPLICATE KEY UPDATE name = VALUES(name)'
    );
    $stmt->execute([
        ':id'         => $id,
        ':name'       => $name,
        ':dept'       => $dept,
        ':deadline'   => $deadline,
        ':created_by' => $createdBy,
        ':company'    => $company,
        ':employees'  => json_encode($employees),
    ]);

    http_response_code(201);
    echo json_encode(['success' => true, 'id' => $id]);
    exit;
}

// ── GET /api/assessment/campaigns ─────────────────────────────────────────────
if ($method === 'GET' && $uri === '/campaigns') {
    $company   = trim($_GET['company']   ?? '');
    $createdBy = trim($_GET['createdBy'] ?? '');

    if ($company) {
        $stmt = $conn->prepare('SELECT * FROM hr_campaigns WHERE company = :company ORDER BY created_at DESC');
        $stmt->execute([':company' => $company]);
    } elseif ($createdBy) {
        $stmt = $conn->prepare('SELECT * FROM hr_campaigns WHERE created_by = :cb ORDER BY created_at DESC');
        $stmt->execute([':cb' => $createdBy]);
    } else {
        $stmt = $conn->prepare('SELECT * FROM hr_campaigns ORDER BY created_at DESC');
        $stmt->execute();
    }
    $rows = $stmt->fetchAll();
    // Decode JSON employees column
    foreach ($rows as &$row) {
        $row['employees'] = json_decode($row['employees'], true);
    }
    unset($row);
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

// ── GET /api/assessment/results  (admin — all; HR — filtered by company) ────────────────────────────────
if ($method === 'GET' && $uri === '/results') {
    require_once __DIR__ . '/../middleware/AuthMiddleware.php';

    $company = trim($_GET['company'] ?? '');

    if ($company) {
        // HR user: get results only for campaigns belonging to their company
        $stmt = $conn->prepare(
            'SELECT ar.id, ar.type, ar.name, ar.email, ar.mobile, ar.city, ar.designation,
                    ar.campaign_id, ar.campaign_name, ar.link_id,
                    ar.physical_score, ar.physical_max, ar.emotional_score, ar.emotional_max,
                    ar.total_score, ar.total_max, ar.percentage, ar.wellness_category,
                    ar.answers, ar.submitted_at
             FROM assessment_results ar
             INNER JOIN hr_campaigns hc ON ar.campaign_id = hc.id
             WHERE hc.company = :company
             ORDER BY ar.submitted_at DESC'
        );
        $stmt->execute([':company' => $company]);
    } else {
        // Admin: require admin token, get all results
        AuthMiddleware::requireAdmin();
        $stmt = $conn->prepare(
            'SELECT id, type, name, email, mobile, city, designation,
                    campaign_id, campaign_name, link_id,
                    physical_score, physical_max, emotional_score, emotional_max,
                    total_score, total_max, percentage, wellness_category,
                    answers, submitted_at
             FROM assessment_results ORDER BY submitted_at DESC'
        );
        $stmt->execute();
    }

    $rows = $stmt->fetchAll();
    // Decode JSON answers column
    foreach ($rows as &$row) {
        $row['answers'] = $row['answers'] ? json_decode($row['answers'], true) : null;
    }
    unset($row);
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

// ── GET /api/assessment/results/:campaignId  (HR — one campaign) ──────────────
if ($method === 'GET' && preg_match('#^/results/([A-Z0-9]{4,20})$#i', $uri, $m)) {
    $campaignId = $m[1];
    $stmt = $conn->prepare(
        'SELECT id, type, name, email, mobile, city, designation, link_id,
                physical_score, physical_max, emotional_score, emotional_max,
                total_score, total_max, percentage, wellness_category,
                answers, submitted_at
         FROM assessment_results
         WHERE campaign_id = :cid
         ORDER BY submitted_at DESC'
    );
    $stmt->execute([':cid' => $campaignId]);
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        $row['answers'] = $row['answers'] ? json_decode($row['answers'], true) : null;
    }
    unset($row);
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Assessment route not found']);
