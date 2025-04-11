<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once '../config/database.php';
require_once '../controllers/ReportController.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Instantiate controller
$reportController = new ReportController($db);

// Check if the request is a POST method for creating a report
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod === 'POST') {
    $reportController->createReport();
} elseif ($requestMethod === 'GET') {
    $reportController->getReports();
} else {
    http_response_code(404);
    echo json_encode(["message" => "Invalid request"]);
}

?>
