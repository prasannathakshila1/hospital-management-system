<?php
include_once '../models/DoctorSession.php';

class DoctorSessionController {
    private $doctorSession;

    public function __construct($pdo) {
        $this->doctorSession = new DoctorSession($pdo);
    }

    // Method to handle creating a doctor session
    public function createDoctorSession($doctorId, $branch, $date, $startTime, $endTime) {
        if (empty($doctorId) || empty($branch) || empty($date) || empty($startTime) || empty($endTime)) {
            return json_encode(['status' => 'error', 'message' => 'Please fill in all fields']);
        }

        $result = $this->doctorSession->createSession($doctorId, $branch, $date, $startTime, $endTime);
        
        if ($result) {
            return json_encode(['status' => 'success', 'message' => 'Appointment Booked!']);
        } else {
            return json_encode(['status' => 'error', 'message' => 'Error booking appointment']);
        }
    }
    public function updateDoctorSession($sessionID, $doctorId, $branch, $date, $startTime, $endTime) {
        if (empty($sessionID) || empty($doctorId) || empty($branch) || empty($date) || empty($startTime) || empty($endTime)) {
            return json_encode(['status' => 'error', 'message' => 'Please fill in all fields']);
        }
    
        $result = $this->doctorSession->updateSession($sessionID, $doctorId, $branch, $date, $startTime, $endTime);
        
        if ($result) {
            return json_encode(['status' => 'success', 'message' => 'Session updated successfully']);
        } else {
            return json_encode(['status' => 'error', 'message' => 'Error updating session']);
        }
    }
    public function deleteDoctorSession($sessionID) {
        if (empty($sessionID)) {
            return json_encode(['status' => 'error', 'message' => 'Session ID is required']);
        }
    
        $result = $this->doctorSession->deleteSession($sessionID);
        
        if ($result) {
            return json_encode(['status' => 'success', 'message' => 'Session deleted successfully']);
        } else {
            return json_encode(['status' => 'error', 'message' => 'Error deleting session']);
        }
    }
    public function getAllDoctorSessions() {
        $sessions = $this->doctorSession->getAllSessions();
        error_log(print_r($sessions, true)); // Log the sessions data for debugging
    
        if ($sessions) {
            // Log the output for debugging
            error_log(json_encode(['status' => 'success', 'sessions' => $sessions]));
            echo json_encode(['status' => 'success', 'sessions' => $sessions]);
        } else {
            // Log the error for debugging
            error_log(json_encode(['status' => 'error', 'message' => 'No sessions found']));
            echo json_encode(['status' => 'error', 'message' => 'No sessions found']);
        }
    }
    public function getDoctorSessions($doctorId) {
        if (empty($doctorId)) {
            echo json_encode(['status' => 'error', 'message' => 'Doctor ID is required']);
            return;
        }
    
        $sessions = $this->doctorSession->getSessionsByDoctorId($doctorId);
    
        if ($sessions) {
            echo json_encode(['status' => 'success', 'sessions' => $sessions]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No sessions found for this doctor']);
        }
    }
    public function getSessionBySessionID($sessionID) {
        if (empty($sessionID)) {
            echo json_encode(['status' => 'error', 'message' => 'Session ID is required']);
            return;
        }
    
        $session = $this->doctorSession->getSessionBySessionID($sessionID);
    
        if ($session) {
            echo json_encode(['status' => 'success', 'session' => $session]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Session not found']);
        }
    }
    
    
    
}
?>
