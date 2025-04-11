<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT, OPTIONS"); // Add PUT here
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request (OPTIONS request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../controllers/AppointmentController.php';

$controller = new AppointmentController();

$requestMethod = $_SERVER['REQUEST_METHOD'];
$route = $_GET['route'] ?? '';

try {
    if ($requestMethod === 'POST' && $route === 'create') {
        $controller->createAppointment();
    } elseif ($requestMethod === 'GET' && $route === 'list') {
        $controller->listAppointments();
    } elseif ($requestMethod === 'PUT' && $route === 'update') {
        $controller->editAppointment();
    
    } elseif ($requestMethod === 'DELETE' && $route === 'delete') {
        $controller->deleteAppointment();
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Invalid endpoint or method']);
    }
} catch (Exception $e) {
    // Log the error and send a JSON response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Internal Server Error', 'error' => $e->getMessage()]);
}
?>
