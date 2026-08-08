<?php

header("Content-Type: application/json");

include "config.php";

if (!isset($_POST["customer_id"]) || !isset($_POST["customer_name"])) {

    echo json_encode([
        "status" => false,
        "message" => "Customer ID and Name Required"
    ]);

    exit;
}

$customerId = intval($_POST["customer_id"]);
$name = trim($_POST["customer_name"]);

if ($customerId <= 0) {

    echo json_encode([
        "status" => false,
        "message" => "Invalid Customer ID"
    ]);

    exit;
}

if ($name === "") {

    echo json_encode([
        "status" => false,
        "message" => "Name Required"
    ]);

    exit;
}

$stmt = $conn->prepare("
    UPDATE customers
    SET customer_name = ?
    WHERE customer_id = ?
");

$stmt->bind_param("si", $name, $customerId);

if ($stmt->execute()) {

    echo json_encode([
        "status" => true,
        "message" => "Profile updated successfully",
        "customer_name" => $name
    ]);

} else {

    echo json_encode([
        "status" => false,
        "message" => "Unable to update profile"
    ]);

}

$stmt->close();
$conn->close();

exit;

?>