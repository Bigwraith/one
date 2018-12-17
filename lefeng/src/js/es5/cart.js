'use strict';

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
    var slice = name.substr(3, 4);
    var showname = name.replace(slice, "****");
    // console.log(showname);
    username.innerHTML = '\n        \u55E1\uFF0C\u6B22\u8FCE\u6765\u5230\u4E50\u5CF0\uFF0C\n        <a href="#">' + showname + '</a>\n        |\n        <a href="#" id="exit">\u9000\u51FA\u767B\u5F55</a>\n    ';
    username.style.width = "280px";

    // 购物车列表
    var data = 'user=' + name;
    ajax('GET', '../api/cart.php', data, function (str) {
        // console.log(str);
        var arr = JSON.parse(str);
        var data = arr.datalist;
        // console.log(data);
        var html = '';
        for (var i = 0; i < data.length; i++) {
            var pirce = data[i].unit * data[i].num;
            html += '\n            <tr>\n            <td class="t01">\n                <div class="photo">\n                    <a href="../html/goods?id=' + data[i].id + '"><img src="../' + data[i].imageUrl + '" alt="" style="width: 58px;height: 74px;"></a>\n                    <img src="../' + data[i].imageUrl + '" class = "smallimg" >\n                </div>\n                <div class="tiptitle">\n                    <p class="name"><a href="../html/goods?id=' + data[i].id + '">' + data[i].name + '</a></p>\n                    <p class="size">\u89C4\u683C\uFF1A' + data[i].size + '</p>\n                </div>\n            </td>\n            <td class="t02">\n                <p class="now_price">\uFFE5' + data[i].unit + '</p>\n                <p class="old_price">\uFFE5' + data[i].orig + '</p>\n            </td>\n            <td class="t03">\n                <div class="quantity">\n                    <span class="plus" id="' + data[i].id + '" >-</span>\n                    <textarea name="" id="' + data[i].id + '">' + data[i].num + '</textarea>\n                    <span class="sub" id="' + data[i].id + '" >+</span>\n                </div>\n            </td>\n            <td class="t04">\n                \uFFE5<b>' + pirce + '</b> \n            </td>\n            <td class="t05">\n                <a href="#" class="del" id="' + data[i].id + '">\u5220\u9664</a>\n            </td>\n        </tr>\n\n            ';
        }
        tbody.innerHTML = html;
        show();
    });
}

function show() {
    // console.log(tbody.children);
    var trs = tbody.children;
    var total = 0;
    var counts = 0;
    for (var i = 0; i < trs.length; i++) {
        //    console.log(trs[i].children[3].children[0].innerHTML)
        // 总金额
        var toprice = trs[i].children[3].children[0].innerHTML;
        total += Number(toprice);

        //  console.log(trs[i].children[2].children[0].children[1].value) ;
        // 总数量
        var counts01 = trs[i].children[2].children[0].children[1].value;
        counts += Number(counts01);

        // 照片放大
        //console.log(trs[i].children[0].children[0].children[0])
        $(trs[i].children[0].children[0].children[0]).mousemove(function () {
            // console.log(this.nextElementSibling)
            $(this.nextElementSibling).css('display', 'block');
        });
        $(trs[i].children[0].children[0].children[0]).mouseleave(function () {
            // console.log(this.nextElementSibling)
            $(this.nextElementSibling).css('display', 'none');
        });
    }
    // console.log(counts);
    // console.log(total);

    if (total > 99) {
        yun.style.background = "#f3b241";
        bao.innerHTML = "本单已免运费";
        yuncost.style.display = "none";
        count.innerHTML = counts;
        u_total01.innerHTML = total;
        u_total02.innerHTML = total;
    } else {
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
        username.innerHTML = '\n        \u6B22\u8FCE\u6765\u5230\u4E50\u5CF0\uFF0C\u8BF7\n        <a href="login.html">\u767B\u5F55</a>\n        |\n        <a href="reg.html">\u514D\u8D39\u6CE8\u518C</a>\n        ';
    }
};

tbody.onclick = function (e) {
    var e = e || window.e;
    var target = e.target || e.srcElement;
    console.log(target);
    var user = Cookie.get('user');

    // 数量框数量变化
    if (target.tagName.toLowerCase() == 'textarea') {
        // console.log(target.value);
        var id = target.id;
        target.onkeyup = function () {
            clearTimeout(timer);
            var timer = setTimeout(function () {
                var val = target.value;
                // console.log(target.value);
                var data = 'id=' + id + '&num=' + val + '&user=' + user;
                ajax('GET', '../api/updatecart.php', data, function (str) {
                    // console.log(str);

                });
            }, 1000);
            var unit = target.parentNode.parentNode.previousElementSibling.children[0].innerHTML.split("￥")[1];
            // console.log(unit);
            var price = unit * num;
            var prices = target.parentNode.parentNode.nextElementSibling.children[0];
            prices.innerHTML = price;
            show();
        };
    }

    // 数量减少
    if (target.className == 'plus') {
        var num = target.nextElementSibling.value.trim();
        var id = target.id;
        // console.log(num);
        if (num <= 1) {
            num = 1;
        }
        if (num > 1) {
            num--;
            var data = 'id=' + id + '&num=' + num + '&user=' + user;
            ajax('GET', '../api/updatecart.php', data, function (str) {
                // console.log(str);

            });
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
    if (target.className == 'sub') {
        var num = target.previousElementSibling.value.trim();
        // console.log(num);
        var id = target.id;
        if (num >= 1) {
            num++;
            var data = 'id=' + id + '&num=' + num + '&user=' + user;
            ajax('GET', '../api/updatecart.php', data, function (str) {
                // console.log(str);

            });
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
    if (target.className == 'del') {
        var id = target.id;
        confirm("您确定要删除嘛？？？");
        if (confirm) {
            var data = 'id=' + id + '&user=' + user;
            ajax('GET', '../api/delcart.php', data, function (str) {
                // console.log(str);
                location.reload();
            });
        }
        show();
    }
};

// 卡券
$('.kaq').click(function () {
    $('.cart_kaquan02').toggle();
    $(this).find("i").toggleClass('ico-jj');
});