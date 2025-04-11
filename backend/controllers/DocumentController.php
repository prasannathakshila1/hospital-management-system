<?php
require_once '../models/Document.php';

class DocumentController {
    public function uploadFile($user_uuid, $report_type, $report_date, $file, $description, $status, $doctor_name, $patient_name, $test_results, $comments) {
        $uploadDir = '../uploads/';
        
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
    
        $fileExt = pathinfo($file['name'], PATHINFO_EXTENSION);
        $allowedTypes = ['jpg', 'jpeg', 'png', 'pdf'];
    
        if (!in_array(strtolower($fileExt), $allowedTypes)) {
            return ['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, and PDF allowed.'];
        }
    
        $newFileName = uniqid() . "." . $fileExt;
        $filePath = $uploadDir . $newFileName;
    
        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            $document = new Document();
            if ($document->create($user_uuid, $report_type, $report_date, $filePath, $description, $status, $doctor_name, $patient_name, $test_results, $comments)) {
                return ['success' => true, 'message' => 'File uploaded successfully.', 'file_path' => $filePath];
            } else {
                return ['success' => false, 'message' => 'Failed to save to database.'];
            }
        } else {
            return ['success' => false, 'message' => 'File upload failed.'];
        }
    }
    
    public function getReportsByUserId($user_uuid) {
        $document = new Document();
        return $document->getReportsByUserId($user_uuid);
    }
    
}
?>
