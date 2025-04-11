<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once '../config/database.php';
include_once '../controllers/DoctorSessionController.php';

$database = new Database();
$pdo = $database->connect();

$request_method = $_SERVER['REQUEST_METHOD'];
$doctorSessionController = new DoctorSessionController($pdo);

// Fetch action from query parameters or request body
$action = isset($_GET['action']) ? $_GET['action'] : '';  // You can also use POST for the action if needed

// Check the action and handle accordingly
if ($action === 'create' && $request_method === 'POST') {
    // Extract data from the POST request body
    $data = json_decode(file_get_contents("php://input"));
    $doctorId = $data->doctorId;
    $branch = $data->branch;
    $date = $data->date;
    $startTime = $data->startTime;
    $endTime = $data->endTime;
    
    // Call the controller to create the session
    echo $doctorSessionController->createDoctorSession($doctorId, $branch, $date, $startTime, $endTime);
} 

// Handle PUT request for updating a doctor session
elseif ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $sessionID = $_GET['session_id'];  // Get session_id from the query parameter
    $data = json_decode(file_get_contents("php://input"));
    $doctorId = $data->doctorId;
    $branch = $data->branch;
    $date = $data->date;
    $startTime = $data->startTime;
    $endTime = $data->endTime;
    
    $doctorSessionController->updateDoctorSession($sessionID, $doctorId, $branch, $date, $startTime, $endTime);
}

// Handle DELETE request for deleting a doctor session
elseif ($action === 'delete' && $request_method === 'DELETE') {
    $sessionID = $_GET['session_id'];  // Get session_id from the query parameter
    $doctorSessionController->deleteDoctorSession($sessionID);
}

// Handle GET request for fetching all doctor sessions
elseif ($action === 'get') {
    $doctorSessionController->getAllDoctorSessions();
}elseif ($action === 'getByDoctorId' && isset($_GET['doctorID'])) {
    $doctorId = $_GET['doctorID'];  // Get doctor ID from the query parameter
    $doctorSessionController->getDoctorSessions($doctorId);
}
elseif ($action === 'getBySessionId' && isset($_GET['session_id'])) {
    $sessionID = $_GET['session_id'];  // Get session_id from the query parameter
    $doctorSessionController->getSessionBySessionID($sessionID);
}


// If the action is not recognized
else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid action specified"
    ]);
}
?>
