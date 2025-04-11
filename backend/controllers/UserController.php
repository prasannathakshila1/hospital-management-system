<?php
require_once '../models/User.php';

class UserController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function register($data) {
        // Check if all required fields are provided
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            return ['success' => false, 'message' => 'All fields are required for registration.'];
        }
    
        // Check if the email is already registered
        if ($this->userModel->isEmailRegistered($data['email'])) {
            return ['success' => false, 'message' => 'Email already registered.'];
        }
    
        // Generate a 16-character UUID using random_bytes for better randomness
        $uuid = bin2hex(random_bytes(8));
    
        // Hash the password
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    
        // Set the default role to 'user' if not provided
        $role = isset($data['role']) ? $data['role'] : 'user';
    
        // Attempt to register the user
        if ($this->userModel->register($uuid, $data['name'], $data['email'], $hashedPassword, $role)) {
            return ['success' => true, 'message' => 'Registration successful.'];
        } else {
            return ['success' => false, 'message' => 'Failed to register user.'];
        }
    }
    
    
    public function login($data) {
        if (empty($data['email']) || empty($data['password'])) {
            return ['success' => false, 'message' => 'Email and password are required for login.'];
        }
    
        // Retrieve user by email from the database
        $user = $this->userModel->getUserByEmail($data['email']);
    
        // Check if user exists and if the password is correct
        if (!$user || !password_verify($data['password'], $user['password'])) {
            return ['success' => false, 'message' => 'Invalid email or password.'];
        }
    
        // Return user data along with the uuid
        return [
            'success' => true, 
            'message' => 'Login successful.',
            'userData' => [
                'uuid' => $user['uuid'],  // Include the uuid
                'name' => $user['name'],  // Include other user data if needed
                'role' => $user['role'] // Include the email
                
            ]
        ];
    }
    public function getAllUsers() {
        $users = $this->userModel->getAllUsers();
        
        if (empty($users)) {
            return ['success' => false, 'message' => 'No users found.'];
        }
        
        return ['success' => true, 'users' => $users];
    }
    
    public function editUser($data) {
        $uuid = $data['uuid'];
        $name = $data['name'];
        $email = $data['email'];
        $role = $data['role'];
    
        if (empty($uuid) || empty($name) || empty($email) || empty($role)) {
            error_log("All fields are required for editing the user.");
            return ['success' => false, 'message' => 'All fields are required.'];
        }
    
        $result = $this->userModel->updateUser($uuid, $name, $email, $role);
    
        if ($result) {
            return ['success' => true, 'message' => 'User updated successfully.'];
        } else {
            error_log("Failed to update user: $uuid");
            return ['success' => false, 'message' => 'Failed to update user.'];
        }
    }
    public function getUserByUUID($uuid) {
        $user = $this->userModel->getUserByUUID($uuid);
        
        if (!$user) {
            return ['success' => false, 'message' => 'User not found.'];
        }
        
        return ['success' => true, 'user' => $user];
    }
    
    
    
// Delete user by UUID
public function deleteUser($uuid) {
    return $this->userModel->deleteUserByUUID($uuid);  // Delete the user from the database
}

}
