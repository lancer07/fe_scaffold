define([
    'res/js/common/template',
    'res/js/common/table',
    'res/js/common/popup',
    'res/js/common/jquery-tools'
],
function(template){
    var table = $.table(".common-content-main", true);

    function changePassword(){

    }


	$(document.body).delegates({
        '#successTipsHandle' : function(){
            $.tips('i am ok',true);
        },
        '#errorTipsHandle' : function(){
            $.tips('i am not ok');
        },
        '#alertHandle' : function(){
            $.alert('操作警告','此任务由其它管理员发起,不可查看此项任务的进度详情');
        },
        '#comfirmHandle' : function(){
            $.confirm('确定删除','是否删除此条数据吗').done(function(){
                $.tips('删除成功',true)
            });
        },
        '#promptHandle' : function(){
            $.prompt({
				title:'权限模板名称',
				label:'请输入权限模板名称'
			}).done(function(name){
                alert(name)
            });
        },
        '#normalPopupHandle' : function(){
            $.popup({
                title:'修改密码',
                content:template($('#tplPassword').html()),
                confirm:{
                    text:'确认',
                    callback:function(self){
                        changePassword();
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
        }
	}).ready(function(){
        
    });
    
    return {
        changePassword : changePassword
    }

});