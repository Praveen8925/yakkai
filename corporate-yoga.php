<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database credentials
$host = 'localhost';
$db   = 'yakkai';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

// PDO connection
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Collect POST data
$company_code = $_POST['company_code'] ?? '';
$name         = $_POST['name'] ?? '';
$mobile       = $_POST['mobile'] ?? '';
$email        = $_POST['email'] ?? '';
$designation  = $_POST['designation'] ?? '';

$q1 = $_POST['q1'] ?? null;
$q2 = $_POST['q2'] ?? null;
$q3 = $_POST['q3'] ?? null;
$q4 = $_POST['q4'] ?? null;
$q5 = $_POST['q5'] ?? null;
$q6 = $_POST['q6'] ?? null;
$q7 = $_POST['q7'] ?? null;
$q8 = $_POST['q8'] ?? null;
$q9 = $_POST['q9'] ?? null;
$q10 = $_POST['q10'] ?? null;
$q11 = $_POST['q11'] ?? null;
$q12 = $_POST['q12'] ?? null;

// Insert query including submitted_at
$sql = "INSERT INTO wellness_responses 
(company_code, q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12, name, mobile, email, designation, submitted_at)
VALUES 
(:company_code, :q1,:q2,:q3,:q4,:q5,:q6,:q7,:q8,:q9,:q10,:q11,:q12, :name, :mobile, :email, :designation, NOW())";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    ':company_code' => $company_code,
    ':q1'=>$q1, ':q2'=>$q2, ':q3'=>$q3, ':q4'=>$q4, ':q5'=>$q5, ':q6'=>$q6,
    ':q7'=>$q7, ':q8'=>$q8, ':q9'=>$q9, ':q10'=>$q10, ':q11'=>$q11, ':q12'=>$q12,
    ':name' => $name,
    ':mobile' => $mobile,
    ':email' => $email,
    ':designation' => $designation
]);

echo "Form submitted successfully!";
?>
