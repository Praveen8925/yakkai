<?php
/**
 * Admin User Creation Script
 * 
 * SECURITY WARNING: DELETE THIS FILE AFTER USE!
 * 
 * This script creates an admin user for the Yakkai Neri application.
 * Run it once, then DELETE IT immediately for security.
 * 
 * Usage:
 *   php create_admin.php
 */

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
        putenv(trim($line));
    }
}

require_once __DIR__ . '/config/database.php';

echo "==================================================\n";
echo "  Yakkai Neri - Admin User Creation\n";
echo "==================================================\n\n";

// Get user input
echo "Enter admin name (default: Admin User): ";
$name = trim(fgets(STDIN));
$name = $name ?: 'Admin User';

echo "Enter admin email (default: admin@yakkaineri.com): ";
$email = trim(fgets(STDIN));
$email = $email ?: 'admin@yakkaineri.com';

echo "Enter admin password (min 8 chars with uppercase, lowercase, number, special char): ";
$password = trim(fgets(STDIN));

// Validate password
if (strlen($password) < 8) {
    die("ERROR: Password must be at least 8 characters long\n");
}
if (!preg_match('/[A-Z]/', $password)) {
    die("ERROR: Password must contain at least one uppercase letter\n");
}
if (!preg_match('/[a-z]/', $password)) {
    die("ERROR: Password must contain at least one lowercase letter\n");
}
if (!preg_match('/[0-9]/', $password)) {
    die("ERROR: Password must contain at least one number\n");
}
if (!preg_match('/[^A-Za-z0-9]/', $password)) {
    die("ERROR: Password must contain at least one special character\n");
}

// Confirm
echo "\nCreating admin user:\n";
echo "  Name: $name\n";
echo "  Email: $email\n";
echo "  Password: " . str_repeat('*', strlen($password)) . "\n\n";
echo "Continue? (yes/no): ";
$confirm = trim(fgets(STDIN));

if (strtolower($confirm) !== 'yes') {
    die("Cancelled.\n");
}

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Check if user already exists
    $check = $conn->prepare('SELECT id FROM users WHERE email = :email');
    $check->execute([':email' => $email]);
    
    if ($check->fetch()) {
        echo "\nWARNING: User with email '$email' already exists.\n";
        echo "Update password? (yes/no): ";
        $update = trim(fgets(STDIN));
        
        if (strtolower($update) === 'yes') {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $conn->prepare('UPDATE users SET password = :password, updated_at = NOW() WHERE email = :email');
            $stmt->execute([
                ':password' => $hash,
                ':email' => $email
            ]);
            echo "\n✓ Password updated successfully!\n";
        } else {
            die("Cancelled.\n");
        }
    } else {
        // Create new user
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $conn->prepare(
            'INSERT INTO users (name, email, password, role, created_at, updated_at)
             VALUES (:name, :email, :password, :role, NOW(), NOW())'
        );
        
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':password' => $hash,
            ':role' => 'admin'
        ]);

        echo "\n✓ Admin user created successfully!\n";
    }

    echo "\nLogin credentials:\n";
    echo "  Email: $email\n";
    echo "  Password: [the password you entered]\n";
    echo "\n";
    echo "==================================================\n";
    echo "  ⚠️  IMPORTANT SECURITY NOTICE ⚠️\n";
    echo "==================================================\n";
    echo "DELETE THIS SCRIPT IMMEDIATELY!\n";
    echo "Run: rm " . basename(__FILE__) . "\n";
    echo "Or:  del " . basename(__FILE__) . "\n";
    echo "==================================================\n\n";

} catch (PDOException $e) {
    die("ERROR: Database error - " . $e->getMessage() . "\n");
} catch (Exception $e) {
    die("ERROR: " . $e->getMessage() . "\n");
}
