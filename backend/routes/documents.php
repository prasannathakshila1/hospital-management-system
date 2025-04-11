<?php
require_once '../controllers/DocumentController.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json"); // Ensure JSON response
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$documentController = new DocumentController();

// Updated section in documents.php to handle new fields
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'createReport') {
    // Handle report creation
    $user_uuid = $_POST['user_uuid'];
    $report_type = $_POST['report_type'];
    $report_date = $_POST['report_date'];
    $file = $_FILES['file'];
    $description = $_POST['description']; // New field
    $status = $_POST['status']; // New field
    $doctor_name = $_POST['doctor_name']; // New field
    $patient_name = $_POST['patient_name']; // New field
    $test_results = $_POST['test_results']; // New field
    $comments = $_POST['comments']; // New field

    $response = $documentController->uploadFile($user_uuid, $report_type, $report_date, $file, $description, $status, $doctor_name, $patient_name, $test_results, $comments);
    echo json_encode($response);
    exit;
}


// Handle GET request to retrieve reports
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['user_uuid'])) {
    $user_uuid = $_GET['user_uuid'];
    $documents = $documentController->getReportsByUserId($user_uuid);

    if ($documents) {
        echo json_encode(['success' => true, 'documents' => $documents]);
    } else {
        echo json_encode(['success' => false, 'documents' => [], 'message' => 'No reports found.']);
    }
    exit;
}

// If no valid request method
echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
exit;
?>
