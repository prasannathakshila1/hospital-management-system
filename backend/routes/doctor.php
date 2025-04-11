<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT, OPTIONS"); // Add PUT here
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight request (OPTIONS request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../controllers/DoctorController.php';

$request_method = $_SERVER['REQUEST_METHOD'];
$doctorController = new DoctorController();

// Route to get a specific doctor by ID
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['doctorID'])) {
    $doctorController->show($_GET['doctorID']);
} 
// Route to get all doctors
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $doctorController->index();
}
 elseif ($request_method === 'POST') {
    $doctorController->store();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['doctorID'])) {
    $doctorController->update($_GET['doctorID']);
} elseif ($request_method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['doctorID'])) {
        $doctorController->destroy($data['doctorID']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Doctor ID missing']);
    }
}

