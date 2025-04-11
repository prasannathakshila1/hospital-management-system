<?php
class Doctor {
    private $conn;
    private $table = 'doctors';

    public $id;
    public $doctorID;
    public $name;
    public $email;
    public $specialization;
    public $phone;
    public $status;
    public $picture;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all doctors
    public function read() {
        $query = 'SELECT * FROM ' . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Get a single doctor
    public function read_single() {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE id = :id LIMIT 0,1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();
        return $stmt;
    }

// Create a doctor
public function create() {
    // Generate a 16-character unique ID
    $this->doctorID = bin2hex(random_bytes(8)); 

    $query = 'INSERT INTO ' . $this->table . ' 
              SET doctorID = :doctorID, name = :name, email = :email, 
                  specialization = :specialization, phone = :phone, 
                  status = :status, picture = :picture';

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':doctorID', $this->doctorID);
    $stmt->bindParam(':name', $this->name);
    $stmt->bindParam(':email', $this->email);
    $stmt->bindParam(':specialization', $this->specialization);
    $stmt->bindParam(':phone', $this->phone);
    $stmt->bindParam(':status', $this->status);
    $stmt->bindParam(':picture', $this->picture);

    if ($stmt->execute()) {
        return true;
    }
    return false;
}


    // Update a doctor
    public function update() {
        $query = 'UPDATE ' . $this->table . ' 
                  SET name = :name, email = :email, specialization = :specialization, 
                      phone = :phone, status = :status, picture = :picture 
                  WHERE id = :id';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':specialization', $this->specialization);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':picture', $this->picture);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Delete a doctor
    public function delete() {
        $query = 'DELETE FROM ' . $this->table . ' WHERE doctorID = :doctorID';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':doctorID', $this->doctorID, PDO::PARAM_STR);
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function read_single_by_doctorID() {
        // Use a placeholder for doctorID in the query
        $query = 'SELECT * FROM ' . $this->table . ' WHERE doctorID = :doctorID';
        
        // Prepare the query
        $stmt = $this->conn->prepare($query);
        
        // Bind the actual doctorID value to the placeholder
        $stmt->bindParam(':doctorID', $this->doctorID);
        
        // Log the query and doctorID value for debugging
        error_log('Query: ' . $query);
        error_log('DoctorID: ' . $this->doctorID);
        
        // Execute the query
        $stmt->execute();
        
        // Return the statement (or the result if needed)
        return $stmt;
    }
    
    
}
