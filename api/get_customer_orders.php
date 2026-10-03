<?php

header("Content-Type: application/json; charset=UTF-8");

include "config.php";


// ==========================================
// CUSTOMER ID CHECK
// ==========================================

if (!isset($_GET["customer_id"])) {

    echo json_encode([
        "success" => false,
        "message" => "Customer ID Required",
        "orders" => []
    ]);

    exit;
}


$customer_id = intval($_GET["customer_id"]);


if ($customer_id <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid Customer ID",
        "orders" => []
    ]);

    exit;
}


// ==========================================
// GET CUSTOMER ORDERS + PAYMENT METHOD
// ==========================================

$stmt = $conn->prepare("

    SELECT
        o.order_id,
        o.customer_id,
        o.table_name,
        o.order_type,
        o.total_amount,
        o.order_status,
        o.created_at,
        o.order_source,
        o.payment_status,
        pd.payment_method

    FROM orders o

    LEFT JOIN payment_details pd
        ON o.order_id = pd.order_id

    WHERE o.customer_id = ?

    ORDER BY o.created_at DESC

");


if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => "Order query failed",
        "error" => $conn->error,
        "orders" => []
    ]);

    exit;
}


$stmt->bind_param(
    "i",
    $customer_id
);


$stmt->execute();


$result = $stmt->get_result();


// ==========================================
// ORDER DETAILS QUERY
// ==========================================

$detailStmt = $conn->prepare("

    SELECT
        detail_id,
        order_id,
        item_name,
        quantity,
        price,
        gst_percent

    FROM order_details

    WHERE order_id = ?

    ORDER BY detail_id ASC

");


if (!$detailStmt) {

    echo json_encode([
        "success" => false,
        "message" => "Order details query failed",
        "error" => $conn->error,
        "orders" => []
    ]);

    exit;
}


$orders = [];


// ==========================================
// LOOP ORDERS
// ==========================================

while ($order = $result->fetch_assoc()) {

    $orderID = intval(
        $order["order_id"]
    );


    $items = [];


    // ======================================
    // GET ITEMS OF THIS ORDER
    // ======================================

    $detailStmt->bind_param(
        "i",
        $orderID
    );


    $detailStmt->execute();


    $detailResult =
        $detailStmt->get_result();


    while (
        $item =
        $detailResult->fetch_assoc()
    ) {

        $items[] = [

            "detail_id" =>
                intval(
                    $item["detail_id"]
                ),

            "item_name" =>
                $item["item_name"],

            "quantity" =>
                intval(
                    $item["quantity"]
                ),

            "price" =>
                floatval(
                    $item["price"]
                ),

            "gst_percent" =>
                floatval(
                    $item["gst_percent"]
                )

        ];

    }


    // ======================================
    // ADD ORDER
    // ======================================

    $orders[] = [

        "order_id" =>
            $orderID,

        "customer_id" =>
            intval(
                $order["customer_id"]
            ),

        "table_name" =>
            $order["table_name"],

        "order_type" =>
            $order["order_type"],

        "total_amount" =>
            floatval(
                $order["total_amount"]
            ),

        "order_status" =>
            $order["order_status"],

        "created_at" =>
            $order["created_at"],

        "order_source" =>
            $order["order_source"],

        "payment_status" =>
            $order["payment_status"],

        "payment_method" =>
            $order["payment_method"],

        "items" =>
            $items

    ];

}


// ==========================================
// CLOSE CONNECTIONS
// ==========================================

$detailStmt->close();

$stmt->close();

$conn->close();


// ==========================================
// FINAL RESPONSE
// ==========================================

echo json_encode([

    "success" => true,

    "orders" => $orders

]);

exit;

?>