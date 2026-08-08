<?php

header("Content-Type: application/json");

// config.php main resto website folder me hai
include "config.php";


// ==========================================
// MOBILE NUMBER CHECK
// ==========================================

if (!isset($_POST["mobile"])) {

    echo json_encode([
        "status" => false,
        "message" => "Mobile Number Required"
    ]);

    exit;
}


$mobile = trim($_POST["mobile"]);


// ==========================================
// MOBILE VALIDATION
// ==========================================

if (!preg_match("/^[0-9]{10}$/", $mobile)) {

    echo json_encode([
        "status" => false,
        "message" => "Invalid Mobile Number"
    ]);

    exit;
}


// ==========================================
// CHECK CUSTOMER IN DATABASE
// ==========================================

$stmt = $conn->prepare("
    SELECT customer_id, customer_name
    FROM customers
    WHERE mobile_no = ?
    LIMIT 1
");


if (!$stmt) {

    echo json_encode([
        "status" => false,
        "message" => "Database query failed",
        "error" => $conn->error
    ]);

    exit;
}


$stmt->bind_param("s", $mobile);

$stmt->execute();

$result = $stmt->get_result();


// ==========================================
// CUSTOMER FOUND
// ==========================================

if ($row = $result->fetch_assoc()) {

    echo json_encode([

        "status" => true,

        "exists" => true,

        "customer_id" => $row["customer_id"],

        "customer_name" => $row["customer_name"]

    ]);

}


// ==========================================
// CUSTOMER NOT FOUND
// ==========================================

else {

    echo json_encode([

        "status" => true,

        "exists" => false

    ]);

}


$stmt->close();

$conn->close();

exit;

?>