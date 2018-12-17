<?php
    header("content-type:text/html;charset=utf-8");
    // 连接数据库
    include 'connect.php';

    // 获得前端数据
    $user = $_GET['user'];
    $id = $_GET['id'];
    $num = $_GET['num'];
    $unit = $_GET['unit'];
    $imageUrl = $_GET['imageUrl'];
    $name = $_GET['name'];
    $size = $_GET['size'];
    $orig = $_GET['orig'];
    // echo $user;

    // 查询数据库
    $sql="SELECT * FROM `cart` WHERE id=$id AND user = $user ";

     // 执行语句
    $res = $conn->query($sql);
    //  var_dump($res); 

    if($res->num_rows>0){
        // echo '存在';
        // 修改数据库 
        $sql ="UPDATE `cart` set num=num+$num WHERE id=$id AND user = $user ";

        // 执行语句
        $res1 = $conn->query($sql);
        //  var_dump($res1);
       
    }else{
        // echo '不存在';
        // 插入数据库 
        // $price = $unit*$num;
        $sql="INSERT INTO `cart` (user,id,num,unit,imageUrl,name,size,orig) VALUES ('$user','$id','$num','$unit','$imageUrl','$name','$size','$orig')";

        // 执行语句
        $res1 = $conn->query($sql);
        // var_dump($res1);
    }

    if($res1>0){
        echo "加入购物车成功";
    }else{
        echo "加入购物车失败";
    }

    // 断开连接
    $res->close();
    // $res1->close();
    $conn->close();

    

?>