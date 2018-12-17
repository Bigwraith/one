
var tbody = document.getElementById('tbody'); // 购物车列表
var yun = document.getElementById('yun'); // 运费小框
var bao = document.getElementById('bao'); // 满99包邮
var yuncost = document.getElementById('yuncost'); // 运费框 小于99显示大于99隐藏
var count = document.getElementById('count'); // 商品数量
var u_total01 = document.getElementById('u_total01'); // 总金额1
var u_total02 = document.getElementById('u_total02'); // 总金额2
var yun_price = document.getElementById('yun_price'); // 运费费用


/**
 *  获取cookie值显示在页面上
 */
var username = document.getElementById('username');
if (Cookie.get('user')) {
    // 登录用户名
    var name = Cookie.get('user');
    var slice = name.substr(3,4);
    var showname = name.replace(slice,"****")
    // console.log(showname);
    username.innerHTML = `
        嗡，欢迎来到乐峰，
        <a href="#">${showname}</a>
        |
        <a href="#" id="exit">退出登录</a>
    `;
    username.style.width = "280px";

    
    // 购物车列表
    var data = `user=${name}`;
    ajax('GET','../api/cart.php',data,function(str){
        // console.log(str);
        var arr = JSON.parse(str);
        var data = arr.datalist;
        // console.log(data);
        var html = '';
        for(var i=0;i<data.length;i++){
            var pirce = data[i].unit *data[i].num;
            html+=`
            <tr>
            <td class="t01">
                <div class="photo">
                    <a href="../html/goods?id=${data[i].id}"><img src="../${data[i].imageUrl}" alt="" style="width: 58px;height: 74px;"></a>
                    <img src="../${data[i].imageUrl}" class = "smallimg" >
                </div>
                <div class="tiptitle">
                    <p class="name"><a href="../html/goods?id=${data[i].id}">${data[i].name}</a></p>
                    <p class="size">规格：${data[i].size}</p>
                </div>
            </td>
            <td class="t02">
                <p class="now_price">￥${data[i].unit}</p>
                <p class="old_price">￥${data[i].orig}</p>
            </td>
            <td class="t03">
                <div class="quantity">
                    <span class="plus" id="${data[i].id}" >-</span>
                    <textarea name="" id="${data[i].id}">${data[i].num}</textarea>
                    <span class="sub" id="${data[i].id}" >+</span>
                </div>
            </td>
            <td class="t04">
                ￥<b>${pirce}</b> 
            </td>
            <td class="t05">
                <a href="#" class="del" id="${data[i].id}">删除</a>
            </td>
        </tr>

            `;
        }
        tbody.innerHTML= html;
        show();
    })


}

function show(){
    // console.log(tbody.children);
    var trs= tbody.children;
    var total=0;
    var counts = 0;
    for(var i=0;i<trs.length;i++){
    //    console.log(trs[i].children[3].children[0].innerHTML)
    // 总金额
       var toprice = trs[i].children[3].children[0].innerHTML;
       total+=Number(toprice);

        //  console.log(trs[i].children[2].children[0].children[1].value) ;
        // 总数量
       var counts01 = trs[i].children[2].children[0].children[1].value ;
       counts+=Number(counts01);

        // 照片放大
        //console.log(trs[i].children[0].children[0].children[0])
        $(trs[i].children[0].children[0].children[0]).mousemove(function(){
            // console.log(this.nextElementSibling)
            $(this.nextElementSibling).css('display','block');
        })
        $(trs[i].children[0].children[0].children[0]).mouseleave(function(){
            // console.log(this.nextElementSibling)
            $(this.nextElementSibling).css('display','none');
        })
       

    }
    // console.log(counts);
    // console.log(total);

    if(total>99){
        yun.style.background = "#f3b241";
        bao.innerHTML = "本单已免运费";
        yuncost.style.display = "none";
        count.innerHTML = counts;
        u_total01.innerHTML = total;
        u_total02.innerHTML = total;
    }else{
        total = total + Number(yun_price.innerHTML);
        // console.log(total);
        yun.style.background = "#999";
        bao.innerHTML = "全场满99包邮";
        yuncost.style.display = "block";
        count.innerHTML = counts;
        u_total01.innerHTML = total;
        u_total02.innerHTML = total;

    }
}


// 退出登录
username.onclick = function (e) {
    var e = e || e.window;
    var target = e.target || e.srcElement;
    if (target.id = 'exit') {
        // console.log(target.id);
        var data = new Date();
        data.setDate(data.getDate() - 1);
        document.cookie = 'user=' + name + ';expires=' + data + ';path=/lefeng/src';
        console.log(document.cookie);
        location.reload();
        username.innerHTML = `
        欢迎来到乐峰，请
        <a href="login.html">登录</a>
        |
        <a href="reg.html">免费注册</a>
        `;
    }
}


tbody.onclick = function(e){
    var e = e || window.e;
    var target = e.target || e.srcElement;
    console.log(target);
    var user = Cookie.get('user');
    
    // 数量框数量变化
    if(target.tagName.toLowerCase() == 'textarea'){
        // console.log(target.value);
        var id = target.id;
        target.onkeyup = function(){
            clearTimeout(timer);
            var timer= setTimeout (() => {
                var val = target.value;
                // console.log(target.value);
                var data = `id=${id}&num=${val}&user=${user}`
                ajax('GET','../api/updatecart.php',data,function(str){
                    // console.log(str);
                    
                })
            }, 1000);
            var unit = target.parentNode.parentNode.previousElementSibling.children[0].innerHTML.split("￥")[1];
            // console.log(unit);
            var price = unit * num;
            var prices = target.parentNode.parentNode.nextElementSibling.children[0];
            prices.innerHTML = price;
            show();
        }

    }

    // 数量减少
    if(target.className == 'plus'){
        var num  = target.nextElementSibling.value.trim();
        var id = target.id;
        // console.log(num);
        if(num<=1){
            num=1;
        }
        if(num>1){
            num--;
            var data = `id=${id}&num=${num}&user=${user}`;
            ajax('GET','../api/updatecart.php',data,function(str){
                // console.log(str);
                
            })
                  
        }
        target.nextElementSibling.value = num;
        // // console.log(target.parentNode.parentNode.previousElementSibling.children[0].innerHTML.trim());
        var unit = target.parentNode.parentNode.previousElementSibling.children[0].innerHTML.split("￥")[1];
        // console.log(unit);
        var price = unit * num;
        var prices = target.parentNode.parentNode.nextElementSibling.children[0];
        prices.innerHTML = price;
        show();
    }

    // 数量增加
    if(target.className == 'sub'){
        var num  = target.previousElementSibling.value.trim();
        // console.log(num);
        var id = target.id;
        if(num>=1){
            num++;
            var data = `id=${id}&num=${num}&user=${user}`;
            ajax('GET','../api/updatecart.php',data,function(str){
                // console.log(str);
                
            })   
        }
        target.previousElementSibling.value = num;
        var unit = target.parentNode.parentNode.previousElementSibling.children[0].innerHTML.split("￥")[1];
        // console.log(unit);
        var price = unit * num;
        var prices = target.parentNode.parentNode.nextElementSibling.children[0];
        prices.innerHTML = price;
        show();
    }

    // 删除
    if(target.className == 'del'){
        var id = target.id;
        confirm("您确定要删除嘛？？？");
        if(confirm){
            var data = `id=${id}&user=${user}`;
            ajax('GET','../api/delcart.php',data,function(str){
                // console.log(str);
                location.reload();
            })
        }
        show();
        
    }

}


// 卡券
$('.kaq').click(function(){
    $('.cart_kaquan02').toggle();
    $(this).find("i").toggleClass('ico-jj');

})

/*
	公共函数：经常会使用到的函数，大家都可以调用
*/

/*
 	randomNum(min, max):
 	说明：返回min到max之间的一个随机数
 	参数一：最小值
 	参数二：最大值
 */

function randomNum(min, max) {
	//返回min到max之间是随机数
	//最新小：Math.random()+min 0-1之间   0-0.99999
	//最大的：Math.random()*max+1
	return parseInt(Math.random() * (max - min + 1)) + min;
}

//-------------------------------------------------------------

/*
 	getid(id):
 	说明：通过id查找元素
 	参数：传id名进来
 	
 */
function getid(id) {
	return document.getElementById(id);
}

//-------------------------------------------------------

/*
 	filterTex(str):
 	说明：过滤敏感词
 	参数：传要过滤的字符串进来，返回一个过滤后的字符串，敏感词变成**
 
 * */

function filterTex(str) {

	//敏感
	var sensitive = ['傻B', '妈蛋', 'bitch', 'fuck', '操', '小学生', '反清复明'];

	for(var i = 0; i < sensitive.length; i++) {
		var reg = new RegExp(sensitive[i], 'gi');
		str = str.replace(reg, '**');
	}

	return str;
}

//--------------------------------------------------

/*
 	randomColor(str):
 	说明：生成随机颜色
 	参数：如果传16进来，生成16进制颜色，如果传rgb进来，传rgb颜色
 
 * */

function randomColor(str) {
	//生成随机颜色
	if(str == 16) {
		//生成16进制的   '0123456789abcdef'  #666677
		var str = '0123456789abcdef';
		var color = '#';
		for(var i = 0; i < 6; i++) {
			color += str.charAt(parseInt(Math.random() * str.length));
		}

		return color;

	} else if(str == 'rgb') {
		//rgb(255,255,0) 生成3个随机数，每个随机数应该在  0-255
		var r = parseInt(Math.random() * 256);
		var g = parseInt(Math.random() * 256);
		var b = parseInt(Math.random() * 256);

		return 'rgb(' + r + ',' + g + ',' + b + ')';

	} else {
		alert('参数传错了');
	}
}

//-----------------------------
//补零操作
function setDb(num) {
	//小于10的，补零
	if(num < 10) {
		return '0' + num;
	} else {
		return '' + num;
	}
}

