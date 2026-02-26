<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$database = new Database();
$conn = $database->connect();

// Get ID from URL if present
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriSegments = explode('/', $uri);
$id = end($uriSegments);
$id = is_numeric($id) ? (int)$id : null;

switch ($method) {
    case 'GET':
        getGalleryImages($conn);
        break;
    case 'POST':
        AuthMiddleware::requireAdmin();
        createGalleryImage($conn);
        break;
    case 'PUT':
        AuthMiddleware::requireAdmin();
        updateGalleryImage($conn, $id);
        break;
    case 'DELETE':
        AuthMiddleware::requireAdmin();
        deleteGalleryImage($conn, $id);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

function getGalleryImages($conn) {
    try {
        $stmt = $conn->prepare("
            SELECT id, image_url, caption, display_order 
            FROM gallery 
            ORDER BY display_order ASC, id ASC
        ");
        $stmt->execute();
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'data' => $images
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function createGalleryImage($conn) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['image_url'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Image URL is required']);
            return;
        }

        $imageUrl = $data['image_url'];
        $caption = $data['caption'] ?? '';
        $displayOrder = $data['display_order'] ?? 0;

        $stmt = $conn->prepare("
            INSERT INTO gallery (image_url, caption, display_order) 
            VALUES (:image_url, :caption, :display_order)
        ");
        
        $stmt->bindParam(':image_url', $imageUrl);
        $stmt->bindParam(':caption', $caption);
        $stmt->bindParam(':display_order', $displayOrder, PDO::PARAM_INT);
        $stmt->execute();

        $newId = $conn->lastInsertId();

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Gallery image added successfully',
            'id' => $newId
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateGalleryImage($conn, $id) {
    try {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Image ID is required']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        // Build dynamic update query
        $updates = [];
        $params = [':id' => $id];

        if (isset($data['image_url'])) {
            $updates[] = 'image_url = :image_url';
            $params[':image_url'] = $data['image_url'];
        }
        if (isset($data['caption'])) {
            $updates[] = 'caption = :caption';
            $params[':caption'] = $data['caption'];
        }
        if (isset($data['display_order'])) {
            $updates[] = 'display_order = :display_order';
            $params[':display_order'] = $data['display_order'];
        }

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }

        $sql = "UPDATE gallery SET " . implode(', ', $updates) . " WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Gallery image not found']);
            return;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Gallery image updated successfully'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function deleteGalleryImage($conn, $id) {
    try {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Image ID is required']);
            return;
        }

        // Get image URL before deleting to remove file
        $stmt = $conn->prepare("SELECT image_url FROM gallery WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $image = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$image) {
            http_response_code(404);
            echo json_encode(['error' => 'Gallery image not found']);
            return;
        }

        // Delete from database
        $stmt = $conn->prepare("DELETE FROM gallery WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        // Optionally delete file from filesystem
        // $filepath = __DIR__ . '/../../frontend/public' . $image['image_url'];
        // if (file_exists($filepath) && strpos($image['image_url'], '/uploads/') === 0) {
        //     unlink($filepath);
        // }

        echo json_encode([
            'success' => true,
            'message' => 'Gallery image deleted successfully'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
