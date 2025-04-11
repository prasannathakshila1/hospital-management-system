<?php
// Include the Database class
require_once 'config/database.php';

// Create an instance of the Database class
$database = new Database();

// Call the testConnection method
$database->testConnection();
?>
