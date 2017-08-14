var about = function(){
	var tpl = template($('#about-tpl').html());
	var data = {};
	$('#app').html(tpl(data));
	alert(1)
}

var home = function(){
	var tpl = template($('#home-tpl').html());
	var data = {};
	$('#app').html(tpl(data));
	alert(2)
}


var routes = {
	'/home' : home,
    '/about': about
}

var router = Router(routes);
router.init();