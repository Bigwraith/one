<?php
// 连接数据库
include 'connect.php';

// 获取前端数据
$keyword = $_GET['keyword'];
$id = $_GET['id'];
// echo($id);


// 查询数据库
$sql = "SELECT * FROM `list` WHERE keyword LIKE '%$keyword%' AND id='$id'";

// 执行语句，获得一个结果集
$res = $conn->query($sql);
// var_dump($res);

// 取部分内容
$row  = $res->fetch_all(MYSQLI_ASSOC);

$goodlists = array(
    'datalist' => $row , // 查询到的部分数据
    'id' => $id , // id
    'keyword' => $keyword , // keyword

);

echo json_encode($goodlists,JSON_UNESCAPED_UNICODE);

// 断开连接
$res -> close();
$conn -> close();

?>