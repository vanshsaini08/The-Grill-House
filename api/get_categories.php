<?php
include "db.php";

$sql = "SELECT category_id, category_name, image_name FROM categories ORDER BY category_id ASC";
$result = mysqli_query($conn, $sql);

$categories = [];

while ($row = mysqli_fetch_assoc($result)) {
    $categories[] = $row;
}

header("Content-Type: application/json");
echo json_encode($categories);
?>