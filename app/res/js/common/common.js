require([
	//'js/common/au_modules',
	'js/common/template',
	'js/common/jquery-tools',
	'js/common/jquery-tooltip',
	'module/jquery.cookie/cookie',
	'module/jquery-ui/jquery-ui',
	'js/common/task',
	'js/common/switch',
	// 'js/common/nav',
	'js/common/popup',
	'js/common/dropdown',
	'js/common/tree',
	'js/common/tab',
	'js/common/pager',
	'js/common/table',
	'js/common/search',
	//'js/common/changepassword',
	//'js/common/importqsert',
	'js/common/date',
	'js/common/ipfilter',
	'js/common/iprange',
	//'js/common/upgrade_main',
	'js/common/accordion',
	'js/common/group-dropdown',
	//'js/sys_config_default/sys_default_config'
], function(template){
	$(document).ajaxError(function( event, jqxhr, settings, thrownError ) {
		if ( /notice-pull/.test(settings.url) ) return; // 如果是消息轮询超时错误，则忽略
		if ( jqxhr.status == 0 ) return; // 如果是因为消息来不及发送产生的错误，则忽略
		$.tips('接口错误！错误码：'+jqxhr.status, false);
		console && console.log(jqxhr.responseText);
	});
});