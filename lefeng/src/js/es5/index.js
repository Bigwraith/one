'use strict';

/**
 *  轮播图
 */
var BLists = document.querySelectorAll('.b-lists div');
var BBtns = document.querySelectorAll('.b-btns i');
// console.log(BLists);
var now = 0;

tab();

function tab() {
    var _loop = function _loop(i) {
        BBtns[i].className = "";
        BLists[i].style.zIndex = "2";
        BLists[i].style.display = "block";
        startMove(BLists[i], {
            "opacity": 0
        }, function () {
            BLists[i].style.zIndex = "1";
            BLists[i].style.display = "none";
        });
    };

    for (var i = 0; i < BBtns.length; i++) {
        _loop(i);
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

var _loop2 = function _loop2(i) {
    BBtns[i].onclick = function () {
        now = i;
        tab();
    };
};

for (var i = 0; i < BBtns.length; i++) {
    _loop2(i);
}

// 鼠标移入停止
banner.onmouseover = function () {
    clearInterval(timer);
};
// 鼠标移开
banner.onmouseout = function () {
    timer = setInterval(next, 2000);
};

/**
 * 品牌特卖
 */
var SUls = document.getElementById('sale-uls');
// console.log(SUls);

function sale() {
    var data = 'page=1&qty=26';
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
        var html = '\n                <li>\n                    <p><a href="javascript:;"><img src="' + data.images + '" alt=""></a></p>\n                     <p>\n                        <span>' + data.small + '</span>\n                        <span>' + data.title + '</span>\n                    </p>\n                </li>\n    ';
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
    var data = 'page=27&qty=20';
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
        var html = '\n            <li>\n                <p>\n                    <a href="javascript:;"><img src="' + data.images + '" alt=""></a> \n                </p>\n                <p><b>' + data.discount + '\u6298/</b><a href="javascript:;">' + data.title + '</a></p>\n                <p>\n                    <span>\uFFE5' + data.now + '</span>\n                    <span>\uFFE5' + data.orig + '</span>\n                    <span id="add-carts">\u67E5\u770B\u8BE6\u60C5</span>\n                </p>\n                </li>\n        ';
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
};

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
};
// 点击回到品牌特卖
Lsale.onclick = function () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var ST = sale.offsetTop;
    window.scrollTo(0, ST);
};
// 点击回到爆款尝鲜
Lfresh.onclick = function () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var FT = fresh.offsetTop;
    window.scrollTo(0, FT);
};

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
};

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
};

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
};

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
    var slice = name.substr(3, 4);
    var showname = name.replace(slice, "****");
    // console.log(showname);
    username.innerHTML = '\n        \u55E1\uFF0C\u6B22\u8FCE\u6765\u5230\u4E50\u5CF0\uFF0C\n        <a href="#">' + showname + '</a>\n        |\n        <a href="#" id="exit">\u9000\u51FA\u767B\u5F55</a>\n    ';
    username.style.width = "280px";

    //  头部购物车显示
    $('.nohas').css('display', 'none');
    $('.has').css('display', 'block');
    var data = 'user=' + name;
    ajax('GET', 'api/cart.php', data, function (str) {
        // console.log(str);
        var arr = JSON.parse(str);
        var datalist = arr.datalist;
        var html = '';
        var count = 0;
        var totals = 0;
        for (var i = 0; i < datalist.length; i++) {
            html += '\n            <tr>\n                <td>\n                    <a href="html/goods.html?id=' + datalist[i].id + '">\n                        <img src="' + datalist[i].imageUrl + '" alt="" style="width: 53px;height: 67px;border: 1px solid #f3f3f3;">\n                    </a>\n                </td>\n                <td>\n                    <a href="html/goods.html?id=' + datalist[i].id + '">' + datalist[i].name + '</a>\n                </td>\n                <td>\n                    <b>\uFFE5' + datalist[i].unit + '</b>\xD7' + datalist[i].num + '\n                </td>\n            </tr>\n            ';
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
        go_cart.href = "html/cart.html";
    });
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
        username.innerHTML = '\n        \u6B22\u8FCE\u6765\u5230\u4E50\u5CF0\uFF0C\u8BF7\n        <a href="html/login.html">\u767B\u5F55</a>\n        |\n        <a href="html/reg.html">\u514D\u8D39\u6CE8\u518C</a>\n        ';
    }
};

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
        window.open('html/list.html?keyword=' + target.innerHTML);
    }
};

/**
 * 搜索框
 */
var search_sumbit = document.getElementById('search-sumbit');
var search_inp = document.getElementById('search-inp');

search_sumbit.onclick = function () {
    var val = search_inp.value.trim();
    // console.log(val);
    location.href = 'html/list.html?keyword=' + val;
};