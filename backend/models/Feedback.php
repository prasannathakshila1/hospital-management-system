<?php
class Feedback {
    private $conn;
    private $table_name = "feedback";

    public $id;
    public $name;
    public $email;
    public $feedback;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create a new feedback entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (name, email, feedback, created_at) 
                  VALUES (:name, :email, :feedback, :created_at)";
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->feedback = htmlspecialchars(strip_tags($this->feedback));
        $this->created_at = date('Y-m-d H:i:s');

        // Bind parameters
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":feedback", $this->feedback);
        $stmt->bindParam(":created_at", $this->created_at);

        // Execute query
        return $stmt->execute();
    }

    // Retrieve all feedback entries
    public function getAll() {
        $query = "SELECT id, name, email, feedback, created_at FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
