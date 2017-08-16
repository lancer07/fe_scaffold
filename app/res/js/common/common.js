require([
	//'res/js/common/au_modules',
	'res/js/common/template',
	'res/js/common/jquery-tools',
	'res/js/common/jquery-tooltip',
	'vendor/jquery.cookie/cookie',
	'vendor/jquery-ui/jquery-ui',
	'res/js/common/task',
	'res/js/common/switch',
	// 'res/js/common/nav',
	'res/js/common/popup',
	'res/js/common/dropdown',
	'res/js/common/tree',
	'res/js/common/tab',
	'res/js/common/pager',
	'res/js/common/table',
	'res/js/common/search',
	//'res/js/common/changepassword',
	//'res/js/common/importqsert',
	'res/js/common/date',
	'res/js/common/ipfilter',
	'res/js/common/iprange',
	//'res/js/common/upgrade_main',
	'res/js/common/accordion',
	'res/js/common/group-dropdown',
	//'js/sys_config_default/sys_default_config'
], function(template){
	$(document).ajaxError(function( event, jqxhr, settings, thrownError ) {
		if ( /notice-pull/.test(settings.url) ) return; // 如果是消息轮询超时错误，则忽略
		if ( jqxhr.status == 0 ) return; // 如果是因为消息来不及发送产生的错误，则忽略
		$.tips('接口错误！错误码：'+jqxhr.status, false);
		console && console.log(jqxhr.responseText);
	});
});