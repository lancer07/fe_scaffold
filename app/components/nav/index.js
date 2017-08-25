define([
],function(){
	$(document.body).delegates({
        'nav li' : function(){
			$(this).addClass('active').siblings().removeClass('active');
			var nav = $(this).text();
        }
	}).ready(function(){
		
		
	});
});


