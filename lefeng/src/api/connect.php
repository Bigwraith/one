<?php
	/*
	 	做真正的数据接口：
	 		* 连接数据库
	 		* 写查询语句
	 
	 */
	
	//写好配置信息
	$servername='localhost';
	$username='root';
	$password='';
	$dbname='lefeng';
	
	//创建数据库连接
	$conn=new mysqli($servername,$username,$password,$dbname);
	
	// 检测连接
    if ($conn->connect_error) {
        die("连接失败: " . $conn->connect_error);
    } 

    //查询前设置编码，防止输出乱码
    $conn->set_charset('utf8');


	// echo "连接成功";
    
    
	
?>