//---------------------------

//封装时间函数，把毫秒转成xx天xx时xx分xx秒   return {}

function setTime(diffTime) {

	var sec = setDb(diffTime % 60); //秒
	var min = setDb(Math.floor(diffTime / 60) % 60); //分
	var hour = setDb(Math.floor(diffTime / 60 / 60) % 24); //小时
	var day = Math.floor(diffTime / 60 / 60 / 24);

	return { //想返回多个数的时候，做成json数据
		'sec': sec,
		'min': min,
		'hour': hour,
		'day': day
	};
}

//------------------------

//字符串转成对象
//传的参数： id=001&name=iphone7 plugs&imgurl=img/ip7.jpg&price=5899&sale=5888&color=土豪金
//返回值：{id: "001", name: "iphone7 plugs", imgurl: "img/ip7.jpg", price: "5899", sale: "5888", …}

function strToObj(str) {
	//	var str = str.slice(1);
	var arr = str.split('&');
	var obj = {};
	for(var i = 0; i < arr.length; i++) {
		var arr2 = arr[i].split('=');
		obj[arr2[0]] = arr2[1];
	}

	return obj;
}

//-----------------------------

//对象转成字符串方法封装

//传的参数：{id: "001", name: "iphone7 plugs", imgurl: "img/ip7.jpg", price: "5899", sale: "5888", …}
//返回值： id=001&name=iphone7 plugs&imgurl=img/ip7.jpg&price=5899&sale=5888&color=土豪金

function objToStr(obj) {
	var html = '';
	for(var key in obj) {
		html += key + '=' + obj[key] + '&';
	}

	html = html.slice(0, -1);
	return html;
}

/*
 	事件监听兼容性处理：
 	参数一：节点名
 	参数二：事件名称
 	参数三：事件处理函数
 
 */

function bind(ele, type, fn) {
	if(ele.addEventListener) {
		//ie9+ 主流
		ele.addEventListener(type, fn, false);
	} else {
		//ie8-
		ele.attachEvent('on' + type, fn);
	}

}

//-----------------------------------------------------------
/*
	获取样式：可以获取行内和非行内样式
	参数一：obj 节点名
	参数二：name 属性名	
 
 * */

function getstyle(obj, name) {
	//获取样式
	if(obj.currentStyle) {
		//ie8-
		return obj.currentStyle[name];
	} else {
		//主流浏览器
		return getComputedStyle(obj, false)[name];
	}
}

/*
	运动框架封装：startMove()过渡    jq animate()
	最终版：多对象，多属性，链式运动框架(运动队列)
	参数一：对象名
	参数二：属性，目标值  键名：属性名，键值：目标值    {'width':200,'heigth':400}  实现：宽度和高度一起改变，宽度变成200，高度变成400
	参数三：回调函数(可选参数)
 */

function startMove(obj, json, fnend) {

	clearInterval(obj.timer); //防止定时器叠加
	obj.timer = setInterval(function() {

		var istrue = true;

		//1.获取属性名，获取键名：属性名->初始值
		for(var key in json) {
			//			console.log(key); //width heigth opacity
			var cur = 0; //存初始值

			if(key == 'opacity') { //初始值
				cur = getstyle(obj, key) * 100; //透明度
			} else {
				cur = parseInt(getstyle(obj, key)); //width heigth borderwidth px为单位的

			}

			//2.根据初始值和目标值，进行判断确定speed方向，变形：缓冲运动
			//距离越大，速度越大,下面的公式具备方向
			var speed = (json[key] - cur) / 6;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); //不要小数部分，没有这句话或晃动

			if(cur != json[key]) { //width 200 heigth 400
				istrue = false; //如果没有达到目标值，开关false
			} else {
				istrue = true; //true true
			}

			//3、运动
			if(key == 'opacity') {
				obj.style.opacity = (cur + speed) / 100;
				obj.style.filter = 'alpha(opacity:' + (cur + speed) + ')';
			} else {
				obj.style[key] = cur + speed + 'px'; //针对普通属性 left  top height 
			}

		}

		//4.回调函数:准备一个开关,确保以上json所有的属性都已经达到目标值,才能调用这个回调函数
		if(istrue) { //如果为true,证明以上属性都达到目标值了
			clearInterval(obj.timer);
			if(fnend) {
				fnend();
			}
		}

	}, 30); //obj.timer 每个对象都有自己定时器
}

/*
 checkReg:函数可以进行表单验证
 	checkReg.trim() :去掉前后空格
 	checkReg.tel() :号码
 
 */

var checkReg = {
	trim: function(str) { //去掉前后空格
		var reg = /^\s+|\s+$/g;
		return str.replace(reg, '');
	},
	tel: function(str) { //号码
		var reg = /^1[3-9]\d{9}$/
		return reg.test(str);
	},
	email: function(str) { //邮箱正则:a_a2-+.s @ a_a+2-.s  .s_a2
		var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; //网上推荐
		return reg.test(str);
	},
	idcard: function(str) { //身份证
		var reg = /^(\d{17}|\d{14})[\dX]$/;
		return reg.test(str);
	},
	psweasy: function(str) { //6-18位首字母开头
		var reg = /^[a-zA-Z]\w{5,17}$/;
		return reg.test(str);
	},
	pwwagain: function(str1, str2) {
		return str1 === str2; //全等 恒等
	},
	urladr: function(str) {
		var reg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
		return reg.test(str);
	},
	name: function(str) { //账号字母开头,6-20位
		var reg = /^[a-zA-Z][\w\-]{5,19}$/;
		return reg.test(str);
	},
	chinese: function(str) {
		var reg = /^[\u2E80-\u9FFF]+$/;
		return reg.test(str);
	},
	birthday: function(str) {
		var reg = /^((((19|20)\d{2})-(0?[13-9]|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/;
		return reg.test(str);
	}
}

/*
 	封装cookie函数:
 	存: Cookie.set()
 	取:	Cookie.get()
 	删: Cookie.remove()
 */

var Cookie = {

	set: function(name, value, prop) { //设置cookie
		//存数据到cookie里面:必写的
		var str = name + '=' + value;

		//prop存json数据，json存后面一些可选参数
		//expires:设置失效时间
		if(prop.expires) {
			str += ';expires=' + prop.expires.toUTCString(); //把时间转成字符串
		}

		//设置path路径

		if(prop.path) {
			//如果设置了
			str += ';path=' + prop.path;
		}

		//domain设置可访问cookie的域名
		if(prop.domain) {
			str += ';domain=' + prop.domain;
		}

		//写到cookie
		document.cookie = str;

	},
	get: function(key) {
		var cookies = document.cookie; //name=tiantian; age=18; usn=yuanyuan; pws=456123
		var arr = cookies.split('; '); //['name=tiantian','age=18','usn=yuanyuan','pws=456123']
		for(var i = 0; i < arr.length; i++) {
			var arr2 = arr[i].split('='); //['name','tiantian']
			if(key == arr2[0]) {
				return arr2[1];
			}
		}
	},
	remove: function(key) {

		//删的原理:设置过期时间
		var now = new Date();
		now.setDate(now.getDate() - 1);
		this.set(key, 'no', {
			expires: now
		});
	}
}

/*
 
3、js 特效

 1）、开定时器，让图片运动：旧图挪走，新图进入可视区
 2）、(鼠标经过停止)点击上下按钮：可以切换下一张和上一张
 3）、焦点跟随，点击焦点可以切到对应的图片
 
 做插件：把代码封装，把不同的地方做成参数
 
 * */

function sliderImg(id, special) {

	var slideimg = getid(id); //最大盒子
	var ul = slideimg.children[0].children[0];
	var alis = ul.children;
	var iW = alis[0].offsetWidth; //获取一个图片的宽度
	var num = 0; //可视区内图片下标，当前的那张
	var light = slideimg.children[1];
	var aspan = light.children; //焦点
	var pis = slideimg.children[2];
	var prevImg = pis.children[0]; //上一张
	var nextImg = pis.children[1]; //下一张

	//	console.log(aspan.length);

	//1.图片都在右侧
	for(var i = 0; i < alis.length; i++) {
		alis[i].style.left = iW + 'px';
	}

	//2.第一个图放到可视区
	alis[0].style.left = 0;

	//3、不断的轮下一张，开定时器：旧图挪走，新图进入可视区
	var timer = null;
	clearInterval(timer);
	timer = setInterval(next, 2000); //每隔2秒切一张图

	function next() { //切一个图片
		//旧图挪走 num=0
		startMove(alis[num], {
			'left': -iW
		});

		//新图进入可视区  num=1,先把新图放在右侧，再挪进来
		//		num++;
		num = ++num >= alis.length ? 0 : num;
		alis[num].style.left = iW + 'px';
		startMove(alis[num], {
			'left': 0
		}); //挪到可视区

		spanAvtive();

	}

	function prev() {
		//旧图挪到右侧 num 0
		startMove(alis[num], {
			'left': iW
		});
		//新图快速放到左侧，再挪进可视区
		//		num--; //num 5
		num = --num < 0 ? alis.length - 1 : num;
		alis[num].style.left = -iW + 'px';
		startMove(alis[num], {
			'left': 0
		}); //可视区
		spanAvtive(); //焦点跟随
	}

	//4、鼠标经过停止，鼠标离开继续轮播
	slideimg.onmouseenter = function() {
		clearInterval(timer); //鼠标经过清除定时器
	}

	slideimg.onmouseleave = function() {
		clearInterval(timer); //放在定时器叠加
		timer = setInterval(next, 2000);
	}

	//5.点击上下按钮：可以切换下一张和上一张
	prevImg.onclick = function() {
		//上一张
		prev();
	}

	nextImg.onclick = function() {
		//下一张
		next();
	}

	//6、焦点跟随，点击焦点可以切到对应的图片
	function spanAvtive() {
		for(var i = 0; i < aspan.length; i++) {
			aspan[i].className = '';
		}
		aspan[num].className = special;
	}
	//点击焦点可以切到对应的图片
	for(var i = 0; i < aspan.length; i++) {
		aspan[i].index = i;
		aspan[i].onclick = function() {
			//给每一个焦点绑定点击事件
			var index = this.index;

			//判断方向
			if(index > num) {
				//从右边切到可视区
				//旧图 num 挪到左边
				startMove(alis[num], {
					'left': -iW
				});
				//新图 index 先放在右侧，再挪进可视区
				alis[index].style.left = iW + 'px';
				startMove(alis[index], {
					'left': 0
				});
				num = index;
				spanAvtive();
			}
			if(index < num) {
				//从左边切入
				//旧图挪到右侧
				startMove(alis[num], {
					'left': iW
				});
				//新的快速放左边，再进入可视区  index
				alis[index].style.left = -iW + 'px';
				startMove(alis[index], {
					'left': 0
				});
				num = index;
				spanAvtive();
			}
		}
	}

}
/*
 	设置配置参数和默认参数的关系：有配置参数用配置参数，没有就用默认参数
 	
 */

function extendObj(obj1, obj2) { //obj1 主角(配置参数)  obj2替补(默认参数)
	for(var key in obj1) {
		obj2[key] = obj1[key];
	}
}

/*
 	对象的深度拷贝
 
 */

function cloneDeep(obj) {
	var str = JSON.stringify(obj); //先把对象转成字符串
	var newobj = JSON.parse(str); //再把字符串转成对象
	return newobj;
}

/*
	ajax函数封装：要参数
		参数一：请求方式：get  post
		参数二：接口路径
		参数三：数据(可选)  name='tiantian'&psw=123456  传给后端的数据
		参数四：成功的回调函数(可选的)
 
*/

function ajax(mechod,url,data,success){
	
	//1.创建对象
	var xhr=new XMLHttpRequest();
	
	if(mechod=='GET' && data){
		//请求方式是get并且有数据
		url+='?'+data;  //var url=`api/checkname.php?username=${val}&time=${new Date()}`;
	}
	
	xhr.open(mechod,url,true);
	
	//2.发送请求
	if(mechod=='GET'){
		xhr.send();//如果是get方式，直接发送请求
	}else{
		//post方式
		xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
		xhr.send(data);//如果是post方式，数据放在send()里面传输
	}
	
	//3.后台做
	
	//4.接收数据
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				//成功的：dom操作，数据渲染
				if(success){
					//如果有回调，就用回调
					success(xhr.responseText);//实参
				}
			}else{
				alert('出错了，状态码是：'+xhr.status);//404 找不到页面，408请求超时
			}
		}
	}
	
}

