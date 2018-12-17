'use strict';

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
            var data = 'user=' + val;
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
};

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
};

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
};

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
};

// 注册
var reg_btns = document.getElementById('reg_btns');
reg_btns.onclick = function () {
    val1 = user.value.trim();
    val2 = psw.value.trim();
    if (isok1 && isok2 && isok3 && isok4) {
        var data = 'user=' + val1 + '&psw=' + val2;
        ajax('POST', '../api/reg.php', data, function (str) {
            // console.log(str);
            if (str) {
                location.href = 'login.html';
            }
        });
    }
};