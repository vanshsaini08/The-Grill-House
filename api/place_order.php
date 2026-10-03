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

$name = trim($data["customer_name"] ?? "");
$phone = trim($data["mobile_no"] ?? "");
$table = trim($data["table_name"] ?? "");
$orderType = trim($data["order_type"] ?? "Takeaway");
$total = floatval($data["total_amount"] ?? 0);
$paymentMethod = trim($data["payment_method"] ?? "UPI");
$paymentStatus = trim($data["payment_status"] ?? "Paid");
$items = $data["items"] ?? [];

// ==========================================
// VALIDATION
// ==========================================

if (empty($name)) {
    echo json_encode([
        "success" => false,
        "message" => "Customer name is required"
    ]);
    exit;
}

if (empty($phone)) {
    echo json_encode([
        "success" => false,
        "message" => "Mobile number is required"
    ]);
    exit;
}

if ($total <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid order amount"
    ]);
    exit;
}

if (empty($items) || !is_array($items)) {
    echo json_encode([
        "success" => false,
        "message" => "Cart is empty"
    ]);
    exit;
}


// ==========================================
// PAYMENT METHOD VALIDATION
// ==========================================

if ($paymentMethod !== "Card" && $paymentMethod !== "UPI") {
    $paymentMethod = "UPI";
}


// ==========================================
// PAYMENT STATUS
// ==========================================

$paymentStatus = "Paid";


// ==========================================
// ORDER SOURCE
// ==========================================

$orderSource = "ONLINE";


try {

    // ==========================================
    // START TRANSACTION
    // ==========================================

    $conn->begin_transaction();


    // ==========================================
    // CUSTOMER
    // ==========================================

    $customerID = 0;

    $stmt = $conn->prepare(
        "SELECT customer_id
         FROM customers
         WHERE mobile_no = ?
         LIMIT 1"
    );

    $stmt->bind_param(
        "s",
        $phone
    );

    $stmt->execute();

    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {

        $customerID = intval($row["customer_id"]);


        // ======================================
        // UPDATE CUSTOMER NAME
        // ======================================

        $updateCustomer = $conn->prepare(
            "UPDATE customers
             SET customer_name = ?
             WHERE customer_id = ?"
        );

        $updateCustomer->bind_param(
            "si",
            $name,
            $customerID
        );

        $updateCustomer->execute();

        $updateCustomer->close();

    } else {

        // ======================================
        // CREATE CUSTOMER
        // ======================================

        $stmt = $conn->prepare(
            "INSERT INTO customers
            (
                customer_name,
                mobile_no
            )
            VALUES (?, ?)"
        );

        $stmt->bind_param(
            "ss",
            $name,
            $phone
        );

        $stmt->execute();

        $customerID = $conn->insert_id;
    }

    $stmt->close();


    // ==========================================
    // CREATE ORDER
    // ==========================================

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
        (
            ?,
            ?,
            ?,
            ?,
            'Pending',
            ?,
            ?,
            NOW()
        )"
    );

    $stmt->bind_param(
        "issdss",
        $customerID,
        $table,
        $orderType,
        $total,
        $orderSource,
        $paymentStatus
    );

    $stmt->execute();

    $orderID = $conn->insert_id;

    $stmt->close();


    // ==========================================
    // ORDER DETAILS
    // ==========================================

    $stmt = $conn->prepare(
        "INSERT INTO order_details
        (
            order_id,
            item_name,
            quantity,
            price,
            gst_percent
        )
        VALUES
        (?, ?, ?, ?, ?)"
    );

    foreach ($items as $item) {

        $itemName = trim($item["name"] ?? "");
        $qty = intval($item["qty"] ?? 1);
        $price = floatval($item["price"] ?? 0);
        $gst = floatval($item["gst_percent"] ?? 0);


        if (
            $itemName === "" ||
            $qty <= 0 ||
            $price < 0
        ) {
            continue;
        }


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

    $stmt->close();


    // ==========================================
    // PAYMENT DETAILS
    // ==========================================

    $changeAmount = 0.00;


    $stmt = $conn->prepare(
        "INSERT INTO payment_details
        (
            order_id,
            order_source,
            payment_method,
            paid_amount,
            change_amount,
            payment_date
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            NOW()
        )"
    );


    $stmt->bind_param(
        "issdd",
        $orderID,
        $orderSource,
        $paymentMethod,
        $total,
        $changeAmount
    );


    $stmt->execute();

    $paymentID = $conn->insert_id;

    $stmt->close();


    // ==========================================
    // COMMIT EVERYTHING
    // ==========================================

    $conn->commit();


    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    echo json_encode([
        "success" => true,
        "message" => "Order and payment recorded successfully",

        "order_id" => $orderID,

        "payment_id" => $paymentID,

        "payment_method" => $paymentMethod,

        "payment_status" => $paymentStatus,

        "paid_amount" => number_format(
            $total,
            2,
            ".",
            ""
        ),

        "order_status" => "Pending",

        "order_source" => "ONLINE"
    ]);


} catch (Exception $e) {

    // ==========================================
    // ROLLBACK
    // ==========================================

    try {
        $conn->rollback();
    } catch (Exception $rollbackError) {
        // Nothing
    }


    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}


$conn->close();

?>