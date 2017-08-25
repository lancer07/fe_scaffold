require([
	
], function(){

	$(document).ajaxError(function( event, jqxhr, settings, thrownError ) {
		if ( jqxhr.status == 0 ) return; // 如果是因为消息来不及发送产生的错误，则忽略
		$.tips('接口错误！错误码：'+jqxhr.status, false);
		console && console.log(jqxhr.responseText);
	}).delegates({
		'[data-url-key]' : function(){
			var key = $(this).attr('data-url-key');
			$.goto(key);
		}
	});;
});