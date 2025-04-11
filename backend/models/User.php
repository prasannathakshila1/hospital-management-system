<?php
require_once '../config/database.php';

class User {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    // Check if email is already registered
    public function isEmailRegistered($email) {
        $query = "SELECT * FROM users WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Register a new user with default role 'user'
    public function register($uuid, $name, $email, $hashedPassword, $role = 'user') {
        // Add the role parameter into the insert query
        $query = "INSERT INTO users (uuid, name, email, password, role, created_at) 
                  VALUES (:uuid, :name, :email, :password, :role, NOW())";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':uuid', $uuid);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':role', $role);  // Bind role
        return $stmt->execute();
    }

    // Get user by email
    public function getUserByEmail($email) {
        $query = "SELECT * FROM users WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    // Get all users
public function getAllUsers() {
    $query = "SELECT * FROM users";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Debugging: Log or echo the results
    error_log(print_r($results, true));
    
    return $results;
}


// Delete user by UUID
public function deleteUserByUUID($uuid) {
    $query = "DELETE FROM users WHERE uuid = :uuid";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':uuid', $uuid);
    return $stmt->execute();
}
public function updateUser($uuid, $name, $email, $role) {
    try {
        $query = "UPDATE users SET name = :name, email = :email, role = :role WHERE uuid = :uuid";
        $stmt = $this->conn->prepare($query);  // Use $this->conn instead of $this->db

        $stmt->bindParam(':uuid', $uuid);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':role', $role);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return true;
        } else {
            error_log("No rows updated for UUID: $uuid");
            return false;
        }
    } catch (PDOException $e) {
        error_log("Error updating user: " . $e->getMessage());
        return false;
    }
}
public function getUserByUUID($uuid) {
    $query = "SELECT * FROM users WHERE uuid = :uuid";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':uuid', $uuid);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}



}