/**
 * 样式显示 鼠标移入显示移出隐藏
 */
$('.add-carts02').mouseover(function () {
    $('.smallshow').css('display', 'block');
})
$('.add-carts02').mouseleave(function () {
    $('.smallshow').css('display', 'none');
})
$('.f-service').find('ul li').mousemove(function () {
    // console.log($(this).index());
    var ind = $(this).index() + 1;
    $(this).addClass('f-service-up').siblings().removeClass('f-service-up');
    $('.f-service-con img').attr('src', '../img/f-service-img' + ind + '.jpg');
    $('.f-service-up').find('i').css('backgroundPositionX', '-72px');
    $('.f-service-up').siblings().find('i').css('backgroundPositionX', '0px');
})
$('.nav-left').find('a').click(function () {
    $(this).addClass('now').siblings().removeClass('now');
})

/**
 * 回到顶部
 */
var backTop = document.getElementById('back-top');
backTop.onclick = function () {
    var timer = setInterval(function () {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        // console.log(scrollTop);
        if (scrollTop > 0) {
            window.scrollTo(0, scrollTop - 200);
        } else {
            clearInterval(timer);
        }
    }, 50);
}
/**
 * 滚动到一定距离显示回到顶部和固定详情导航
 */
var m_nav = document.getElementById('m-nav');
var m_main = document.getElementById('m-main');
var nright = document.getElementById('nav-right');
var Gde = document.getElementById('goods_detail');
var Gpro = document.getElementById('goods_promise');
window.onscroll = function () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    // console.log(scrollTop);
    if (scrollTop > 300) {
        backTop.style.display = 'block'; // 回到顶部显示
        m_nav.style.position = 'fixed';
        m_nav.style.top = '0';
        m_nav.style.marginTop = '0';
    } else {
        backTop.style.display = 'none';
    }

    if (scrollTop > 780) {
        m_nav.style.position = 'fixed';
        m_nav.style.width = '758px';
        nright.style.opacity = 1;
        m_main.style.marginTop = '20px';
        Gde.classList.add("now");
        Gpro.classList.remove("now");

    } else {
        m_nav.style.position = 'relative';
        nright.style.opacity = 0;
    }
    if (scrollTop > 7050) {
        Gde.classList.remove("now");
        Gpro.classList.add("now");
    }


}


/**
 * 菜单数据传送
 */
var menus = document.getElementById('menus');
// console.log(menus);
menus.onclick = function (e) {
    var e = e || e.window;
    var target = e.target || e.srcElement;
    // console.log(target.innerHTML);
    if (target.nodeName.toLowerCase() == 'a') {
        window.open('list.html?keyword=' + target.innerHTML);
    }

}

/**
 * 头部地址
 */
var address01 = document.getElementById('address01'); //送货地址1
var address02 = document.getElementById('address02'); // 送货地址2
var Culs = document.getElementById('Culs'); // 下拉地址大盒子

// 下拉地址的点击得到地址存进cookie中
Culs.onclick = function (e) {
    var e = e || e.window;
    var target = e.target || e.srcElement;
    var val = target.innerHTML;
    var data = new Date();
    data.setDate(data.getDate() + 999);
    document.cookie = 'address=' + val + ';expires=' + data + ';path=/lefeng/src/';
    // console.log(document.cookie);
    location.reload(); // 刷新页面
}

// 如果cookie中存在地址则隐藏掉悬浮地址和悬浮的透明背景，并更新送货地址
if (Cookie.get('address')) {
    // console.log(Cookie.get('address'));
    var address = Cookie.get('address');
    address01.innerHTML = address;
    address02.innerHTML = address;
}
/**
 *  获取cookie值显示在页面上
 */
var username = document.getElementById('username'); // 用户名
var has_tbody = document.getElementById('has_tbody'); // 购物车显示
var num01 = document.getElementById('num01'); // 购物车总数量01
var num02 = document.getElementById('num02'); // 购物车总数量02
var num03 = document.getElementById('num03'); // 购物车总数量03
var total = document.getElementById('total'); // 购物车总金额
var go_cart = document.getElementById('go_cart'); // 去购物车结算
if (Cookie.get('user')) {
    var name = Cookie.get('user');
    var slice = name.substr(3, 4);
    var showname = name.replace(slice, "****")
    // console.log(showname);
    username.innerHTML = `
        嗡，欢迎来到乐峰，
        <a href="#">${showname}</a>
        |
        <a href="#" id="exit">退出登录</a>
    `;
    username.style.width = "280px";


    //  头部购物车显示
    $('.nohas').css('display', 'none');
    $('.has').css('display', 'block');
    var data = `user=${name}`;
    ajax('GET', '../api/cart.php', data, function (str) {
        // console.log(str);
        var arr = JSON.parse(str);
        var datalist = arr.datalist;
        var html = '';
        var count = 0;
        var totals = 0;
        for (var i = 0; i < datalist.length; i++) {
            html += `
                    <tr>
                        <td>
                            <a href="goods.html?id=${datalist[i].id}">
                                <img src="../${datalist[i].imageUrl}" alt="" style="width: 53px;height: 67px;border: 1px solid #f3f3f3;">
                            </a>
                        </td>
                        <td>
                            <a href="goods.html?id=${datalist[i].id}">${datalist[i].name}</a>
                        </td>
                        <td>
                            <b>￥${datalist[i].unit}</b>×${datalist[i].num}
                        </td>
                    </tr>
                    `;
            count += Number(datalist[i].num);
            totals += Number(datalist[i].unit * datalist[i].num);
        }
        // console.log(count);
        console.log(totals);
        has_tbody.innerHTML = html;
        num01.innerHTML = count;
        num02.innerHTML = count;
        num03.innerHTML = count;
        total.innerHTML = "￥" + totals;
        go_cart.href = "cart.html";
    })
}

// 退出登录
username.onclick = function (e) {
    var e = e || e.window;
    var target = e.target || e.srcElement;
    if (target.id = 'exit') {
        // console.log(target.id);
        var data = new Date();
        data.setDate(data.getDate() - 1);
        document.cookie = 'user=' + name + ';expires=' + data + ';path=/lefeng/src';
        console.log(document.cookie);
        location.reload();
        username.innerHTML = `
        欢迎来到乐峰，请
        <a href="login.html">登录</a>
        |
        <a href="reg.html">免费注册</a>
        `;
    }
}


/**
 * 数据接受并渲染
 */
var date = decodeURI(location.search).split('?')[1];
// console.log(date);
var id = date.split('=')[1];
// console.log(id);

// 渲染
var toptip = document.getElementById('toptip'); // 头小标题 
var topname = document.getElementById('topname'); // 头名字
var mhc_left = document.getElementById('mhc_left'); // 左边主图
var mhc_right = document.getElementById('mhc_right'); // 右边购物车
var smallshow = document.getElementById('smallshow'); // 加入购物车时小型渲染
var tb_detail = document.getElementById('tb_detail'); // 详情表格数据渲染
var ylike = document.getElementById('ylike'); // 猜你喜欢


