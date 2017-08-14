define([
	'res/js/common/jquery-tools'
],
function(){
	$(document.body).delegates({
        'nav li' : function(){
		$(this).addClass('active').siblings().removeClass('active');
		var nav = $(this).text();
		$.changeHash({
			nav : nav
		});
        }
	}).ready(function(){
		$("nav li").last().click();
	});
});