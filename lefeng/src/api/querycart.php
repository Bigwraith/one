<?php
    // 连接数据库
    include 'connect.php';

    // 获得前端数据
    $id = $_GET['id'];
    // echo $user;

     // 查询数据库 根据id值查询内容
     $sql = "SELECT * FROM `list` WHERE id = $id ";

     // 执行语句，获得一个结果集
     $res = $conn->query($sql);
     // var_dump($res);
 
     //获取部分内容
     $row = $res->fetch_all(MYSQLI_ASSOC);
    //  var_dump( $row);

    echo json_encode($row,JSON_UNESCAPED_UNICODE);

?>