var data = `id=${id}`;
ajax('GET', '../api/goods.php', data, function (str) {
    // console.log(str);
    var arr = JSON.parse(str);
    var datalists = arr.datalists;
    var randlists = arr.randlists; // 随机内容
    // console.log(datalists);
    // 头小标题 
    toptip.innerHTML = `${datalists[0].brandname}专场`;
    // 头名字
    topname.innerHTML = `${datalists[0].name}`;
    // 左边主图

    mhc_left.innerHTML = `
    <h2>${datalists[0].name}</h2>
    <p class="mchtitle">${datalists[0].title}</p>
    <div class="magnifier" id="magnifier1">
            <div class="magnifier-container">
                <div class="images-cover"></div>
 
                <div class="move-view"></div>

            </div>
            <div class="magnifier-assembly">
                    <div class="magnifier-btn">
                        <span class="magnifier-btn-left">&lt;</span>
                        <span class="magnifier-btn-right">&gt;</span>
                    </div>

                    <div class="magnifier-line">
                        <ul class="clearfix animation03">
                            <li>
                                <div class="small-img">
                                     <img src="../${datalists[0].goodsimagesUrl}" /> 
                                </div>
                            </li>
                            <li>
                                <div class="small-img">
                                    <img src="../${datalists[0].goodsimagesUrl}" />
                                </div>
                            </li>
                            <li>
                                <div class="small-img">
                                     <img src="../${datalists[0].goodsimagesUrl}" /> 
                                </div>
                            </li>
                            <li>
                                <div class="small-img">
                                    <img src="../${datalists[0].goodsimagesUrl}" /> 
                                </div>
                            </li>
                            <li>
                                <div class="small-img">
                                     <img src="../${datalists[0].goodsimagesUrl}" /> 
                                </div>
                            </li>
                        </ul>
                    </div>
                    
            </div>
            <div class="magnifier-view"></div>  
    </div>
    `;

    // 右边购物车
    mhc_right.innerHTML = `
        <li>
        <img src="../${datalists[0].brandimagesUrl}" alt="">
    </li>
    <li>
        <dl>
            <dt class="prices">价格</dt>
            <dd>
                <span>
                    <i class="ico-price">￥</i>
                    <b>${datalists[0].now}</b>
                </span>
                <span class="disc">${datalists[0].discount}折</span>
                <span class="oldprice">￥${datalists[0].orig}</span>
            </dd>
        </dl>
        <dl>
            <dt>优惠</dt>
            <dd>
                <i class="mianyou"></i>
                <span class="baoyou">全场满99包邮</span>
            </dd>
        </dl>
    </li>
    <li>
        <dl>
            <dt>购买数量</dt>
            <dd>
                <span class="plus">-</span>
                <textarea name="" id="num" >1</textarea>
                <span class="subtract">+</span>
            </dd>
            <p class="prompt"></p>
        </dl>
        <dl>
            <span class="add-carts">加入购物车</span>
            <p class="gain">购买最多可获得<i class="gain-number">84个</i>花粉 </p>
        </dl>
    </li>
        `;

    smallshow.innerHTML = `
        <dt><img src="../${datalists[0].goodsimagesUrl}" style="width:90px;height:114px;" alt=""></dt>
        <dd>
            ${datalists[0].name}
            <p class="tip01">￥${datalists[0].orig}</p>
            <p class="tip02">￥${datalists[0].now}</p>
        </dd>
    `;

    tb_detail.innerHTML = `
        <tr>
            <td>商品品牌：</td>
            <td>${datalists[0].brandname}</td>
        </tr>
        <tr>
            <td> 商品名称：</td>
            <td>${datalists[0].name}</td>
        </tr>
        <tr>
            <td> 备注：</td>
            <td>${datalists[0].beizhu}</td>
        </tr>
        <tr>
            <td>有效期：</td>
            <td>${datalists[0].year}年（具体日期以收到实物为准）</td>
        </tr>
        <tr>
            <td>规格：</td>
            <td>${datalists[0].size}</td>
        </tr>
        <tr>
            <td>特点描述：</td>
            <td>${datalists[0].trait}</td>
        </tr>
        <tr>
            <td>产地：</td>
            <td>${datalists[0].made_in}</td>
        </tr>
        <tr>
            <td>货号：</td>
            <td>${datalists[0].PN}</td>
        </tr>    
    `;

    var html = '';
    for (var i = 0; i < randlists.length; i++) {
        html += `
            <dl name="${randlists[i].id}">
                <dt>
                <img src="../${randlists[i].goodsimagesUrl}" alt="" style="width:200px;height:200px;">
                </dt>
                <dd>
                <p>${randlists[i].name}</p>
                <p>
                    <b>￥${randlists[i].now}</b>
                    <span>￥${randlists[i].orig}</span>
                </p>
                </dd>
            </dl>
        `;
    }
    ylike.innerHTML = html;

    /**
     * 放大镜
     */
    $(function () {

        var magnifierConfig = {
            magnifier: "#magnifier1", //最外层的大容器
            width: 600, //承载容器宽
            height: 347, //承载容器高
            moveWidth: 80, //如果设置了移动盒子的宽度，则不计算缩放比例
            zoom: 5 //缩放比例
        };

        var _magnifier = magnifier(magnifierConfig);

        /*magnifier的内置函数调用*/
        /*
            //设置magnifier函数的index属性
            _magnifier.setIndex(1);

            //重新载入主图,根据magnifier函数的index属性
            _magnifier.eqImg();
        */
    });



})


ylike.onclick = function (e) {
    var e = e || window.e;
    var target = e.target || e.srcElement;
    // console.log(target.parentNode.parentNode);
    if (target.parentNode.parentNode = 'dl') {
        var randid = target.parentNode.parentNode.getAttribute('name');
        // console.log(randid);
        location.href = 'goods.html?id=' + randid;
    }
}

/**
 * 加入购物车
 */
var addsucces = document.getElementById('addsucces');
var pay = document.getElementById('pay');
var istrue = false;

mhc_right.onclick = function (e) {
    var e = e || window.e;
    var target = e.target || e.srcElement;
    // console.log(target);
    var aDds = this.children[2].children[0].children[1]; // 购买数量
    // console.log(aDds);
    var tip = this.children[2].children[0].children[2];
    // console.log(tip);

    //  数量减少
    if (target.className == 'plus') {
        var num = target.nextElementSibling.value.trim();
        // console.log(num);
        if (num <= 1) {
            num = 1;
            tip.innerHTML = "此商品最少购买1件";
            tip.style.display = 'block';
        }
        if (num > 1) {
            num--;
            // tip.style.display = 'none';   
        }

        // console.log(num);
        target.nextElementSibling.value = num;
    }

    //  数量增加
    if (target.className == 'subtract') {
        var num = target.previousElementSibling.value.trim();
        // console.log(num);
        // if(num<=1){
        //     num=1;
        // }
        if (num >= 1) {
            num++;
            tip.style.display = 'none';
        }
        // if(num>2){
        //     num=2;
        //     tip.style.display = 'block';
        //     tip.innerText='别贪心，您最多可购买2件';
        // }else{
        //     tip.style.display = 'none';
        // }
        // console.log(num);
        target.previousElementSibling.value = num;
    }


    // 加入购物车功能
    if (target.className == 'add-carts') {
        if (Cookie.get('user')) {
            var user = Cookie.get('user'); // 用户名
            var num = aDds.children[1].value; // 数量
            // console.log(num);
            var data01 = `id=${id}`;
            ajax('GET', '../api/querycart.php', data01, function (str) {
                // console.log(str);
                var arr = JSON.parse(str);
                // console.log(arr);
                var unit = arr[0].now; // 单价
                // console.log(unit);
                var goodsimagesUrl = arr[0].goodsimagesUrl; // 照片地址
                var name = arr[0].name; // 商品名称
                var size = arr[0].size; // 规格
                var orig = arr[0].orig; // 原价
                // console.log(user+id);

                var data02 = `user=${user}&id=${id}&num=${num}&unit=${unit}&imageUrl=${goodsimagesUrl}&name=${name}&size=${size}&orig=${orig}`;
                ajax('GET', '../api/addcart.php', data02, function (str) {
                    // console.log(str);
                    if (str = '加入购物车成功') {
                        clearTimeout(timer);
                        // location.reload();
                        addsucces.style.display = 'block';
                        var timer = setTimeout(() => {
                            location.reload()
                        }, 1000);
                    }

                })

            })

        } else {
            location.href = 'login.html';
        }
    }

    e.preventDefault(); // 阻止默认事件
}

/*详情框导航的加入购物车*/
var addcarts02 = document.getElementById('add-carts02');
addcarts02.onclick = function () {
    if (Cookie.get('user')) {
        var user = Cookie.get('user'); // 用户名
        var num = 1;
        console.log(num);

        var data01 = `id=${id}`;
        ajax('GET', '../api/querycart.php', data01, function (str) {
            // console.log(str);
            var arr = JSON.parse(str);
            // console.log(arr);
            var unit = arr[0].now; // 单价
            // console.log(unit);
            var goodsimagesUrl = arr[0].goodsimagesUrl; // 照片地址
            var name = arr[0].name; // 商品名称
            var size = arr[0].size; // 规格
            var orig = arr[0].orig; // 原价

            var data02 = `user=${user}&id=${id}&num=${num}&unit=${unit}&imageUrl=${goodsimagesUrl}&name=${name}&size=${size}&orig=${orig}`;
            ajax('GET', '../api/addcart.php', data02, function (str) {
                // console.log(str);
                if (str = '加入购物车成功') {
                    clearTimeout(timer);
                        // location.reload();
                        addsucces.style.display = 'block';
                        var timer = setTimeout(() => {
                            location.reload()
                        }, 1000);
                }


            })

        })

    } else {
        location.href = 'login.html';
    }
}

pay.onclick = function(){
    istrue = !istrue;
}
if(istrue){
    clearTimeout(timer);
}


