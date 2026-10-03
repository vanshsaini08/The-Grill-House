<?php

header("Content-Type: application/json");

include "config.php";

try {

    $input =
        json_decode(
            file_get_contents("php://input"),
            true
        );

    $orderID =
        isset($input["order_id"])
            ? intval($input["order_id"])
            : 0;

    $customerID =
        isset($input["customer_id"])
            ? intval($input["customer_id"])
            : 0;

    if ($orderID <= 0) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid order ID"
        ]);

        exit;

    }

    if ($customerID <= 0) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid customer ID"
        ]);

        exit;

    }

    $stmt =
        $conn->prepare(
            "UPDATE orders
             SET order_status = 'Picked Up'
             WHERE order_id = ?
             AND customer_id = ?
             AND UPPER(TRIM(order_status)) = 'READY'"
        );

    if (!$stmt) {

        throw new Exception(
            $conn->error
        );

    }

    $stmt->bind_param(
        "ii",
        $orderID,
        $customerID
    );

    $stmt->execute();

    if ($stmt->affected_rows > 0) {

        echo json_encode([
            "success" => true,
            "message" => "Order automatically picked up"
        ]);

    } else {

        // It may already have been picked up
        $check =
            $conn->prepare(
                "SELECT order_status
                 FROM orders
                 WHERE order_id = ?
                 AND customer_id = ?
                 LIMIT 1"
            );

        $check->bind_param(
            "ii",
            $orderID,
            $customerID
        );

        $check->execute();

        $result =
            $check->get_result();

        $row =
            $result->fetch_assoc();

        if (
            $row &&
            strcasecmp(
                trim(
                    $row["order_status"]
                ),
                "Picked Up"
            ) === 0
        ) {

            echo json_encode([
                "success" => true,
                "message" => "Order already picked up"
            ]);

        } else {

            echo json_encode([
                "success" => false,
                "message" => "Order is not ready"
            ]);

        }

        $check->close();

    }

    $stmt->close();

} catch (Throwable $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);

}

?>