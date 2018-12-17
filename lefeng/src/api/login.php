<?php
// 连接数据库
include 'connect.php';

// 获取前端数据
$user = $_POST['user'];
$psw  = $_POST['psw'];
// echo $user;


// 查询数据库
$sql = "SELECT * FROM `user_inf` WHERE USER='$user' AND psw='$psw'";

// 执行语句
$res = $conn->query($sql);
// var_dump($res);

// 如果用户名存在且密码也正确则返回1，不存在或密码错误返回0
if($res->num_rows>0){
    echo 1;
}else{
    echo 0;
}

// 断开连接
$res->close();
$conn->close();

?>