/**
 * 搜索框
 */
var search_sumbit = document.getElementById('search-sumbit');
var search_inp = document.getElementById('search-inp');

search_sumbit.onclick = function(){
    var val = search_inp.value.trim();
    // console.log(val);
    location.href = 'list.html?keyword='+val;
}
// 送货地址
$('.city-name').hover(function(){
    $('.city-address').css('display','block');
});
$('.city-address').mouseleave(function(){
    $('.city-address').css('display','none');
});

// 快速导航
$('.fasts').hover(function(){
    $('.quick').css('display','block');
});
$('.quick').mouseleave(function(){
    $('.quick').css('display','none');
});

// 手机乐峰
$('.tel01').hover(function(){
    $('.phone').css('display','block');
});
$('.phone').mouseleave(function(){
    $('.phone').css('display','none');
});

// 搜索框
$('#search-inp').focus(function(){
    $('.search').css('background-image','url(../img/jinglingtu01.png)');
    $('.search').css('background-position','0px -483px');
});
$('#search-inp').blur(function(){
    $('.search').css('background-image','url(../img/jinglingtu01.png)');
    $('.search').css('background-position','0px -443px');
});

// 购物车
$('.carts01').mouseover(function(){
    $('.carts02').css('display','block');
});
$('.carts02').mouseleave(function(){
    $('.carts02').css('display','none');
});

// 下拉菜单
$('.nav-menu').mouseover(function(){
    $('.float-menu').css('display','block');
});
$('.float-menu').mouseleave(function(){
    $('.float-menu').css('display','none');
});

// 香水香氛
$('.perfume').mouseover(function(){
    $('.perfume-main').css('display','block');
});
$('.perfume').mouseleave(function(){
    $('.perfume-main').css('display','none');
});

// 个人护理
$('.oneself').mouseover(function(){
    $('.oneself-main').css('display','block');
});
$('.oneself').mouseleave(function(){
    $('.oneself-main').css('display','none');
});

//关闭成功加入购物车
$('.ico-close').click(function(){
    $('.addsucces').css('display','none');
})


/**
 *  轮播图
 */
var BLists = document.querySelectorAll('.b-lists div');
var BBtns = document.querySelectorAll('.b-btns i');
// console.log(BLists);
var now = 0;

tab();

function tab() {
    for (let i = 0; i < BBtns.length; i++) {
        BBtns[i].className = "";
        BLists[i].style.zIndex = "2";
        BLists[i].style.display = "block";
        startMove(BLists[i], {
            "opacity": 0
        }, function () {
            BLists[i].style.zIndex = "1";
            BLists[i].style.display = "none";
        });
    }
    BBtns[now].className = "on";
    startMove(BLists[now], {
        "opacity": 100
    });
}

// 自动播放下一张
function next() {
    now++;
    if (now == BBtns.length) {
        now = 0;
    }
    tab();
}
var timer = setInterval(next, 2000);

// 点击轮播
for (let i = 0; i < BBtns.length; i++) {
    BBtns[i].onclick = function () {
        now = i;
        tab();
    }
}

// 鼠标移入停止
banner.onmouseover = function () {
    clearInterval(timer);
}
// 鼠标移开
banner.onmouseout = function () {
    timer = setInterval(next, 2000);
}

/**
 * 品牌特卖
 */
var SUls = document.getElementById('sale-uls');
// console.log(SUls);

function sale() {
    var data = `page=1&qty=26`;
    ajax('GET', 'api/index.php', data, function (str) {
        var arr = JSON.parse(str);
        // console.log(arr);
        var Slists = arr.datalist;
        // console.log(Slists);
        for (var i = 0; i < Slists.length; i++) {
            Screate(Slists[i]);
        }
        var SH = Slists.length / 2 * 280;
        // console.log(SH);
        SUls.style.height = SH + "px";
    });

    function Screate(data) {
        var html = `
                <li>
                    <p><a href="javascript:;"><img src="${data.images}" alt=""></a></p>
                     <p>
                        <span>${data.small}</span>
                        <span>${data.title}</span>
                    </p>
                </li>
    `
        SUls.innerHTML += html;
    }
}
sale();

/**
 * 爆款尝鲜
 */
var FUls = document.getElementById('fresh-uls');
// console.log(FUls);

function fresh() {
    var data = `page=27&qty=20`;
    ajax('GET', 'api/index.php', data, function (str) {
        var arr = JSON.parse(str);
        // console.log(arr);
        var FLists = arr.datalist;
        // console.log(FLists);
        for (var i = 0; i < FLists.length; i++) {
            Fcreate(FLists[i]);
        }
        var FH = FLists.length / 4 * 375;
        FUls.style.height = FH + "px";
    });

    function Fcreate(data) {
        var html = `
            <li>
                <p>
                    <a href="javascript:;"><img src="${data.images}" alt=""></a> 
                </p>
                <p><b>${data.discount}折/</b><a href="javascript:;">${data.title}</a></p>
                <p>
                    <span>￥${data.now}</span>
                    <span>￥${data.orig}</span>
                    <span id="add-carts">查看详情</span>
                </p>
                </li>
        `;
        FUls.innerHTML += html;
    }
}
fresh();

/**
 * 回到顶部
 */
var backTop = document.getElementById('back-top');
backTop.onclick = function () {
    var timer = setInterval(function () {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        // console.log(scrollTop);
        if (scrollTop > 0) {
            window.scrollTo(0, scrollTop - 200);
        } else {
            clearInterval(timer);
        }
    }, 50);
}

/**
 * 左边悬浮
 */
var LFnav = document.getElementById('lf-header');
var Lclose = document.getElementById('lf-close');
var Lsale = document.getElementById('lf-sale');
var Lfresh = document.getElementById('lf-fresh');
var Lsaoyisao = LFnav.children[0];
// console.log(Lsaoyisao);

var sale = document.getElementById('sale');
var fresh = document.getElementById('fresh');

Lclose.onclick = function () {
    Lsaoyisao.style.opacity = '0';
}
// 点击回到品牌特卖
Lsale.onclick = function () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var ST = sale.offsetTop;
    window.scrollTo(0, ST);
}
// 点击回到爆款尝鲜
Lfresh.onclick = function () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var FT = fresh.offsetTop;
    window.scrollTo(0, FT);
}


/**
 * 滚动到一定距离显示回到顶部和左边悬浮导航且切换左边导航样式
 */
window.onscroll = function () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    // console.log(scrollTop);
    if (scrollTop > 300) {
        backTop.style.display = 'block'; // 回到顶部显示
        LFnav.style.display = 'block'; // 显示左边悬浮导航
    } else {
        backTop.style.display = 'none';
        LFnav.style.display = 'none';
    }

    var st = sale.offsetTop + SUls.offsetHeight; //特卖标题头到页面头高度和自身高度 = 爆款尝鲜标题头到页面头部的距离
    var ft = st + FUls.offsetHeight; // 爆款尝鲜标题头到页面头部的距离 + 爆款尝鲜自身的高度 = app到页面头部的距离

    if (scrollTop >= sale.offsetTop) {
        Lsale.style.backgroundPosition = "0px -306px";
        Lfresh.style.backgroundPosition = "-67px -381px";
    }
    if (scrollTop >= st) {
        Lsale.style.backgroundPosition = "-67px -306px";
        Lfresh.style.backgroundPosition = "0px -381px";
    }
    if (scrollTop >= ft) {
        Lsale.style.backgroundPosition = "-67px -306px";
        Lfresh.style.backgroundPosition = "-67px -381px";
    }
}

/**
 * 悬浮地址
 */
var rtTable = document.getElementById('rtTable'); //悬浮的地址大盒子
var regionalTipBox = document.getElementById('regionalTipBox'); //整个大盒子
var regionalTipsBk = document.getElementById('regionalTipsBk'); // 黑色透明背景

rtTable.onclick = function (e) {
    var e = e || window.e;
    var target = e.target || e.srcElement;
    var val = target.innerHTML;
    var data = new Date();
    data.setDate(data.getDate() + 999);
    document.cookie = 'address=' + val + ';expires=' + data + ';path=/lefeng/src/';
    // console.log(document.cookie)
    regionalTipBox.style.display = 'none';
    regionalTipsBk.style.display = 'none';
    location.reload(); // 刷新页面
}

var address01 = document.getElementById('address01'); //送货地址1
var address02 = document.getElementById('address02'); // 送货地址2
var Culs = document.getElementById('Culs'); // 下拉地址大盒子

// 下拉地址的点击得到地址存进cookie中
Culs.onclick = function (e) {
    var e = e || window.e;
    var target = e.target || e.srcElement;
    var val = target.innerHTML;
    var data = new Date();
    data.setDate(data.getDate() + 999);
    document.cookie = 'address=' + val + ';expires=' + data + ';path=/lefeng/src/';
    // console.log(document.cookie);
    location.reload(); // 刷新页面
}

// 如果cookie中存在地址则隐藏掉悬浮地址和悬浮的透明背景，并更新送货地址
if (Cookie.get('address')) {
    regionalTipBox.style.display = 'none';
    regionalTipsBk.style.display = 'none';
    // console.log(Cookie.get('address'));
    var address = Cookie.get('address');
    address01.innerHTML = address;
    address02.innerHTML = address;
} else {
    regionalTipBox.style.display = 'block';
    regionalTipsBk.style.display = 'block';
}

/**
 *  获取cookie值显示在页面上
 */
