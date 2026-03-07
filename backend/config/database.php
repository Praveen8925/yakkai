<?php
class Database {
    private string $host;
    private string $port;
    private string $dbname;
    private string $user;
    private string $pass;
    private ?PDO $conn = null;

    public function __construct() {
        $this->host   = $_ENV['DB_HOST']   ?? 'localhost';
        $this->port   = $_ENV['DB_PORT']   ?? '3306';
        $this->dbname = $_ENV['DB_NAME']   ?? 'yakkai_neri';
        $this->user   = $_ENV['DB_USER']   ?? 'root';
        $this->pass   = $_ENV['DB_PASS']   ?? '';
    }

    /**
     * Returns (and lazily creates) the PDO connection.
     * Both getConnection() and connect() are provided for compatibility.
     */
    public function getConnection(): PDO {
        if ($this->conn === null) {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->dbname};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            try {
                $this->conn = new PDO($dsn, $this->user, $this->pass, $options);
            } catch (PDOException $e) {
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
                exit;
            }
        }
        return $this->conn;
    }

    /** Alias kept for routes that call ->connect() */
    public function connect(): PDO {
        return $this->getConnection();
    }
}
