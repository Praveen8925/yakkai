<?php
// Simple debug test - access at: http://localhost/Yakkai_Neri/backend/test.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>✅ PHP is working!</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";

// Test DB connection
$host   = 'localhost';
$dbname = 'yakkai_neri';
$user   = 'root';
$pass   = '';

echo "<h3>Testing MySQL Connection...</h3>";
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
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

// Test .env reading
echo "<h3>Environment (.env) Test:</h3>";
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        [$key, $value] = explode('=', $line, 2);
        echo "<p><b>" . htmlspecialchars(trim($key)) . "</b> = " . htmlspecialchars(trim($value)) . "</p>";
    }
} else {
    echo "<p style='color:red'>❌ .env file not found!</p>";
}

// Test mod_rewrite
echo "<h3>Server Info:</h3>";
echo "<p>Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p>Request URI: " . $_SERVER['REQUEST_URI'] . "</p>";
echo "<p>Script path: " . __FILE__ . "</p>";
