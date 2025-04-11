<?php
require_once '../models/Feedback.php';

class FeedbackController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->connect();
    }

    public function submitFeedback($data) {
        if (empty($data['name']) || empty($data['email']) || empty($data['feedback'])) {
            return ['success' => false, 'message' => 'All fields are required.'];
        }

        $feedback = new Feedback($this->db);
        $feedback->name = $data['name'];
        $feedback->email = $data['email'];
        $feedback->feedback = $data['feedback'];

        if ($feedback->create()) {
            return ['success' => true, 'message' => 'Feedback submitted successfully.'];
        } else {
            return ['success' => false, 'message' => 'Failed to submit feedback.'];
        }
    }

    public function getAllFeedback() {
        $feedback = new Feedback($this->db);
        return $feedback->getAll();
    }
}
?>
