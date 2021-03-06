define([
    'res/js/common/verify',
    'res/js/common/popup',
    'res/vendor/md5/md5',
    'res/js/common/jquery-tools'
],
function(verify,popup,md5){
	$(document.body).delegates({
        '#login-btn' : function(){
            var check = verify($('.login-box'), function(tip, el) {
                $.tips(tip, false, 4000);
            });
            if(check){
                $.postData('/api/login',{
                    username : $('#username').val(),
                    psw : md5.hex_md5($("#userpsw").val())
                }).then(function(res) {
                    if(res.result == 0){
                        $.goto('home')
                        sessionStorage.setItem("login",'true');
                        sessionStorage.setItem("csrf_token", res.csrf_token); 
                    }
                });
                // if(localStorage.getItem($('#username').val()) == md5.hex_md5($("#userpsw").val()) ){
                //     $.goto("home");
                //     sessionStorage.setItem("login", true); 
                // }else{
                //     $.tips('用户名或密码错误');
                // }
            }
        },
        '#register-btn' : function(){
            $.goto("register");
        }
	}).ready(function(){
        
    });
});