var username = document.getElementById('username'); // 用户名
var has_tbody = document.getElementById('has_tbody'); // 购物车显示
var num01 = document.getElementById('num01'); // 购物车总数量01
var num02 = document.getElementById('num02'); // 购物车总数量02
var num03 = document.getElementById('num03'); // 购物车总数量03
var total = document.getElementById('total'); // 购物车总金额
var go_cart = document.getElementById('go_cart'); // 去购物车结算
if (Cookie.get('user')) {
    var name = Cookie.get('user');
    var slice = name.substr(3,4);
    var showname = name.replace(slice,"****")
    // console.log(showname);
    username.innerHTML = `
        嗡，欢迎来到乐峰，
        <a href="#">${showname}</a>
        |
        <a href="#" id="exit">退出登录</a>
    `;
    username.style.width = "280px";

    //  头部购物车显示
    $('.nohas').css('display','none');
    $('.has').css('display','block');
    var data =`user=${name}`;
    ajax('GET','api/cart.php',data,function(str){
        // console.log(str);
        var arr = JSON.parse(str);
        var datalist = arr.datalist;
        var html='';
        var count = 0;
        var totals = 0;
        for(var i=0;i<datalist.length;i++){
            html +=`
            <tr>
                <td>
                    <a href="html/goods.html?id=${datalist[i].id}">
                        <img src="${datalist[i].imageUrl}" alt="" style="width: 53px;height: 67px;border: 1px solid #f3f3f3;">
                    </a>
                </td>
                <td>
                    <a href="html/goods.html?id=${datalist[i].id}">${datalist[i].name}</a>
                </td>
                <td>
                    <b>￥${datalist[i].unit}</b>×${datalist[i].num}
                </td>
            </tr>
            `;
            count+=Number(datalist[i].num);
            totals+=Number(datalist[i].unit*datalist[i].num);
        }
        // console.log(count);
        console.log(totals);
        has_tbody.innerHTML = html;
        num01.innerHTML = count;
        num02.innerHTML = count;
        num03.innerHTML = count;
        total.innerHTML = "￥"+totals;
        go_cart.href = "html/cart.html";
    })
 
}

/**
 * 退出登录
 */
username.onclick = function (e) {
    var e = e || window.e;
    var target = e.target || e.srcElement;
    if (target.id = 'exit') {
        // console.log(target.id);
        var data = new Date();
        data.setDate(data.getDate() - 1);
        document.cookie = 'user=' + name + ';expires=' + data + ';path=/lefeng/src';
        console.log(document.cookie);
        location.reload();
        username.innerHTML = `
        欢迎来到乐峰，请
        <a href="html/login.html">登录</a>
        |
        <a href="html/reg.html">免费注册</a>
        `;
    }
}

/**
 * 菜单数据传送
 */ 
var menus = document.getElementById('menus');
// console.log(menus);
menus.onclick = function(e){
    var e = e || window.e;
    var target = e.target || e.srcElement;
    // console.log(target.innerHTML);
    if(target.nodeName.toLowerCase()=='a'){
        window.open( 'html/list.html?keyword='+target.innerHTML);
    }
    
}

/**
 * 搜索框
 */
var search_sumbit = document.getElementById('search-sumbit');
var search_inp = document.getElementById('search-inp');

search_sumbit.onclick = function(){
    var val = search_inp.value.trim();
    // console.log(val);
    location.href = 'html/list.html?keyword='+val;
}





/**
 * 数据接收
 */
var date = decodeURI(location.search).split('?')[1];
// console.log(date);
var keyword = date.split('=')[1];
// console.log(keyword);
$('.tag').text(keyword);

/**
 * 菜单数据传送
 */
var menus = document.getElementById('menus');
// console.log(menus);
menus.onclick = function (e) {
    var e = e || window.e;
    var target = e.target || e.srcElement;
    // console.log(target.innerHTML);
    if (target.nodeName.toLowerCase() == 'a') {
        window.open('list.html?keyword=' + target.innerHTML);
    }

}

/**
 * 头部地址
 */
var address01 = document.getElementById('address01'); //送货地址1
var address02 = document.getElementById('address02'); // 送货地址2
var Culs = document.getElementById('Culs'); // 下拉地址大盒子

// 下拉地址的点击得到地址存进cookie中
Culs.onclick = function (e) {
    var e = e || window.e;
    var target = e.target || e.srcElement;
    var val = target.innerHTML;
    var data = new Date();
    data.setDate(data.getDate() + 999);
    document.cookie = 'address=' + val + ';expires=' + data + ';path=/lefeng/src/';
    // console.log(document.cookie);
    location.reload(); // 刷新页面
}

// 如果cookie中存在地址则隐藏掉悬浮地址和悬浮的透明背景，并更新送货地址
if (Cookie.get('address')) {
    // console.log(Cookie.get('address'));
    var address = Cookie.get('address');
    address01.innerHTML = address;
    address02.innerHTML = address;
}
/**
 *  获取cookie值显示在页面上
 */
var username = document.getElementById('username'); // 用户名
var has_tbody = document.getElementById('has_tbody'); // 购物车显示
var num01 = document.getElementById('num01'); // 购物车总数量01
var num02 = document.getElementById('num02'); // 购物车总数量02
var num03 = document.getElementById('num03'); // 购物车总数量03
var total = document.getElementById('total'); // 购物车总金额
var go_cart = document.getElementById('go_cart'); // 去购物车结算
if (Cookie.get('user')) {
    var name = Cookie.get('user');
    var slice = name.substr(3, 4);
    var showname = name.replace(slice, "****")
    // console.log(showname);
    username.innerHTML = `
        嗡，欢迎来到乐峰，
        <a href="#">${showname}</a>
        |
        <a href="#" id="exit">退出登录</a>
    `;
    username.style.width = "280px";

    //  头部购物车显示
    $('.nohas').css('display', 'none');
    $('.has').css('display', 'block');
    var data = `user=${name}`;
    ajax('GET', '../api/cart.php', data, function (str) {
        // console.log(str);
        var arr = JSON.parse(str);
        var datalist = arr.datalist;
        var html = '';
        var count = 0;
        var totals = 0;
        for (var i = 0; i < datalist.length; i++) {
            html += `
                <tr>
                    <td>
                        <a href="goods.html?id=${datalist[i].id}">
                            <img src="../${datalist[i].imageUrl}" alt="" style="width: 53px;height: 67px;border: 1px solid #f3f3f3;">
                        </a>
                    </td>
                    <td>
                        <a href="goods.html?id=${datalist[i].id}">${datalist[i].name}</a>
                    </td>
                    <td>
                        <b>￥${datalist[i].unit}</b>×${datalist[i].num}
                    </td>
                </tr>
                `;
            count += Number(datalist[i].num);
            totals += Number(datalist[i].unit * datalist[i].num);
        }
        // console.log(count);
        console.log(totals);
        has_tbody.innerHTML = html;
        num01.innerHTML = count;
        num02.innerHTML = count;
        num03.innerHTML = count;
        total.innerHTML = "￥" + totals;
        go_cart.href = "cart.html";
    })
}
// 退出登录
username.onclick = function (e) {
    var e = e || window.e;
    var target = e.target || e.srcElement;
    if (target.id = 'exit') {
        // console.log(target.id);
        var data = new Date();
        data.setDate(data.getDate() - 1);
        document.cookie = 'user=' + name + ';expires=' + data + ';path=/lefeng/src';
        console.log(document.cookie);
        location.reload();
        username.innerHTML = `
        欢迎来到乐峰，请
        <a href="login.html">登录</a>
        |
        <a href="reg.html">免费注册</a>
        `;
    }
}

/**
 *更多 多选   
 */
$('.more_list').click(function () {
    $('.search_dl01').css('height', '317px');
    $('.center_search').css('height', '580px');
    $('.brand-list').css('height', '240px');
    $('.scroll-right').css('display', 'block');
    $('.more_list').css('display', 'none');
    $('.pick_up').css('display', 'block');
});
$('.pick_up').click(function () {
    $('.search_dl01').css('height', '90px');
    $('.center_search').css('height', '350px');
    $('.brand-list').css('height', '32px');
    $('.scroll-right').css('display', 'none');
    $('.more_list').css('display', 'block');
    $('.pick_up').css('display', 'none');
});

/**
 * 滚动品牌 
 */
var brandlists = document.getElementById('brand-list');
var scroll = document.getElementById('scroll-right');
var scrollmore = document.getElementById('scroll-more');
var blists = document.getElementById('blists');
// console.log(scrollmore)
scrollmore.onmousedown = function (e) {
    scrollmore.style.background = 'orange';
    var e = e || window.e;
    var y = e.offsetY;
    // console.log(y);
    document.onmousemove = function (e) {
        var e = e || e.window;
        var top = e.clientY - y - 100;
        console.log(top);
        if (top <= 0) {
            top = 0;
        }
        if (top >= scroll.offsetHeight - scrollmore.offsetHeight) {
            top = scroll.offsetHeight - scrollmore.offsetHeight;
        }
        scrollmore.style.top = top + "px";

        var scal = scrollmore.offsetTop / (scroll.offsetHeight - scrollmore.offsetHeight);
        // console.log(scal);
        // console.log(blists.offsetHeight-brandlists.offsetHeight);
        blists.style.marginTop = (blists.offsetHeight - brandlists.offsetHeight) * scal + "px"
    }
    document.onmouseup = function () {
        document.onmousemove = null;
    }
    e.preventDefault(); //阻止默认事件
}
// 品牌图片被点击,没写完

blists.onclick = function (e) {
    var e = e || window.e;
    var target = e.target || e.srcElement;
    // var name = target.name;
    // document.cookie = 'name='+name;
    // console.log(target.name);
    // console.log(target.parentNode);
    target.parentNode.style.border = "1px solid #f10180";


    // location.reload();
}


/**
 * 商品数据渲染
 */
var center = document.getElementById('center'); // 中间内容大盒子
var Tsearch = document.getElementById('center_search'); // 头部搜索
var show_goods = document.getElementById('show_goods'); // 商品大盒子
var goodUls = document.getElementById('goodUls'); // 商品渲染盒子
var goodpages = document.getElementById('pages'); // 按钮
var showbox = document.getElementById('showbox'); // 商品渲染盒子和下一页的总盒子
var spans = goodpages.children; // 按钮所有的子元素span
// console.log(spans);
var Bprev = document.getElementById('btn_prev'); // 上一页按钮
var Bnext = document.getElementById('btn_next'); // 下一页按钮
var bignext = document.getElementById('big_next'); // 大张照片下一页

