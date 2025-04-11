<?php
class Report {
    private $conn;
    private $table = 'reports';

    // Report properties
    public $id;
    public $message;
    public $userId;
    public $date;

    // Constructor to initialize the database connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create a new report
    public function create() {
        $query = "INSERT INTO " . $this->table . " (message, userId, date) VALUES (:message, :userId, :date)";
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->message = htmlspecialchars(strip_tags($this->message));
        $this->userId = htmlspecialchars(strip_tags($this->userId));
        $this->date = htmlspecialchars(strip_tags($this->date));

        // Bind data
        $stmt->bindParam(':message', $this->message);
        $stmt->bindParam(':userId', $this->userId);
        $stmt->bindParam(':date', $this->date);

        // Execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
    // Get all reports
public function getAll() {
    $query = "SELECT * FROM " . $this->table . " ORDER BY date DESC";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt;
}

}
?>
