<?php
    // 连接数据库
    include 'connect.php';

    // 获取前端数据
    $keyword = $_GET['keyword'];
    $page = $_GET['page'];
    $qty = $_GET['qty'];
    // echo($page);

    $ind = ($page-1)*$qty;

    // 查询数据库
    $sql = "SELECT * FROM `list` WHERE keyword LIKE '%$keyword%'  LIMIT $ind,$qty";

    // 执行语句，获得一个结果集
    $res = $conn->query($sql);
    // var_dump($res);

    // 取部分内容
    $row  = $res->fetch_all(MYSQLI_ASSOC);

    // 再次查询数据库
    $sql2 = "SELECT * FROM `list` WHERE keyword LIKE '%$keyword%' ";

    // 执行语句，获得一个结果集
    $res2 = $conn->query($sql2);
    // var_dump($res2);

    //获取结果集里面的num_rows属性，记录的总条数
    $row2 = $res2->num_rows;
    // echo $row2;

    // 查询数据库 关于特点描述的
    $sql3 = "SELECT trait FROM `list` WHERE keyword LIKE '%$keyword%'  LIMIT $ind,$qty ";

    // 执行语句，获得一个结果集
    $res3 = $conn->query($sql3);
    // var_dump($res3);

    //获取部分内容
    $row3 = $res3->fetch_all(MYSQLI_ASSOC);
    // var_dump( $row3);

    // 查询数据库 升序
    $sql4 = "SELECT * FROM `list` WHERE keyword LIKE '%$keyword%'  ORDER BY now LIMIT $ind,$qty ";

    // 执行语句，获得一个结果集
    $res4 = $conn->query($sql4);
    // var_dump($res4);

    //获取部分内容
    $row4 = $res4->fetch_all(MYSQLI_ASSOC);
    // var_dump( $row4);

    // 查询数据库 降序
    $sql5 = "SELECT * FROM `list` WHERE keyword LIKE '%$keyword%'  ORDER BY now desc LIMIT $ind,$qty ";

    // 执行语句，获得一个结果集
    $res5 = $conn->query($sql5);
    // var_dump($res5);

    //获取部分内容
    $row5 = $res5->fetch_all(MYSQLI_ASSOC);
    // var_dump( $row5);


    $goodlists = array(
        'total' => $row2 , //总条数
        'datalist' => $row , // 查询到的部分数据
        'trait' => $row3 , // 查询到的部分特点数据
        'asc' => $row4 , // 升序
        'desc' => $row5 , // 降序
        'page' => $page, // 页数
        'qty' => $qty // 每页显示条数
    );

    echo json_encode($goodlists,JSON_UNESCAPED_UNICODE);

    // 断开连接
    $res -> close();
    $res2 -> close();
    $res3 -> close();
    $res4 -> close();
    $res5 -> close();
    $conn -> close();

?>