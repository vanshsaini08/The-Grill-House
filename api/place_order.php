<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request"
    ]);
    exit;
}

$name = $data["customer_name"] ?? "";
$phone = $data["mobile_no"] ?? "";
$table = $data["table_name"] ?? "";
$orderType = $data["order_type"] ?? "Takeaway";
$total = floatval($data["total_amount"] ?? 0);
$items = $data["items"] ?? [];

if (empty($items)) {
    echo json_encode([
        "success" => false,
        "message" => "Cart is empty"
    ]);
    exit;
}

try {

    $conn->begin_transaction();

    // ==============================
    // CUSTOMER
    // ==============================

    $customerID = 0;

    $stmt = $conn->prepare(
        "SELECT customer_id 
         FROM customers 
         WHERE mobile_no = ?
         LIMIT 1"
    );

    $stmt->bind_param("s", $phone);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {

        $customerID = intval($row["customer_id"]);

    } else {

        $stmt = $conn->prepare(
            "INSERT INTO customers
            (customer_name, mobile_no)
            VALUES (?, ?)"
        );

        $stmt->bind_param("ss", $name, $phone);
        $stmt->execute();

        $customerID = $conn->insert_id;
    }


    // ==============================
    // CREATE ORDER
    // ==============================

    $stmt = $conn->prepare(
        "INSERT INTO orders
        (
            customer_id,
            table_name,
            order_type,
            total_amount,
            order_status,
            order_source,
            payment_status,
            created_at
        )
        VALUES
        (?, ?, ?, ?, 'Pending', 'ONLINE', 'Unpaid', NOW())"
    );

    $stmt->bind_param(
        "issd",
        $customerID,
        $table,
        $orderType,
        $total
    );

    $stmt->execute();

    $orderID = $conn->insert_id;


    // ==============================
    // ORDER DETAILS
    // ==============================

    $stmt = $conn->prepare(
        "INSERT INTO order_details
        (
            order_id,
            item_name,
            quantity,
            price,
            gst_percent
        )
        VALUES (?, ?, ?, ?, ?)"
    );

    foreach ($items as $item) {

        $itemName = $item["name"] ?? "";
        $qty = intval($item["qty"] ?? 1);
        $price = floatval($item["price"] ?? 0);
        $gst = floatval($item["gst_percent"] ?? 0);

        $stmt->bind_param(
            "isidd",
            $orderID,
            $itemName,
            $qty,
            $price,
            $gst
        );

        $stmt->execute();
    }


    // ==============================
    // COMMIT
    // ==============================

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Order placed successfully",
        "order_id" => $orderID
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?>