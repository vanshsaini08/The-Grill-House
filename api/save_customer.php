<?php

header("Content-Type: application/json");

include "config.php";

if (!isset($_POST["name"]) || !isset($_POST["mobile"])) {

    echo json_encode([
        "status" => false,
        "message" => "Name and Mobile Number Required"
    ]);

    exit;
}

$name = trim($_POST["name"]);
$mobile = trim($_POST["mobile"]);

if ($name === "") {

    echo json_encode([
        "status" => false,
        "message" => "Name Required"
    ]);

    exit;
}

if (!preg_match("/^[0-9]{10}$/", $mobile)) {

    echo json_encode([
        "status" => false,
        "message" => "Invalid Mobile Number"
    ]);

    exit;
}


// Check if customer already exists
$check = $conn->prepare("
    SELECT customer_id, customer_name
    FROM customers
    WHERE mobile_no = ?
    LIMIT 1
");

$check->bind_param("s", $mobile);
$check->execute();

$result = $check->get_result();

if ($row = $result->fetch_assoc()) {

    echo json_encode([
        "status" => true,
        "exists" => true,
        "customer_id" => $row["customer_id"],
        "customer_name" => $row["customer_name"],
        "message" => "Customer already exists"
    ]);

    $check->close();
    $conn->close();

    exit;
}

$check->close();


// Save new customer
$stmt = $conn->prepare("
    INSERT INTO customers
    (customer_name, mobile_no)
    VALUES (?, ?)
");

$stmt->bind_param("ss", $name, $mobile);

if ($stmt->execute()) {

    $customerId = $stmt->insert_id;

    echo json_encode([
        "status" => true,
        "exists" => false,
        "customer_id" => $customerId,
        "customer_name" => $name,
        "mobile" => $mobile,
        "message" => "Customer saved successfully"
    ]);

} else {

    echo json_encode([
        "status" => false,
        "message" => "Unable to save customer"
    ]);

}

$stmt->close();
$conn->close();

exit;

?>