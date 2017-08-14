define([
	'/res/js/common/jquery-tools'
],
function(template){
	$(document.body).delegates({
        'nav li' : function(){
            $(this).addClass('cur').siblings().removeClass('cur');
        }
	}).ready(function(){
		$("nav li").removeClass('cur').last().addClass('cur');
	});
});