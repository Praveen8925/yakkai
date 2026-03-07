<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path   = preg_replace('#^/Yakkai_Neri/backend/api#', '', $path);
$path   = preg_replace('#^/api#', '', $path);

$db   = new Database();
$conn = $db->getConnection();

// ── GET /api/pages  — list all page slugs ────────────────────────────────
if ($method === 'GET' && preg_match('#^/pages/?$#', $path)) {
    $stmt = $conn->prepare(
        'SELECT id, page_slug, hero_title, hero_subtitle, intro_text, updated_at
         FROM page_content ORDER BY page_slug ASC'
    );
    $stmt->execute();
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    exit;
}

// ── GET /api/pages/:slug ──────────────────────────────────────────────────
if ($method === 'GET' && preg_match('#^/pages/([a-z0-9-]+)$#', $path, $m)) {
    $slug = $m[1];
    $stmt = $conn->prepare('SELECT * FROM page_content WHERE page_slug = :slug LIMIT 1');
    $stmt->execute([':slug' => $slug]);
    $page = $stmt->fetch();

    if (!$page) {
        http_response_code(404);
        echo json_encode(['error' => 'Page not found']);
        exit;
    }

    echo json_encode(['success' => true, 'data' => $page]);
    exit;
}

// ── PUT /api/pages/:slug  — upsert page content (admin only) ─────────────
if ($method === 'PUT' && preg_match('#^/pages/([a-z0-9-]+)$#', $path, $m)) {
    AuthMiddleware::requireAdmin();
    $slug = $m[1];

    $data        = json_decode(file_get_contents('php://input'), true) ?? [];
    $heroTitle   = $data['hero_title']   ?? null;
    $heroSub     = $data['hero_subtitle'] ?? null;
    $introText   = $data['intro_text']   ?? null;
    $content     = isset($data['content']) ? json_encode($data['content']) : null;

    // Upsert (INSERT … ON DUPLICATE KEY UPDATE)
    $stmt = $conn->prepare(
        'INSERT INTO page_content (page_slug, hero_title, hero_subtitle, intro_text, content, created_at, updated_at)
         VALUES (:slug, :title, :sub, :intro, :content, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
             hero_title    = VALUES(hero_title),
             hero_subtitle = VALUES(hero_subtitle),
             intro_text    = VALUES(intro_text),
             content       = VALUES(content),
             updated_at    = NOW()'
    );
    $stmt->execute([
        ':slug'    => $slug,
        ':title'   => $heroTitle,
        ':sub'     => $heroSub,
        ':intro'   => $introText,
        ':content' => $content,
    ]);

    echo json_encode(['success' => true, 'message' => 'Page content updated successfully']);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Pages route not found']);
