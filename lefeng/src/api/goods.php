<?php
    // 连接数据库
    include 'connect.php';

    // 获得前端数据
    $id = $_GET['id'];
    // echo $id;

    // 查询数据库
    $sql = "SELECT * FROM `list` WHERE id= $id ";

    // 执行语句，获得一个结果集
    $res = $conn->query($sql);
    // var_dump($res);

    // 取内容
    $row = $res->fetch_all(MYSQLI_ASSOC);
    // var_dump($row);

    // 查询数据库 随机抽取五条数据
    $sql1 = "SELECT * FROM `list` ORDER BY RAND() LIMIT 0,5" ;

    // 执行语句，获得一个结果集
    $res1 = $conn->query($sql1);
    // var_dump($res1);

    // 获取内容
    $row1 = $res1->fetch_all(MYSQLI_ASSOC);
   
    $goodlists = array(
        'datalists' => $row , // 内容
        'randlists' => $row1 , 
        'id' => $id , // id值
    );

    echo json_encode($goodlists,JSON_UNESCAPED_UNICODE);

    // 断开连接
    $res->close();
    $conn->close();


?>