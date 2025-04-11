<?php
require_once '../controllers/UserController.php';

// Allow access from any origin (for development only)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Set response headers
header('Content-Type: application/json');

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Only POST requests are allowed.']);
    exit;
}

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if `action` is provided
if (empty($data['action'])) {
    echo json_encode(['success' => false, 'message' => 'Action is required.']);
    exit;
}

$userController = new UserController();
$action = $data['action'];
// Start the session
session_start();
if ($action === 'register') {
    $response = $userController->register($data);
    echo json_encode($response);
} elseif ($action === 'getUsers') {
    // Fetch users using the controller method
    $response = $userController->getAllUsers(); 
    
    // Return the response as JSON
    echo json_encode($response); 
    exit;
} elseif ($action === 'delete') {
    $response = $userController->deleteUser($data['uuid']);
    echo json_encode($response);
}  elseif ($action === 'update') {
    $response = $userController->editUser($data); 
    error_log("Response from editUser: " . print_r($response, true));  // Log the response
    echo json_encode($response);    
} elseif ($action === 'login') {
    $response = $userController->login($data);
    if ($response['success']) {
        // Store uuid and role in the session
        $_SESSION['uuid'] = $response['userData']['uuid'];
        $_SESSION['role'] = $response['userData']['role'];
    }
    echo json_encode($response); 
}elseif ($action === 'getUserByUUID') {
    if (empty($data['uuid'])) {
        echo json_encode(['success' => false, 'message' => 'UUID is required.']);
        exit;
    }
    
    $response = $userController->getUserByUUID($data['uuid']);
    echo json_encode($response);
}
 else {
    echo json_encode(['success' => false, 'message' => 'Invalid action.']);
}
