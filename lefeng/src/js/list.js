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