<?php
header('Content-Type: application/json'); // Ensure JSON response
error_reporting(E_ALL); // Show all errors
ini_set('display_errors', 1); // Display errors on screen

// Set default timezone to IST
date_default_timezone_set('Asia/Kolkata');

// Database configuration
$dbConfig = [
    'host' => 'localhost',
    'username' => 'GuestDetails',
    'password' => 'Uidproject123@',
    'database' => 'uid',
    'charset' => 'utf8mb4'
];

$response = ['status' => 'error', 'message' => ''];

try {
    // Create database connection
    $conn = new mysqli(
        $dbConfig['host'],
        $dbConfig['username'],
        $dbConfig['password'],
        $dbConfig['database']
    );

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    $conn->set_charset($dbConfig['charset']);

    // Validate input
    if (empty($_POST['roll_number'])) {
        throw new Exception("Roll Number is required.");
    }

    $roll_number = $conn->real_escape_string(trim($_POST['roll_number']));
    $exit_time = date('Y-m-d H:i:s'); // IST time

    // Check if roll_number exists
    $checkStmt = $conn->prepare("SELECT id FROM guest_details WHERE roll_number = ?");
    if (!$checkStmt) {
        throw new Exception("Database check failed: " . $conn->error);
    }
    $checkStmt->bind_param("s", $roll_number);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        // Update exit_time
        $updateStmt = $conn->prepare("UPDATE guest_details SET exit_time = ? WHERE roll_number = ?");
        if (!$updateStmt) {
            throw new Exception("Update preparation failed: " . $conn->error);
        }

        $updateStmt->bind_param("ss", $exit_time, $roll_number);
        $updateStmt->execute();

        if ($updateStmt->affected_rows === 0) {
            throw new Exception("Failed to update exit_time. No rows affected.");
        }

        $response = [
            'status' => 'success',
            'message' => 'Exit time updated successfully',
            'exit_time' => $exit_time
        ];

        $updateStmt->close();
    } else {
        throw new Exception("Roll Number not found in database.");
    }

    $checkStmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(400);
    $response['message'] = $e->getMessage();
    error_log("QR Scanner Error: " . $e->getMessage()); // Log errors
}

echo json_encode($response);
?>
