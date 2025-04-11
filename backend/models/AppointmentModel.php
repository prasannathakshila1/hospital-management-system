<?php
require_once '../config/database.php';  // Ensure the correct relative path to the config file

class AppointmentModel {
    private $conn;
    private $name;
    private $email;
    private $phone;
    private $session_id;
    private $userID;
    private $id;
    private $created_at;  // Add created_at property
    private $appointmentID;

    // Constructor to initialize properties with appointment data
    public function __construct($data = []) {
        $database = new Database();
        $this->conn = $database->connect();
        
        $this->name = $data['name'] ?? null;
        $this->email = $data['email'] ?? null;
        $this->phone = $data['phone'] ?? null;
        $this->session_id = $data['session_id'] ?? null;
        $this->userID = $data['userID'] ?? null;
        $this->created_at = date('Y-m-d H:i:s');  // Set created_at to current timestamp
        $this->appointmentID = $this->generateAppointmentID();
    
        // Validate that session_id is not null
        if (is_null($this->session_id)) {
            throw new Exception("Session ID cannot be null");
        }
    }
        // Method to generate a 16-character unique appointment ID
        private function generateAppointmentID() {
            return substr(bin2hex(random_bytes(8)), 0, 16); // Generates a 16-character hex string
        }
    
        // Getters for private properties
        public function getAppointmentID() {
            return $this->appointmentID;
        }
    // Getters for private properties
    public function getName() {
        return $this->name;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getPhone() {
        return $this->phone;
    }

    public function getsession_id() {
        error_log("Received session_id: " . $this->session_id);
        return $this->session_id;
    }

    public function getUserId() {
        return $this->userID;
    }

    public function getCreatedAt() {
        return $this->created_at;
    }

    public function save() {
        // Step 1: Get the current appointment number for the session
        $query = "SELECT COUNT(*) FROM appointments WHERE session_id = :session_id";
        $stmt = $this->conn->prepare($query);
        $session_id = $this->getsession_id();  // Store value in a variable
        $stmt->bindParam(':session_id', $session_id);
        $stmt->execute();
        $count = $stmt->fetchColumn();

        // Step 2: Increment the appointment number (1-based index)
        $appointment_number = $count + 1;

        // Step 3: Insert the new appointment including the appointmentID and created_at field
        $query = "INSERT INTO appointments (name, email, phone, session_id, userID, appointmentID, appointment_number, created_at) 
                  VALUES (:name, :email, :phone, :session_id, :userID, :appointmentID, :appointment_number, :created_at)";
        
        $stmt = $this->conn->prepare($query);
        
        // Store the values in variables before binding
        $name = $this->getName();
        $email = $this->getEmail();
        $phone = $this->getPhone();
        $userID = $this->getUserId();
        $appointmentID = $this->getAppointmentID();
        $created_at = $this->getCreatedAt();

        // Bind the properties using the variables
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':session_id', $session_id);
        $stmt->bindParam(':userID', $userID);
        $stmt->bindParam(':appointmentID', $appointmentID);  // Bind the 16-character appointmentID
        $stmt->bindParam(':appointment_number', $appointment_number);
        $stmt->bindParam(':created_at', $created_at);

        try {
            if ($stmt->execute()) {
                return true;
            } else {
                return false;
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()]);
            return false;
        }
    }



public static function listAppointments($userID) {
    $database = new Database();
    $conn = $database->connect();

    // Query appointments based on userID
    $query = "SELECT * FROM appointments WHERE userID = :userID";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':userID', $userID);

    try {
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);  // This will return all appointments with their associated userID
    } catch (PDOException $e) {
        throw new Exception('Database Error: ' . $e->getMessage());
    }
}


    // Method to update appointment data
    public function update() {
        $query = "UPDATE appointments 
                  SET name = :name, email = :email, phone = :phone, date = :date, time = :time, department = :department
                  WHERE id = :id";
    
        $stmt = $this->conn->prepare($query);
    
        // Bind the parameters using getters
        $stmt->bindParam(':name', $this->getName());
        $stmt->bindParam(':email', $this->getEmail());
        $stmt->bindParam(':phone', $this->getPhone());
        $stmt->bindParam(':date', $this->date);
        $stmt->bindParam(':time', $this->time);
        $stmt->bindParam(':department', $this->department);
        $stmt->bindParam(':id', $this->id);
    
        try {
            if ($stmt->execute()) {
                return true;
            } else {
                return false;
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()]);
            return false;
        }
    }
}
?>
