define(['vendor/jquery-ui/jquery-ui'], function(){
    //启用Jquery UI 的tool-tips
	var escapeDOM = document.createElement("textarea");

    var defaultConfig = {
        track: true,
        show: false, // disable animation
        hide: false, // disable animation
        content:function(){
            var $me = $(this);
            var filePathReg = /^[a-z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}\[\]\u4e00-\u9fa5]+)+/i;
            var title = $me.attr('title');
            escapeDOM.textContent = title; // XSS过滤
            // 文件路径不做换行符替换
            return filePathReg.test(title) ? escapeDOM.innerHTML : escapeDOM.innerHTML.replace(/\\n/g, '<br/>');
        }
    };

    $.fn.jqTooltip = function(config){
        var conf = $.extend(true, {}, defaultConfig, config);
        return $(this).tooltip(conf);
    } 

})