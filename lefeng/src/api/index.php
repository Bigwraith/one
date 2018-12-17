<?php
    // 连接数据库
    include 'connect.php';

    // 获取前端数据
    $page = $_GET['page'];
    $qty = $_GET['qty'];
    //  echo $qty;

    $ind = $page-1;

    // 查询数据库
    $sql = "select * from `index` LIMIT $ind,$qty ";

    // 执行语句，获得一个结果集
    $res = $conn->query($sql);

    // var_dump($res);
    
    // 只要部分内容
    $row = $res -> fetch_all(MYSQLI_ASSOC);

    $goodlists = array(
        'datalist' => $row,
        'page' => $page,
        'qty' => $qty
    );

    echo json_encode($goodlists,JSON_UNESCAPED_UNICODE);

    // 断开连接
    $res -> close();
    $conn -> close();
?>