<?php
// Simple debug test - access at: http://localhost/yakkai-main/backend/test.php
// ⚠️  Delete this file from production (GoDaddy) after testing!
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>✅ PHP is working!</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";

// Load environment variables from .env
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (!str_contains($line, '=')) continue;
        [$key, $value] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

// Test DB connection using .env values
$host   = $_ENV['DB_HOST']   ?? 'localhost';
$port   = $_ENV['DB_PORT']   ?? '3306';
$dbname = $_ENV['DB_NAME']   ?? '';
$user   = $_ENV['DB_USER']   ?? 'root';
$pass   = $_ENV['DB_PASS']   ?? '';

echo "<h3>Testing MySQL Connection...</h3>";
try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "<p style='color:green'>✅ MySQL connected successfully to <b>$dbname</b></p>";

    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "<p>Tables found: <b>" . implode(', ', $tables) . "</b></p>";

    $count = $pdo->query("SELECT COUNT(*) FROM programs")->fetchColumn();
    echo "<p>Programs in DB: <b>$count</b></p>";

    $count2 = $pdo->query("SELECT COUNT(*) FROM gallery")->fetchColumn();
    echo "<p>Gallery images in DB: <b>$count2</b></p>";

    $users = $pdo->query("SELECT id, name, email, role FROM users")->fetchAll();
    echo "<h3>Admin Users:</h3><pre>" . print_r($users, true) . "</pre>";

} catch (PDOException $e) {
    echo "<p style='color:red'>❌ DB Error: " . $e->getMessage() . "</p>";
}

// Show loaded .env values (hide password)
echo "<h3>Environment (.env) Values:</h3>";
if (!empty($_ENV['DB_NAME'])) {
    echo "<p><b>DB_HOST</b> = " . htmlspecialchars($host) . "</p>";
    echo "<p><b>DB_NAME</b> = " . htmlspecialchars($dbname) . "</p>";
    echo "<p><b>DB_USER</b> = " . htmlspecialchars($user) . "</p>";
    echo "<p><b>DB_PASS</b> = *** (hidden)</p>";
    echo "<p><b>APP_ENV</b> = " . htmlspecialchars($_ENV['APP_ENV'] ?? 'not set') . "</p>";
    echo "<p><b>APP_URL</b> = " . htmlspecialchars($_ENV['APP_URL'] ?? 'not set') . "</p>";
} else {
    echo "<p style='color:red'>❌ .env file not found or empty!</p>";
}

// Test mod_rewrite
echo "<h3>Server Info:</h3>";
echo "<p>Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p>Request URI: " . $_SERVER['REQUEST_URI'] . "</p>";
echo "<p>Script path: " . __FILE__ . "</p>";
