<?php
header('Content-Type: application/json');
include_once '../config/database.php';
include_once '../models/Doctor.php';

class DoctorController {
    private $doctor;

    public function __construct() {
        $database = new Database();
        $db = $database->connect();
        $this->doctor = new Doctor($db);
    }

    // Handle GET requests
    public function index() {
        $result = $this->doctor->read();
        $doctors = $result->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['doctors' => $doctors]);
    }

    public function store() {
        header('Content-Type: application/json');
    
        // Debugging: Check received data
        file_put_contents("debug.log", print_r($_POST, true));
    
        if (empty($_POST['doctorName']) || empty($_POST['doctorEmail']) || empty($_POST['specialization']) || empty($_POST['phone'])) {
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            return;
        }
    
        $this->doctor->name = $_POST['doctorName'];
        $this->doctor->email = $_POST['doctorEmail'];
        $this->doctor->specialization = $_POST['specialization'];
        $this->doctor->phone = $_POST['phone'];
        $this->doctor->status = $_POST['status'];
        $this->doctor->picture = $_POST['picture'] ?? ''; // Handle file uploads if required
    
        if ($this->doctor->create()) {
            echo json_encode([
                'success' => true, 
                'message' => 'Doctor added successfully',
                'doctorID' => $this->doctor->doctorID
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add doctor']);
        }
    }
    
    
    

    // Handle PUT requests
    public function update($id = null) {
        parse_str(file_get_contents("php://input"), $post_vars);
    
        // If ID is null, try getting it from the request
        if (!$id && isset($_GET['doctorID'])) {
            $id = $_GET['doctorID'];
        }
    
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'Doctor ID is missing']);
            return;
        }
    
        $this->doctor->id = $id;
        $this->doctor->name = $post_vars['doctorName'] ?? '';
        $this->doctor->email = $post_vars['doctorEmail'] ?? '';
        $this->doctor->specialization = $post_vars['specialization'] ?? '';
        $this->doctor->phone = $post_vars['phone'] ?? '';
        $this->doctor->status = $post_vars['status'] ?? '';
        $this->doctor->picture = $post_vars['picture'] ?? '';
    
        if ($this->doctor->update()) {
            echo json_encode(['success' => true, 'message' => 'Doctor updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update doctor']);
        }
    }
    

    // Handle DELETE requests
    public function destroy($doctorID) {
        $this->doctor->doctorID = $doctorID;

        if ($this->doctor->delete()) {
            echo json_encode(['success' => true, 'message' => 'Doctor deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete doctor']);
        }
    }

    public function show($doctorID) {
        $this->doctor->doctorID = $doctorID;
        $result = $this->doctor->read_single_by_doctorID();  // Call the method to fetch doctor by ID
    
        if ($result->rowCount() > 0) {
            $doctor = $result->fetch(PDO::FETCH_ASSOC);
            echo json_encode(['doctor' => $doctor]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Doctor not found']);
        }
    }
    
    

}
