<?php
// Programs CRUD routes
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$db = new Database();
$conn = $db->getConnection();

$requestMethod = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Helper to generate slug from title
function generateSlug($title) {
    return strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
}

// GET /api/programs - List all programs (PUBLIC for active, filters for admin)
if ($requestMethod === 'GET' && !preg_match('#/\d+$#', $path)) {
    $status = $_GET['status'] ?? 'active';
    $search = $_GET['search'] ?? '';
    
    // Check if admin (optional auth)
    $isAdmin = false;
    try {
        $user = AuthMiddleware::authenticate();
        $isAdmin = ($user['role'] === 'admin');
    } catch (Exception $e) {
        // Not authenticated, show only active programs
    }
    
    $sql = "SELECT * FROM programs WHERE 1=1";
    $params = [];
    
    if (!$isAdmin) {
        $sql .= " AND status = 'active'";
    } elseif ($status !== 'all') {
        $sql .= " AND status = :status";
        $params[':status'] = $status;
    }
    
    if (!empty($search)) {
        $sql .= " AND (title LIKE :search OR description LIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    $sql .= " ORDER BY created_at DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $programs = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $programs
    ]);
    exit;
}

// GET /api/programs/:id - Get single program
if ($requestMethod === 'GET' && preg_match('#/(\d+)$#', $path, $matches)) {
    $id = $matches[1];
    
    $stmt = $conn->prepare("SELECT * FROM programs WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $program = $stmt->fetch();
    
    if (!$program) {
        http_response_code(404);
        echo json_encode(['error' => 'Program not found']);
        exit;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $program
    ]);
    exit;
}

// POST /api/programs - Create program (ADMIN ONLY)
if ($requestMethod === 'POST') {
    $user = AuthMiddleware::requireAdmin();
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    $title = $data['title'] ?? '';
    $slug = generateSlug($title);
    $icon = $data['icon'] ?? 'fas fa-yoga';
    $description = $data['description'] ?? '';
    $content = $data['content'] ?? '';
    $highlight = $data['highlight'] ?? '';
    $status = $data['status'] ?? 'active';
    
    $stmt = $conn->prepare("
        INSERT INTO programs (title, slug, icon, description, content, highlight, status, created_at, updated_at)
        VALUES (:title, :slug, :icon, :description, :content, :highlight, :status, NOW(), NOW())
    ");
    
    $stmt->execute([
        ':title' => $title,
        ':slug' => $slug,
        ':icon' => $icon,
        ':description' => $description,
        ':content' => $content,
        ':highlight' => $highlight,
        ':status' => $status
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Program created successfully',
        'id' => $conn->lastInsertId()
    ]);
    exit;
}

// PUT /api/programs/:id - Update program (ADMIN ONLY)
if ($requestMethod === 'PUT' && preg_match('#/(\d+)$#', $path, $matches)) {
    $user = AuthMiddleware::requireAdmin();
    $id = $matches[1];
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    $title = $data['title'] ?? '';
    $slug = generateSlug($title);
    $icon = $data['icon'] ?? '';
    $description = $data['description'] ?? '';
    $content = $data['content'] ?? '';
    $highlight = $data['highlight'] ?? '';
    $status = $data['status'] ?? '';
    
    $stmt = $conn->prepare("
        UPDATE programs 
        SET title = :title, slug = :slug, icon = :icon, description = :description, 
            content = :content, highlight = :highlight, status = :status, updated_at = NOW()
        WHERE id = :id
    ");
    
    $stmt->execute([
        ':title' => $title,
        ':slug' => $slug,
        ':icon' => $icon,
        ':description' => $description,
        ':content' => $content,
        ':highlight' => $highlight,
        ':status' => $status,
        ':id' => $id
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Program updated successfully'
    ]);
    exit;
}

// DELETE /api/programs/:id - Delete program (ADMIN ONLY)
if ($requestMethod === 'DELETE' && preg_match('#/(\d+)$#', $path, $matches)) {
    $user = AuthMiddleware::requireAdmin();
    $id = $matches[1];
    
    $stmt = $conn->prepare("DELETE FROM programs WHERE id = :id");
    $stmt->execute([':id' => $id]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Program deleted successfully'
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
