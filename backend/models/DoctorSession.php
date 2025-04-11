<?php
class DoctorSession {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Method to generate a random session ID of 16 characters
    private function generateSessionID() {
        return bin2hex(random_bytes(8));  // 8 bytes = 16 characters when converted to hexadecimal
    }

    public function createSession($doctorId, $branch, $date, $startTime, $endTime) {
        // Generate a unique session ID
        $sessionID = $this->generateSessionID();
        
        // SQL query to insert session data along with the generated session ID
        $sql = "INSERT INTO doctor_sessions (session_id, doctor_id, branch, date, start_time, end_time) 
                VALUES (:session_id, :doctor_id, :branch, :date, :start_time, :end_time)";
        
        $stmt = $this->pdo->prepare($sql);
        
        $stmt->bindParam(':session_id', $sessionID);
        $stmt->bindParam(':doctor_id', $doctorId);
        $stmt->bindParam(':branch', $branch);
        $stmt->bindParam(':date', $date);
        $stmt->bindParam(':start_time', $startTime);
        $stmt->bindParam(':end_time', $endTime);
        
        return $stmt->execute();
    }
    public function updateSession($sessionID, $doctorId, $branch, $date, $startTime, $endTime) {
        // SQL query to update the session data
        $sql = "UPDATE doctor_sessions 
                SET doctor_id = :doctor_id, 
                    branch = :branch, 
                    date = :date, 
                    start_time = :start_time, 
                    end_time = :end_time, 
                    updated_at = CURRENT_TIMESTAMP
                WHERE session_id = :session_id";
    
        $stmt = $this->pdo->prepare($sql);
        
        $stmt->bindParam(':session_id', $sessionID);
        $stmt->bindParam(':doctor_id', $doctorId);
        $stmt->bindParam(':branch', $branch);
        $stmt->bindParam(':date', $date);
        $stmt->bindParam(':start_time', $startTime);
        $stmt->bindParam(':end_time', $endTime);
        
        return $stmt->execute();
    }
    public function deleteSession($sessionID) {
        // SQL query to delete the session
        $sql = "DELETE FROM doctor_sessions WHERE session_id = :session_id";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':session_id', $sessionID);
        
        return $stmt->execute();
    }
    public function getAllSessions() {
        // SQL query to fetch all sessions from the doctor_sessions table
        $sql = "SELECT * FROM doctor_sessions";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        
        // Fetch all the rows as an associative array
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getSessionsByDoctorId($doctorId) {
        // SQL query to fetch sessions for a specific doctor
        $sql = "SELECT * FROM doctor_sessions WHERE doctor_id = :doctor_id";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':doctor_id', $doctorId);
        $stmt->execute();
        
        // Fetch all the rows as an associative array
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getSessionBySessionID($sessionID) {
        // SQL query to fetch session by session_id
        $sql = "SELECT * FROM doctor_sessions WHERE session_id = :session_id";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':session_id', $sessionID);
        $stmt->execute();
        
        // Fetch the row as an associative array
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
}
?>
