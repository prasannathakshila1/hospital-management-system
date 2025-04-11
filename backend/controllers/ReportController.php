<?php
require_once '../models/Report.php';

class ReportController {
    private $db;
    private $report;

    public function __construct($db) {
        $this->db = $db;
        $this->report = new Report($db);
    }

    // Handle creating a new report
    public function createReport() {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->message) || !isset($data->userId) || !isset($data->date)) {
            echo json_encode(["message" => "Missing required fields"]);
            return;
        }

        // Set the report properties
        $this->report->message = $data->message;
        $this->report->userId = $data->userId;
        $this->report->date = $data->date;

        // Create the report
        if ($this->report->create()) {
            echo json_encode(["message" => "Report saved successfully"]);
        } else {
            echo json_encode(["message" => "Failed to save report"]);
        }
    }
    // Handle fetching all reports
public function getReports() {
    $result = $this->report->getAll();
    $num = $result->rowCount();

    if ($num > 0) {
        $reportsArr = [];
        
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $reportsArr[] = [
                "id" => $id,
                "message" => $message,
                "userId" => $userId,
                "date" => $date
            ];
        }
        
        echo json_encode($reportsArr);
    } else {
        echo json_encode(["message" => "No reports found"]);
    }
}

}
?>
