<?php
// contact.php

// Database configuration
$host = 'localhost';       // usually localhost for GoDaddy
$db   = 'yakkai';          // your database name
$user = 'root';   // replace with your DB username
$pass = '';   // replace with your DB password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect and sanitize input
    $name     = trim($_POST['name'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $phone    = trim($_POST['phone'] ?? '');
    $interest = trim($_POST['interest'] ?? '');
    $message  = trim($_POST['message'] ?? '');

    // Validate required fields
    if (empty($name) || empty($email) || empty($message)) {
        die("Name, Email, and Message are required fields.");
    }

    // Insert into database
    $stmt = $pdo->prepare("
        INSERT INTO contact (name, email, phone, interest, message, submitted_at) 
        VALUES (:name, :email, :phone, :interest, :message, NOW())
    ");
    
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':interest', $interest);
    $stmt->bindParam(':message', $message);

    if ($stmt->execute()) {
        echo "Thank you! Your message has been submitted.";
    } else {
        echo "Sorry, something went wrong. Please try again later.";
    }
} else {
    echo "Invalid request.";
}
?>
