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