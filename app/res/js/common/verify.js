(function(fn) {
    if (window.define) { // require
        define(["module/validator/validator.min"], fn);
    } else { // 直接引用
        window.verify = fn();
    }
})(function(validator){
    /**
     * 表单验证
     * @param  {$DOM}     container 表单的容器
     * @param  {function} func      验证失败后的回调，需要两个参数，第一个为错误信息，第二个为出错的表单控件
     * @param  {boolean}  traverse  是否对所有失败调用回调函数，true全部调用，false只对第一个错误调用回调函数，后续不再执行
     * @return {boolean}            是否验证通过
     */
    return function(container, func, traverse) {
        var container = $(container); // 外部界限
        var func      = func || function() {}; // 回调函数
        var traverse  = traverse || false;
        var keepGoing = true;
        var pass      = true;

        var REG_IPADDR = /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;
        var REG_EMAIL  = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
        var REG_MOBILE = /^1[0-9]{10}$/;
        var REG_TEL    = /^[^-][0-9-]{4,}[^-]$/;
        var REG_DOMAIN = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
        var REG_URL    = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        var REG_DNS    = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;


        // var required = container.find('input[verify=required]'); // 不能为空
        // var integer  = container.find('input[verify=int]');      // 整数
        // var floating = container.find('input[verify=float]');    // 浮点数
        // var ip       = container.find('input[verify=ip]');       // IP地址(四个输入框的)
        // var ipaddr   = container.find('input[verify=ipaddr]');   // IP地址(检查一个字符串是否为IP的格式)
        // var srvaddr   = container.find('input[verify=ipaddr]');  // 检查服务器地址是否为IP或域名
        // var phone    = container.find('input[verify=phone]');    // 手机号
        // var email    = container.find('input[verify=email]');    // 邮箱
        // var string   = container.find('input[verify=string]');   // 字符串

        // 是否为空验证
        keepGoing && container.find('input[verify=required]').each(function(index, el) {
            var tabName = el.tagName.toUpperCase();

            if (!getPre(el)) return true; // 前置条件不成立，直接返回

            if (tabName === 'INPUT') {
                if (!testRequire(el)) {
                    pass = false;
                    return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
                }
            }
        });

        // 是否是整数验证（带上下限）
        keepGoing && container.find('input[verify=int]').each(function(index, el) {

            var tabName = el.tagName.toUpperCase();
            var type    = el.type.toUpperCase();
            if (!getPre(el)) return true; // 前置条件不成立，直接返回
            if (tabName === 'INPUT' && (type === 'TEXT' || type === 'NUMBER')) {
                if (getOptional(el)) { // 可不填写
                    if ($.trim(el.value) === '') {
                        return keepGoing = true; // 如果不需要遍历，则返回
                    } else {
                        if (!testInteger(el)) {
                            pass = false;
                            return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
                        }
                    }
                } else { // 必须填写
                    if (!testRequire(el)) {
                        pass = false;
                        return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
                    } else {
                        if (!testInteger(el)) {
                            pass = false;
                            return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
                        }
                    }

                }
            }
        });

        // 是否是浮点数验证（带上下限）
        keepGoing && container.find('input[verify=float]').each(function(index, el) {
            var tabName = el.tagName.toUpperCase();
            var type    = el.type.toUpperCase();

            if (!getPre(el)) return true; // 前置条件不成立，直接返回

            if (tabName === 'INPUT' && type === 'TEXT') {
                if (getOptional(el)) { // 可不填写
                    if ($.trim(el.value) === '') {
                        return keepGoing = true; // 如果不需要遍历，则返回
                    } else {
                        if (!testFloat(el)) {
                            pass = false;
                            return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
                        }
                    }
                } else { // 必须填写
                    if (!testRequire(el)) {
                        pass = false;
                        return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
                    } else {
                        if (!testFloat(el)) {
                            pass = false;
                            return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
                        }
                    }
                }
            }
        });

        // 是否是IP地址
        keepGoing && container.find('.ipfilter[verify=ip]').each(function(index, el) {
            if (!getPre(el)) return true; // 前置条件不成立，直接返回

            if (!testIp(el)) {
                pass = false;
                return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
            }
        });

        // 是否是IP地址2
        keepGoing && container.find('input[verify=ipaddr]').each(function(index, el) {
            if (!getPre(el)) return true; // 前置条件不成立，直接返回

            if ($.trim(el.value) === "" && getOptional(el)) {  return keepGoing = true;}//增加ip也允许为空，则返回
  
            if (!testIpaddr(el)) {
                pass = false;
                return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
            }
        });
        
        // 是否是IP地址2或域名
        keepGoing && container.find('input[verify=srvaddr]').each(function(index, el) {
            if (!getPre(el)) return true; // 前置条件不成立，直接返回

            if (!testSrvAddr(el)) {

                pass = false;
                return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
            }
        });

        // 按字符串方式校验格式
        // 支持的校验配置
        // verify-required='true/false' 是否为空，默认：true
        // verify-min='5'               最小长度，默认：0
        // verify-max='20'              最大长度，默认：0
        // verify-chinese='true/fase'   是否将汉字、全角字符作为两个字节计算长度（未实现）
        // verify-compare='比较项#id'    对比两个输入框的内容是否一致。一般用于用户确认密码的校验
        keepGoing && container.find('input[verify=string], textarea[verify=string]').each(function(index, el) {
            var tagName = el.tagName.toUpperCase(),
                $self = $(el);

            if (!getPre(el)) return true; // 前置条件不成立，直接返回

            if (!testRequire(el)) {
                pass = false;
                return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
            }

            var compareId = $self.attr("verify-compare");
            if(compareId && "" != $.trim(compareId)){
                if (!testRequire($("#"+compareId)[0])) {
                    pass = false;
                    return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
                }
            }

            if (!testString(el)) {
                pass = false;
                return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
            }
        });

        // Email 格式校验
        keepGoing && container.find('input[verify=email]').each(function(index, el) {
            var tagName = el.tagName.toUpperCase(),
                $self = $(el);

            if (!getPre(el)) return true; // 前置条件不成立，直接返回

            if (!testRequire(el)) {
                pass = false;
                return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
            }

            if (!testEmail(el)) {
                pass = false;
                return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
            }
        });

        // 电话格式校验
        keepGoing && container.find('input[verify=phone]').each(function(index, el) {
            var tagName = el.tagName.toUpperCase(),
                $self = $(el);

            if (!getPre(el)) return true; // 前置条件不成立，直接返回

            if (!testRequire(el)) {
                pass = false;
                return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
            }

            if (!testPhone(el)) {
                pass = false;
                return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
            }
        });

        // URL校验
        keepGoing && container.find('input[verify=url]').each(function(index, el) {
            var tagName = el.tagName.toUpperCase(),
                $self = $(el);

            if (!getPre(el)) return true; // 前置条件不成立，直接返回

            if (!testRequire(el)) {
                pass = false;
                return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
            }

            if (!testUrl(el)) {
                pass = false;
                return keepGoing = traverse ? true : false; // 如果不需要遍历，则返回
            }
        });

        return pass;


        function testRequire(el) {
            if ($.trim(el.value) === "" && !getOptional(el)) {
                $(el).trigger('focus');
                var label = getLabel(el);
                func(label + ' 不能为空', el);
                return false;
            }
            return true;
        }

        function testInteger(el) {
            var isInt = /^[1-9]\d*$/.test(el.value) || el.value === '0';
            if (!isInt) {
                $(el).trigger('focus');
                var label = getLabel(el);
                func(label + ' 必须是一个整数', el);
                return false;
            } else {
                var res = parseInt(el.value);
                var max = parseInt($(el).attr('verify-max') || '');
                var min = parseInt($(el).attr('verify-min') || '');

                if (parseInt(max).toString() !== 'NaN' && res > parseInt(max)) {
                    $(el).trigger('focus');
                    var label = getLabel(el);
                    func(label + ' 不能大于' + max, el);
                    return false;
                }
                if (parseInt(min).toString() !== 'NaN' && res < parseInt(min)) {
                    $(el).trigger('focus');
                    var label = getLabel(el);
                    func(label + ' 不能小于' + min, el);
                    return false;
                }
            }
            el.value = res;
            return true;
        }

        function testFloat(el) {
            var res = parseFloat(el.value);
            if (res.toString() === "NaN") {
                var label = getLabel(el);
                func(label + ' 必须是一个浮点数', el);
                return false;
            } else {
                var max = parseFloat($(el).attr('verify-max') || '');
                var min = parseFloat($(el).attr('verify-min') || '');

                if (parseFloat(max).toString() !== 'NaN' && res > parseFloat(max)) {
                    var label = getLabel(el);
                    func(label + ' 不能大于' + max, el);
                    return false;
                }
                if (parseFloat(min).toString() !== 'NaN' && res < parseFloat(min)) {
                    var label = getLabel(el);
                    func(label + ' 不能小于' + min, el);
                    return false;
                }
            }
            el.value = res;
            return true;
        }

        function testIp(el) {
            var res = getIp(el);

            if (res === "") {
                $(el).trigger('focus');
                var label = getLabel(el);
                func(label + ' 不是一个正确的IP地址', el);
                return false;
            }
            return true;
        }

        function testIpaddr(el) {
            if (el.tagName.toUpperCase() !== 'INPUT' && el.type.toUpperCase() !== 'TEXT') {
                return false;
            }
            var ip = $.trim(el.value);

            el.value = ip;
            if (REG_IPADDR.test(ip)) {
                return true;
            } else {
                $(el).trigger('focus');
                func(getLabel(el) + ' 不是一个正确的IP地址', el);
                return false;
            }
        }

        function testSrvAddr(el) {
            if (el.tagName.toUpperCase() !== 'INPUT' && el.type.toUpperCase() !== 'TEXT') {
                return false;
            }
            var value = $.trim(el.value);

            el.value = value;
            if (REG_DOMAIN.test(value) || REG_IPADDR.test(value)) {
                return true;
            } else {
                $(el).trigger('focus');
                func(getLabel(el) + ' 不是一个正确的地址', el);
                return false;
            }
        }

        function testPhone(el){
            var $self = $(el),
                value = $.trim($self.val());

            if (value === "" || REG_TEL.test(value) || REG_MOBILE.test(value)) {
                return true;
            } else {
                $self.trigger('focus');
                func(getLabel(el) + ' 不是一个正确的电话格式', el);
                return false;
            }
        }

        function testUrl(el){
            var $self = $(el),
                value = $.trim($self.val());

            if (value === "" || validator.isURL(value) || REG_IPADDR.test(value)) {
                return true;
            } else {
                $self.trigger('focus');
                func(getLabel(el) + ' 不是一个正确的地址', el);
                return false;
            }
        }

        function testEmail(el){
            var $self = $(el),
                value = $.trim($self.val());

            if (value === "" || REG_EMAIL.test(value)) {
                return true;
            } else {
                $self.trigger('focus');
                func(getLabel(el) + ' 不是一个正确的Email地址', el);
                return false;
            }
        }

        function testString(el){
            var $self = $(el),
                value = $.trim($self.val()),
                strLength = value.length,
                optional = getOptional(el),
                compareId = $self.attr("verify-compare"),
                min = getMin(el),
                max = getMax(el);

            if(min !== 0 && min > strLength){
                $self.trigger('focus');
                var label = getLabel(el);
                func(label + ' 长度不能少于' + min +"个字符", el);
                return false;
            }

            if(max !== 0 && max < strLength){
                $self.trigger('focus');
                var label = getLabel(el);
                func(label + ' 长度不能大于' + max +"个字符", el);
                return false;
            }

            if(compareId && "" != $.trim(compareId)){
                var $compareInput = $("#"+compareId);
                if(value != $.trim($compareInput.val())){
                    $self.trigger('focus');
                    var label = getLabel(el);
                    func(label + " 两次输入不一致", el);
                    return false;
                }
            }

            return true;
        }


        // 获取IP
        function getIp(wrap) {
            var wrap = $(wrap);
            var ip   = [];

            wrap.find('input.ip').each(function(index, el) {
                var value = $(this).val();
                var num = parseInt(value);

                if (num.toString() === 'NaN' ||
                    num > 255 || num < 0) {
                    ip = [];
                    return false;
                } else {
                    ip.push(num);
                }
            });

            return ip.join('.');
        }

        // 获取表单的前置条件（checkbox）,只有在前置条件成立的情况下才会检查表单项的合法性
        function getPre(el) {
            var self   = $(el);
            var pre    = self.attr('verify-pre');
            var preVal = self.attr('verify-pre-val'); // 不配置的话，直接判断是否true，否则判断值是否相符
            var preElm = $('#'+pre);

            if (!pre) {
                return true; // 没有配置前置条件，直接返回true
            }
            if (preElm.length <= 0) { // 配置了前置条件但没有找到对应元素,抛出错误
                throw "can't find the precondition element.";
                return true;
            }
            if (!preVal) { // 没有配置条件值的情况
                if (preElm.prop('type') == 'checkbox' || preElm.prop('type') == 'radio') { // 单选或复选框
                    return preElm.prop('checked') ? true : false;
                } else if (preElm.hasClass('switch')) { // 自定义的switch组件
                    return preElm.hasClass('fa-toggle-on') ? true : false;
                } else { // 其他
                    return preElm.val() == preVal ? true : false;
                }
            } else { // 配置了条件值的情况
                return (preElm.val() == preVal) ? true : false;
            }
        }

        // 获取表单是否可选择不填
        function getOptional(el) {
            var self = $(el);
            var optional = self.attr('verify-optional');

            if ( self.attr('data-withlock') != 1 && self.prop('disabled') ) return true;   //判断当前diabled是否为true，若disabled为true，则可以不填

            if(optional === undefined){
                return false;
            } else {
                if($.trim(optional) === ""){
                    return true;
                } else {
                    return false;
                }
            }
        }

        /**
         * 获取验证数据的最小值
         * @param  {element} el 需要验证的节点对象
         * @return {int}    返回一个正整数
         */
        function getMin(el){
            var $self = $(el),
                min = $self.attr("verify-min");

            if($.isNumeric(min)){
                var intMin = parseInt(min);
                return intMin < 0 ? 0 : intMin;
            } else {
                return 0;
            }
        }

        /**
         * 获取验证数据的最大值
         * @param  {element} el 需要验证的节点对象
         * @return {int}    返回一个正整数
         */
        function getMax(el){
            var $self = $(el),
                max = $self.attr("verify-max");

            if($.isNumeric(max)){
                var intMax = parseInt(max);
                return intMax < 0 ? 0 : intMax;
            } else {
                return 0;
            }
        }

        // 获得input的标签文字（不带末尾的冒号）
        function getLabel(el) {
            var self  = $(el);
            var id    = self.attr('id');
            var label = self.siblings('label[for='+id+']').first();

            return $(el).attr('verify-label') || label.text().replace(/[:|：]$/, ''); // 去掉尾部的冒号
        }
    }
});
