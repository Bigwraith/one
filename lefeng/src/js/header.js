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