function show() {
    var data = `keyword=${keyword}&page=1&qty=15`;
    ajax('GET', '../api/list.php', data, function (str) {
        // console.log(str);
        var arr = JSON.parse(str);
        // console.log(arr);
        var data = arr.datalist; // 查询到的数据
        // console.log(data);
        var total = arr.qty; // 总条数
        var count = Math.ceil(total / 4); // 页数
        // console.log(count);
        var trait = arr.trait;
        // console.log(trait);
        var res = [];
        for (var i = 0; i < trait.length; i++) {
            var str = trait[i].trait.split('，');

            // console.log(str);
            res.push(str);

        }
        // console.log(res);

        // 商品的渲染
        GCreate(data, res);

        // showbox.style.height = (data.length / 4 * 465) + "px";
        // var MH = show_goods.offsetTop + data.length / 4 * 560; // 中间盒子总高度
        // center.style.height = MH + "px";

        // 按钮操作
        for (var i = 0; i < count; i++) {
            var html = `<span><a href="#">${(i+1)}</a> </span>`;
            goodpages.innerHTML += html;
        }
        var ind = arr.page - 1; // 下标值
        // console.log(ind);
        spans[ind].className = 'goods_qty';

    })
}
show();

// 商品渲染
function GCreate(data, st) {
    // console.log(data);
    var html1 = '';
    for (var i = 0; i < data.length; i++) {
        // 
        // 
        html1 += `
                <div class="libox">
                    <li>
                        <a target="_blank" href="./goods.html?id=${data[i].id}">
                            <p>
                                <img src="../${data[i].listimagesUrl}" alt="">
                            </p>
                            <p class="brandId"> ${data[i].name} </p>
                        </a>
                        <p class="gtitle">
                            <span><i>￥</i> ${data[i].now}</span>
                            <span>(${data[i].discount}折)</span>
                            <span>￥${data[i].orig}</span>
                        </p>
                        <p class="gadd">
                            <span class="add_carts" id="${data[i].id}">加入购物车</span>
                        </p>
                    </li>
                    <div class="littlt-tag">
                        <ul id="lis">
                        </ul>
                    </div>
                </div>
             `;
    }
    goodUls.innerHTML = html1;

    for (var i = 0; i < st.length; i++) {
        var lis = goodUls.querySelectorAll('#lis');
        // console.log(lis[i]);
        var arr = st[i];
        // console.log(arr);
        // console.log(arr.length);
        var html2 = '';
        for (var j = 0; j < arr.length; j++) {
            // console.log(arr[j]);
            html2 += `
            <li>${arr[j]}</li>
            `;
        }
        lis[i].innerHTML = html2;
    }

}

/**
 * 头部尾
 */
// 头部尾的价格排行样式
$(".order02_f ul li").mousemove(function () {
    $(this).addClass('select').siblings().removeClass('select');
})

//  头尾为价格升价排序
var Sfooter = document.getElementById('sfooter');
var price_down = document.getElementById('price_down');
var price_up = document.getElementById('price_up');
var isdesc = false;
var isasc = false;

Sfooter.onclick = function (e) {
    var e = e || window.e;
    var target = e.target || e.srcElement;
    // console.log(target);
    // 降序
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].className == 'goods_qty') {
            var now = i + 1;
        }
    }
    var page = now;
    if (target.id == 'price_down') {
        isdesc = !isdesc;
        var data = `keyword=${keyword}&page=${page}&qty=15`;
        ajax('GET', '../api/list.php', data, function (str) {
            // console.log(str);
            var arr = JSON.parse(str);
            var desc = arr.desc;
            // console.log(desc);
            var trait = arr.trait;
            // console.log(trait);
            var res = [];
            for (var i = 0; i < trait.length; i++) {
                var str = trait[i].trait.split('，');
                // console.log(str);
                res.push(str);

            }
            // console.log(res);

            // 商品的渲染
            GCreate(desc, res);
        })

    }
    // 升序
    if (target.id == 'price_up') {
        isasc = !isasc;
        var data = `keyword=${keyword}&page=${page}&qty=15`;
        ajax('GET', '../api/list.php', data, function (str) {
            // console.log(str);
            var arr = JSON.parse(str);
            var asc = arr.asc;
            // console.log(desc);
            var trait = arr.trait;
            // console.log(trait);
            var res = [];
            for (var i = 0; i < trait.length; i++) {
                var str = trait[i].trait.split('，');
                // console.log(str);
                res.push(str);

            }
            // console.log(res);

            // 商品的渲染
            GCreate(asc, res);

        })
    }
}



// 只看在售销量
var ord4_check = document.getElementById('ord4_check');
var istrue = true;
ord4_check.onclick = function () {
    if (istrue) {
        ord4_check.style.backgroundPosition = "-24px 0px";
        istrue = !istrue;
    } else {
        ord4_check.style.backgroundPosition = "-47px 0px";
        istrue = !istrue;
    }

}


// 按钮点击
pages.onclick = function (e) {
    var e = e || window.e;
    var target = e.target || e.srcElement;
    if (target.nodeName.toLowerCase() == 'a') {
        var page = target.innerText;
        var data = `keyword=${keyword}&page=${page}&qty=15`;
        ajax('GET', '../api/list.php', data, function (str) {
            // console.log(str);
            var arr = JSON.parse(str);
            var data = arr.datalist;
            var desc = arr.desc;
            // console.log(desc);
            var asc = arr.asc;
            // console.log(asc);
            var trait = arr.trait;
            // console.log(trait);
            var res = [];
            for (var i = 0; i < trait.length; i++) {
                var str = trait[i].trait.split('，');

                // console.log(str);
                res.push(str);

            }
            // console.log(res);
            // 商品的渲染
            // console.log(isdesc);
            // console.log(isasc);

            if (isdesc) {
                GCreate(desc, res);
            }
            if (isasc) {
                GCreate(asc, res);
            }
            if (isdesc == false && isasc == false) {
                GCreate(data, res);
            }


        });
        for (var i = 0; i < spans.length; i++) {
            spans[i].className = '';
        }
        target.parentNode.className = 'goods_qty';

        if (page > 1) {
            Bprev.style.background = "#fff";
        } else {
            Bprev.style.background = "#eaeaea";
            Bprev.style.cursor = "default";
        }
        if (page == spans.length) {
            Bnext.style.background = "#eaeaea";
            Bnext.style.cursor = "default";
        } else {
            Bnext.style.background = "#fff";
        }
    }
    e.preventDefault(); // 阻止默认事件
}
// 上一页
Bprev.onclick = function () {
    // console.log(spans);
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].className == 'goods_qty') {
            var now = i;
            // console.log(now);
            if (now > 0) {
                var page = now--;
                var data = `keyword=${keyword}&page=${page}&qty=15`;
                ajax('GET', '../api/list.php', data, function (str) {
                    // console.log(str);
                    var arr = JSON.parse(str);
                    var data = arr.datalist;
                    var desc = arr.desc;
                    // console.log(desc);
                    var asc = arr.asc;
                    // console.log(asc);
                    var trait = arr.trait;
                    // console.log(trait);
                    var res = [];
                    for (var i = 0; i < trait.length; i++) {
                        var str = trait[i].trait.split('，');

                        // console.log(str);
                        res.push(str);

                    }
                    // console.log(res);
                    // 商品的渲染
                    // console.log(isdesc);

                    if (isdesc) {
                        GCreate(desc, res);
                    }
                    if (isasc) {
                        GCreate(asc, res);
                    }
                    if (isdesc == false && isasc == false) {
                        GCreate(data, res);
                    }
                });
                // console.log(page);
                for (var i = 0; i < spans.length; i++) {
                    spans[i].className = '';
                }
                spans[now].className = 'goods_qty';
                Bprev.style.background = "#fff";
            }
            if (now == 0) {
                Bprev.style.background = "#eaeaea";
                Bprev.style.cursor = "default";
                Bnext.style.background = "#fff";
            }
        }


    }

}
// 下一页
Bnext.onclick = function () {
    // console.log(spans);
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].className == 'goods_qty') {
            var now = i;
            // console.log(now);
            if (now >= 0) {
                var page = now + 2;
                // console.log(page);
                var data = `keyword=${keyword}&page=${page}&qty=15`;
                ajax('GET', '../api/list.php', data, function (str) {
                    // console.log(str);
                    var arr = JSON.parse(str);
                    var data = arr.datalist;
                    var desc = arr.desc;
                    // console.log(desc);
                    var asc = arr.asc;
                    // console.log(asc);
                    var trait = arr.trait;
                    // console.log(trait);
                    var res = [];
                    for (var i = 0; i < trait.length; i++) {
                        var str = trait[i].trait.split('，');

                        // console.log(str);
                        res.push(str);

                    }
                    // console.log(res);
                    // 商品的渲染
                    console.log(isdesc);

                    if (isdesc) {
                        GCreate(desc, res);
                    }
                    if (isasc) {
                        GCreate(asc, res);
                    }
                    if (isdesc == false && isasc == false) {
                        GCreate(data, res);
                    }
                });
                // console.log(page);
                var ind = page - 1;
                for (var i = 0; i < spans.length; i++) {
                    spans[i].className = '';
                }
                spans[ind].className = 'goods_qty';
                Bnext.style.background = "#fff";
                Bprev.style.background = "#fff";
            }
            if (now == 2) {
                Bnext.style.background = "#eaeaea";
                Bnext.style.cursor = "default";
            }
        }


    }



}
// 大张的下一页
bignext.onclick = function () {
    // console.log(spans);
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].className == 'goods_qty') {
            var now = i;
            // console.log(now);
            if (now >= 0) {
                var page = now + 2;
                // console.log(page);
                var data = `keyword=${keyword}&page=${page}&qty=15`;
                ajax('GET', '../api/list.php', data, function (str) {
                    // console.log(str);
                    var arr = JSON.parse(str);
                    var data = arr.datalist;
                    var desc = arr.desc;
                    console.log(desc);
                    var asc = arr.asc;
                    // console.log(asc);
                    var trait = arr.trait;
                    // console.log(trait);
                    var res = [];
                    for (var i = 0; i < trait.length; i++) {
                        var str = trait[i].trait.split('，');

                        // console.log(str);
                        res.push(str);

                    }
                    // console.log(res);
                    // 商品的渲染


                    if (isdesc) {
                        GCreate(desc, res);
                    }
                    if (isasc) {
                        GCreate(asc, res);
                    }
                    if (isdesc == false && isasc == false) {
                        GCreate(data, res);
                    }
                });
                // console.log(page);
                var ind = page - 1;
                for (var i = 0; i < spans.length; i++) {
                    spans[i].className = '';
                }
                spans[ind].className = 'goods_qty';
                Bnext.style.background = "#fff";
                Bprev.style.background = "#fff";
            }
            if (now == 2) {
                Bnext.style.background = "#eaeaea";
                Bnext.style.cursor = "default";
            }
        }


    }



}

