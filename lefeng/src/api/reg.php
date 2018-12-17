<?php

// 连接数据库
include 'connect.php';

// 获取前端数据
$user = $_POST['user'];
$psw = $_POST['psw'];
// echo $psw;

// 插入数据库
$sql = "INSERT INTO user_inf (USER,PSW) VALUES ('$user','$psw')";

// 执行语句
$res = $conn->query($sql);
// var_dump($res);

// 插入成功为true
if($res){
    echo true;
}else{
    echo false;
}

// 断开连接
$res->close();
$conn->close();

?>