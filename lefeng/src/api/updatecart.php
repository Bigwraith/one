<?php
    header("content-type:text/html;charset=utf-8");
    // 连接数据库
    include 'connect.php';

    // 获取前端数据
    $id = $_GET['id'];
    $num = $_GET['num'];
    $user = $_GET['user'];



    // 修改数据库
    $sql = "UPDATE `cart` set num=$num WHERE id=$id AND user='$user'";

    // 执行语句
    $res = $conn-> query($sql);
    // var_dump($res);

    if($res){
        echo true;
    }else{
        echo false;
    }

    // 断开连接
    $res->close();
    $conn->close();
    

?>