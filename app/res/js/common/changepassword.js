define('js/common/changepassword',['js/common/rsa-encrypt', 'js/login/qualify', 'js/common/jquery-tools'],function(rsaEncrypt, qualify){
	var changepassword ={
		interval:null,
		init:function(){
			if($('#change-password-button').length == 0){
				return;
			}
			var self = this;
			$(document.body).delegates({
				'#change-password-button':function(){
					$.popup({
						title:'修改密码',
						content:$.tpl($('#change-password-tpl').html()),
						confirm:{
							text:'确认',
							callback:function(self){

								var userId = $('#userId').val();
			                    var user = $('#userName');
			                    var oldPwd = $('#userOldPwd');
			                    var pwd = $.trim($('#userNewPwd').val());
			                    var newPwd = $.trim($('#userNewConfirmPwd').val());

			                    if (!user.val()) {
			                        return user.focus();
			                    };

			                    if (!oldPwd.val()) {
			                        return oldPwd.focus();
			                    };
			                    var pwd = $.trim($('#userNewPwd').val());
			                    var valid = qualify.checkPsw(pwd);
			                    if (!valid.result) {
			                        $.tips(valid.msg);
			                        return $('#userNewPwd').focus();
			                    };

			                    if (pwd !== newPwd) {
			                        $.tips("两次密码不一致");
			                        return $('#userNewConfirmPwd').focus();
			                    };


			                    $.postData("/setting/account/edit", {
			                        id: userId,
			                        name: user.val(),
			                        old_pass: rsaEncrypt(oldPwd.val()),
			                        pass: rsaEncrypt(pwd),
			                        confirm_pass: rsaEncrypt(newPwd)
			                    }).then(function(){
			                        $.tips({time:1500,text:'修改成功！',success:true,callback:function(){
			                        	self.close();
			                        	location.reload();
			                        }})
			                    }).fail(function(data){
			                        if (data.result === 10014) {
			                            return$('#userOldPwd').focus();
			                        };
			                    })

								self.close();
							}
						},
						cancel:{
							text:'取消',
							callback:function(self){
								self.close();
							}
						},
						closeTrigger:'cancel'
					});
					// $.postData('/host/terminal/returnCMS', {}).then(function(data) {
					// 	window.location.href=data.data;
					// })
				}
			})
		}
	};
	changepassword.init();

	return changepassword;
})

