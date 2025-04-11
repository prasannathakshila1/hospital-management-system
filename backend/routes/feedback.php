<?php
require_once '../config/database.php';
require_once '../controllers/FeedbackController.php';

// Set response headers for CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set response headers
header('Content-Type: application/json');

// Route handling
$requestMethod = $_SERVER['REQUEST_METHOD'];
$route = isset($_GET['route']) ? $_GET['route'] : '';

$controller = new FeedbackController();

if ($requestMethod === 'POST' && $route === 'submitFeedback') {
    $data = json_decode(file_get_contents('php://input'), true);
    $response = $controller->submitFeedback($data);
    echo json_encode($response);
} elseif ($requestMethod === 'GET' && $route === 'getAllFeedback') {
    $response = $controller->getAllFeedback();
    echo json_encode(['success' => true, 'data' => $response]);
} else {
    // Invalid route or method
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Route not found or invalid request method.']);
}
?>