/**
 * 加入购物车
 */
var addsucces = document.getElementById('addsucces');
var pay = document.getElementById('pay');
var istrue = false;
goodUls.onclick = function(e){
    var e = e || window.e ;
    var target = e.target || e.srcElement;
    if(target.className == 'add_carts'){
        // console.log(target.id)
        var id = target.id;
        var data01 = `keyword=${keyword}&id=${id}`;
        ajax('GET','../api/querylist.php',data01,function(str){
            // console.log(str);
            var arr = JSON.parse(str);
            var data = arr.datalist;
            var num = 1;
            var unit = data[0].now;
            var imagesUrl = data[0].goodsimagesUrl;
            var showname = data[0].name;
            var size = data[0].size;
            var orig = data[0].orig;

            var data02 = `user=${name}&id=${id}&num=${num}&unit=${unit}&imageUrl=${imagesUrl}&name=${showname}&size=${size}&orig=${orig}`;
            ajax('GET','../api/addcart.php',data02,function(str){
                // console.log(str);
                if (str = '加入购物车成功') {
                    clearTimeout(timer);
                        // location.reload();
                        addsucces.style.display = 'block';
                        
                        var timer = setTimeout(() => {
                            location.reload()
                        }, 1000);
                }
            })
        })
        
    }
}
pay.onclick = function(){
    istrue = !istrue;
}
if(istrue){
    clearTimeout(timer);
}


/**
 * 搜索框
 */
var search_sumbit = document.getElementById('search-sumbit');
var search_inp = document.getElementById('search-inp');

search_sumbit.onclick = function(){
    var val = search_inp.value.trim();
    // console.log(val);
    location.href = 'list.html?keyword='+val;
}
$('#user').focus(function () {
    $('#inpText1').css('display', 'block');
});
$('#user').blur(function () {
    $('#inpText1').css('display', 'none');
});

$('#psw').focus(function () {
    $('#inpText3').css('display', 'block');
});
$('#psw').blur(function () {
    $('#inpText3').css('display', 'none');
});


var user = document.getElementById('user'); //用户名
var psw = document.getElementById('psw'); // 密码
var inp2 = document.getElementById('ico-inp2'); // 验证码提示按钮
var inpText3 = document.getElementById('inpText3');
var btns =document.getElementById('login_btns');
var isok = false;

// 验证码
$.idcode.setCode();
Txtidcode.onblur = function () {
    var IsBy = $.idcode.validateCode();
    // console.log(IsBy);
    if (IsBy) {
        inp2.style.opacity = 1;
        inp2.style.backgroundPosition = "0px -238px";
        isok = true;
    } else {
        inp2.style.opacity = 1;
        inp2.style.backgroundPosition = "-32px -238px";
    }
}

// 登录
btns.onclick =function(){
    var val1 = user.value.trim();
    var val2 = psw.value.trim();
    if(val1&&val2){
        var data = `user=${val1}&psw=${val2}`;
        ajax('POST','../api/login.php',data,function(str){
            // console.log(str);
            if(str==1){
                document.cookie = 'user='+val1+';path=/lefeng/src';
                // console.log(document.cookie);
                location.href = '../index.html';
            }else{
                // location.reload();
                inpText3.innerText = '用户名或密码错误';
                inpText3.style.display = 'block';
                inpText3.style.color = 'red';
            }
        })
    }
    user.value = "";
    Txtidcode.value = "";
}
$('#user').focus(function () {
    $('#inpText1').css('display', 'block');
});
$('#user').blur(function () {
    $('#inpText1').css('display', 'none');
});

$('#psw').focus(function () {
    $('#inpText3').css('display', 'block');
});
$('#psw').blur(function () {
    $('#inpText3').css('display', 'none');
});

$('#retain').focus(function () {
    $('#inpText4').css('display', 'block');
});
$('#retain').blur(function () {
    $('#inpText4').css('display', 'none');
});


var user = document.getElementById('user'); //用户名
var psw = document.getElementById('psw'); // 密码
var retain = document.getElementById('retain'); // 确认密码
var Txtidcode = document.getElementById('Txtidcode'); //验证码
var inp1 = document.getElementById('ico-inp1'); // 用户名提示按钮
var inp2 = document.getElementById('ico-inp2'); // 验证码提示按钮
var inp3 = document.getElementById('ico-inp3'); // 确认密码提示按钮
var inp4 = document.getElementById('ico-inp4'); // 确认密码提示按钮
var inpText4 = document.getElementById('inpText4'); //确认密码提示框

var isok1 = false; //开关1
var isok2 = false; //开关2
var isok3 = false; //开关3
var isok4 = false; //开关4

// 用户名验证
user.onkeyup = function () {
    var val = user.value.trim();
    var reg = /^1[3-9]\d{9}$/; //正则验证 手机号码
    // console.log(reg.test(val));
    if (val) {
        if (reg.test(val)) {
            var data = `user=${val}`;
            ajax('GET', '../api/checkname.php', data, function (str) {
                // console.log(str);
                if (str == 0) {
                    inp1.style.opacity = 1;
                    inp1.style.backgroundPosition = "0px -238px";
                    isok1 = true;
                } else {
                    inp1.style.backgroundPosition = "-32px -238px";
                }
            });
        } else {
            inp1.style.backgroundPosition = "-32px -238px";
        }
    }
}

// 验证码
$.idcode.setCode();
Txtidcode.onblur = function () {
    var IsBy = $.idcode.validateCode();
    // console.log(IsBy);
    if (IsBy) {
        inp2.style.opacity = 1;
        inp2.style.backgroundPosition = "0px -238px";
        isok2 = true;
    } else {
        inp2.style.opacity = 1;
        inp2.style.backgroundPosition = "-32px -238px";
    }
}


// 密码验证
psw.onkeyup = function () {
    var val = psw.value.trim();
    var reg = /^[A-Za-z0-9_-\w\W]{8,20}$/;
    if (val) {
        if (reg.test(val)) {
            isok3 = true;
        }
    }
    // console.log(isok3);
}

// 确认密码验证
retain.onkeyup = function () {
    var val1 = psw.value.trim();
    var val2 = retain.value.trim();
    if (val2) {
        if (val1 != val2) {
            inp4.style.opacity = 1;
            inp4.style.backgroundPosition = "-32px -238px";
            inpText4.innerText = '两次密码不一致';
            inpText4.style.color = 'red';
            isok4 = false;
        } else {
            inp4.style.opacity = 1;
            inp4.style.backgroundPosition = "0px -238px";
            inpText4.innerText = '';
            isok4 = true;
        }
        // console.log(isok4);
    }
}

// 注册
var reg_btns = document.getElementById('reg_btns');
reg_btns.onclick = function () {
    val1 = user.value.trim();
    val2 = psw.value.trim();
    if (isok1 && isok2 && isok3 && isok4) {
        var data = `user=${val1}&psw=${val2}`;
        ajax('POST', '../api/reg.php', data, function (str) {
            // console.log(str);
            if(str){
                location.href = 'login.html';
            }
        })
    }
}
/*
 * 运动函数
 * 参数：
 * 		elem：待操作的html元素
 * 		attr：html元素上的属性
 * 		target：属性的目标值
 * 参数说明：startMove能够让elem元素的attr属性以运动的形式，到达目标值
 */

function startMove(elem, json, callback){	
	clearInterval(elem.timer);
	elem.timer = setInterval(function(){
		var flag = true; // 假设每个属性都到达了目标值
		// 多属性同时运动
		for( var attr in json ){
			var target = json[attr];
			// 获取待移动的元素的当前属性值
			var v = getComputedStyle(elem)[attr];
			if( attr == "opacity" ){
				v = Math.round(v*100);
			}else{
				v = parseInt(v);
			}
			// 目标值与当前值的间距
			var dis = target-v;
			// 求移动时的步长
			var step = (dis/6);
			if( step > 0 ){
				step = Math.ceil(step);
			}else{
				step = Math.floor(step);
			}
			// 更新
			if( attr == "opacity" ){
				elem.style[attr] = (v+step)/100;
			}else{
				elem.style[attr] = v+step+"px";
			}
			// 只要有一个属性，没有到达目标值，flag就更新为false
			if( v+step != target ){
				flag = false;
			}
		}
		// 如果循环结束了，flag依然为真时，表示所有的属性都到达了目标值
		if( flag ){
			clearInterval(elem.timer);
			if( callback ){
				callback();
			}
		}
		
	}, 40);	
}
