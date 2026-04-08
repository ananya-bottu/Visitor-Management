<?php
header('Content-Type: application/json');

// Database connection
$conn = new mysqli("localhost", "root", "", "uid");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

// Fetch guests currently in campus
$sql = "SELECT roll_number, name, phone_number, car_number, scan_time, scan2_time, exit_time FROM guest_details WHERE exit_time IS NULL";
$result = $conn->query($sql);

$guests = [];
while ($row = $result->fetch_assoc()) {
    $guests[] = $row;
}

$conn->close();
echo json_encode($guests);
?>
