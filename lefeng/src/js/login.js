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