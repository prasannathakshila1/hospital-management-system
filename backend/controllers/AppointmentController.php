<?php
require_once '../models/AppointmentModel.php';

class AppointmentController {

    // Ensure the content type is set to JSON at the start of the request
    public function __construct() {
        // Ensure the content type is set to JSON
        header('Content-Type: application/json');
    }
    public function createAppointment() {
        // Read the JSON data from the request body
        $data = json_decode(file_get_contents('php://input'), true);
    
        // Debugging: Log the data to confirm that session_id is present
        error_log("Appointment Data: " . print_r($data, true));
    
        // Check if the required data is present
        if (isset($data['name'], $data['email'], $data['phone'], $data['userID'], $data['session_id'])) {
            // Pass the data to the AppointmentModel constructor
            $appointment = new AppointmentModel($data);
    
            // Attempt to save the appointment
            if ($appointment->save()) {
                echo json_encode(['success' => true, 'message' => 'Appointment created successfully.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to create appointment.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Missing required appointment data.']);
        }
    }
    


    public function listAppointments() {
        try {
            // Retrieve userID from query parameter
            $userID = $_GET['userID'] ?? null;
        
            if (!$userID) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'User ID is required']);
                return;
            }
        
            // Fetch appointments directly using the model's listAppointments method
            $appointments = AppointmentModel::listAppointments($userID);
        
            // You can add 'userID' explicitly to the response here if needed
            echo json_encode(['success' => true, 'appointments' => $appointments, 'userID' => $userID]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to fetch appointments',
                'error' => $e->getMessage(),
            ]);
        }
    }
    
    

    public function editAppointment() {
        // Read raw POST data (as PUT data isn't parsed automatically)
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Appointment ID is required']);
            return;
        }

        // Create an AppointmentModel instance with the provided data
        $appointment = new AppointmentModel($data);

        // Call the update method
        if ($appointment->update()) {
            echo json_encode(['success' => true, 'message' => 'Appointment updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update appointment']);
        }
    }

    // Function to delete an appointment
    public function deleteAppointment() {
        if ($_GET['route'] == 'delete') {
            if (isset($_GET['id'], $_GET['userID'])) {
                $appointmentID = $_GET['id'];
                $userID = $_GET['userID'];

                // Check if the appointment belongs to the user
                $stmt = $conn->prepare("SELECT * FROM appointments WHERE id = ? AND userID = ?");
                $stmt->bind_param("ii", $appointmentID, $userID);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    // Delete the appointment
                    $stmt = $conn->prepare("DELETE FROM appointments WHERE id = ? AND userID = ?");
                    $stmt->bind_param("ii", $appointmentID, $userID);

                    if ($stmt->execute()) {
                        echo json_encode(['success' => true, 'message' => 'Appointment deleted successfully']);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Failed to delete appointment']);
                    }
                } else {
                    echo json_encode(['success' => false, 'message' => 'Appointment not found or not owned by user']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Appointment ID or User ID is missing']);
            }
        }
    }
}


// Close the class with a closing brace

?>
