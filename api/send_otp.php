<?php

header("Content-Type: application/json");

include "config.php";

if (!isset($_POST["mobile"])) {

    echo json_encode([
        "status" => false,
        "message" => "Mobile Number Required"
    ]);

    exit;
}

$mobile = trim($_POST["mobile"]);

if (!preg_match("/^[0-9]{10}$/", $mobile)) {

    echo json_encode([
        "status" => false,
        "message" => "Invalid Mobile Number"
    ]);

    exit;
}

// DEMO OTP
$otp = "123456";

echo json_encode([
    "status" => true,
    "message" => "OTP generated successfully",
    "mobile" => $mobile,
    "otp" => $otp
]);

exit;

?>