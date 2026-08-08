<?php

include "db.php";

header("Content-Type: application/json");

$category = isset($_GET['cat']) ? trim($_GET['cat']) : "";

if ($category == "") {
    echo json_encode([]);
    exit;
}

$sql = "SELECT id, item_name, price, category, image, gst_percent
        FROM menu
        WHERE LOWER(TRIM(category)) = LOWER(TRIM(?))";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $category);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

// Image Save Folder
$folder = "../images/menu/";

if (!file_exists($folder)) {
    mkdir($folder, 0777, true);
}

while ($row = $result->fetch_assoc()) {

    if (!empty($row["image"])) {

        // PNG filename
        $fileName = "menu_" . $row["id"] . ".png";
        $filePath = $folder . $fileName;

        // Agar image pehle se save nahi hai to save karo
        if (!file_exists($filePath)) {
            file_put_contents($filePath, $row["image"]);
        }

        // Browser ke liye path
        $row["img"] = "images/menu/" . $fileName;

    } else {

        $row["img"] = "images/no-image.png";

    }

    unset($row["image"]);

    $data[] = $row;
}

echo json_encode($data);

$stmt->close();
$conn->close();

?>