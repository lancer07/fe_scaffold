define([
    'res/js/common/template',
    'res/js/common/jquery-tools'
],
function(template){
	$(document.body).delegates({
        '#btn' : function(){
            var tplAutoApproval = template($('#tplAutoApproval').html(),{
                id : '1',
                name : 'lara',
                list : [
                    {
                        id : 1,
                        age : 10
                    },
                    {
                        id : 2,
                        age : 20
                    },
                    {
                        id : 3,
                        age : 30
                    },
                    {
                        id : 4,
                        age : 30
                    }
                ]
            });
            $("#message").html(tplAutoApproval);
        },
        '#logout' : function(){
            location.href = "/pages/login";
            sessionStorage.setItem("login", false); 
        }
	}).ready(function(){
        
	});
});