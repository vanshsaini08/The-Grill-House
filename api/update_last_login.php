<?php

header("Content-Type: application/json");

include "config.php";

if (!isset($_POST["customer_id"])) {

    echo json_encode([
        "status" => false,
        "message" => "Customer ID Required"
    ]);

    exit;
}

$customerId = intval($_POST["customer_id"]);

if ($customerId <= 0) {

    echo json_encode([
        "status" => false,
        "message" => "Invalid Customer ID"
    ]);

    exit;
}

$stmt = $conn->prepare("
    UPDATE customers
    SET last_login = CURRENT_TIMESTAMP
    WHERE customer_id = ?
");

$stmt->bind_param("i", $customerId);

if ($stmt->execute()) {

    echo json_encode([
        "status" => true,
        "message" => "Last login updated"
    ]);

} else {

    echo json_encode([
        "status" => false,
        "message" => "Unable to update last login"
    ]);

}

$stmt->close();
$conn->close();

exit;

?>