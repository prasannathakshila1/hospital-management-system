<?php
require_once '../config/database.php';

class Document {
    private $conn;
    private $table_name = "documents";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function create($user_uuid, $report_type, $report_date, $file_path, $description, $status, $doctor_name, $patient_name, $test_results, $comments) {
        $query = "INSERT INTO " . $this->table_name . " (user_uuid, report_type, report_date, file_path, description, status, doctor_name, patient_name, test_results, comments) 
                  VALUES (:user_uuid, :report_type, :report_date, :file_path, :description, :status, :doctor_name, :patient_name, :test_results, :comments)";
    
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_uuid', $user_uuid);
        $stmt->bindParam(':report_type', $report_type);
        $stmt->bindParam(':report_date', $report_date);
        $stmt->bindParam(':file_path', $file_path);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':doctor_name', $doctor_name);
        $stmt->bindParam(':patient_name', $patient_name);
        $stmt->bindParam(':test_results', $test_results);
        $stmt->bindParam(':comments', $comments);
    
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    
    public function getReportsByUserId($user_uuid) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE user_uuid = :user_uuid";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_uuid', $user_uuid);
        $stmt->execute();
    
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
}
?>
