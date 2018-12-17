<?php
    // 连接数据库
    include 'connect.php';

    // 获得前端数据
    $user = $_GET['user'];
    // echo $user;

    // 查询数据库
    $sql = "SELECT * FROM `cart` WHERE user=$user ORDER BY timer desc";

    // 执行语句 获得结果集
    $res = $conn->query($sql);
    // var_dump($res);

    // 获取内容
    $row = $res->fetch_all(MYSQLI_ASSOC);
    // var_dump($row);

    // 总条数
    $row1 = $res->num_rows;
    // echo $row1;

    

    $goodlists = array(
        'datalist' => $row, // 内容
        'total' => $row1 , // 总条数
        'user' => $user ,  // 用户名
    );

    echo json_encode($goodlists,JSON_UNESCAPED_UNICODE);

    // 断开连接
    $res->close();
    $conn->close();
    

    

?>