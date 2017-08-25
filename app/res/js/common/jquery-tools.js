//define('res/js/common/jquery-tools',function() {
    
    $.getJson = function(url, param, showLoading) {
        var def = $.Deferred();

        if (param === true) {
            showLoading = true;
            param = {};
        };

        param = param || {};
        param.t = Math.random();

        showLoading && $.loading.show();

        def.xhr = $.getJSON(url, param).done(function(res) {
            if (typeof res === 'string') {
                res = JSON.parse(res);
            };
            if (res.result) {
                if ( !res.is_login && location.href.indexOf('login') == -1 ) setTimeout(function(){top.location.reload();},1000)
                $.tips(res.reason ? res.reason : '未知错误', false);
                def.reject(res);
            } else {
                def.resolve(res);
            }
        }).fail(function() {
            def.reject({
                reason: '请求失败'
            });
        }).always(function() {
            showLoading && $.loading.hide();
        });
        return def;
    }

    $.postData = function(url, param, showLoading) {
        var def = $.Deferred();

        if (param === true) {
            showLoading = true;
            param = {};
        };

        if (typeof param == 'string') {
            //param += '&YII_CSRF_TOKEN=' + SYS_CONF.csrf_token
        } else {
            param = param || {};
            //param.YII_CSRF_TOKEN = SYS_CONF.csrf_token;
        }

        showLoading && $.loading.show();

        def.xhr = $.post(url, param).then(function(res) {
            if (typeof res == 'string') {
                res = $.parseJSON(res);
            };
            if (res.result) {
                if ( !res.is_login && location.href.indexOf('login') == -1 ) setTimeout(function(){top.location.reload();},1000)
                $.tips(res.reason?res.reason:'未知错误', false, 2500);
                def.reject(res);
            } else {
                def.resolve(res);
            }
        }).fail(function() {
            def.reject({
                reason: '请求失败'
            });
        }).always(function() {
            showLoading && $.loading.hide();
        });

        return def;
    };

    $.Class = function(prop) {    
        var cls = function() {        
            function T(args) {            
                return this.init.apply(this, args);        
            }        
            var _t = arguments.callee,
                init = _t.prototype.init;
            T.prototype = _t.prototype; 
            T.prototype.init = function() {            
                var args = arguments;          
                if (args.length === 1 && args[0] instanceof _t) {                
                    return this;             
                };   
                init && init.apply(this, args);             
                return this;        
            };            
            T.constructor = _t;            
            return new T(arguments);     
        };        
        cls.extend = $.Class.extend;
        if (typeof prop == 'function') {
            prop = prop();
        };
        prop = prop || {};
        for (var name in prop) {
            cls.prototype[name] = prop[name];
        }
        return cls;
    };
    /**
     * 类继承
     * @param  {[type]} prop [description]
     * @return {[type]}      [description]
     */
    $.Class.extend = function(prop) {
        if (typeof prop == 'function') {
            prop = prop();
        };
        var _super = this.prototype;
        // Instantiate a base Class (but only create the instance,
        // don't run the init constructor)
        var prototype = $.extend({}, _super);
        for (var name in prop) {
            if (typeof prop[name] == "function" && typeof _super[name] == "function") {
                prototype[name] = (function(name, fn) {
                    return function() {
                        var tmp = this._super;
                        this._super = _super[name];
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name, prop[name]);
            } else {
                prototype[name] = prop[name];
            }
        }
        var Class = pp.Class(prototype);
        return Class;
    };

    /**
     * [helper description]
     * @return {[type]} [description]
     */
    $.fn.helper = function(){
        'use strict';
        var me = this;
        $(me).each(function(key,val){

            $(val).on('mouseover',function(e){
                var info = $(val).attr('data-info');
                var help_tip_content = '<span class="help_tip_content">'+info.replace('\\n','<br/>')+'</span>';
                $(help_tip_content).insertAfter( document.body );
                $('.help_tip_content').css({
                    'left'          : ( e.pageX + 12 ) + 'px',
                    'top'           : ( e.pageY ) + 'px',
                    'display'       : 'none',
                    'position'      : 'absolute',
                    'color'         : '#666',
                    'border'        : '1px solid #ccc',
                    'background'    : '#fff',
                    'line-height'   : '26px',
                    'border-radius' : '5px',
                    'font-size'     : '12px',
                    'padding'       : '0 1em',
                    'white-space'   : 'nowrap'
                }).show();

            }).on('mouseout',function(){

                $('.help_tip_content').hide().remove();

            })
        })    
        

        

    }

    $.fn.delegates = function(configs) {
        el = $(this[0]);
        for (var name in configs) {
            var value = configs[name];
            if (typeof value == 'function') {
                var obj = {};
                obj.click = value;
                value = obj;
            };
            for (var type in value) {
                el.delegate(name, type, value[type]);
            }
        }
        return this;
    }

    $.getPromise = function(obj, reject) {
        if (obj && typeof obj.resolve == 'function') {
            return obj;
        };
        var defered = $.Deferred();
        setTimeout(function() {
            reject ? defered.reject(obj) : defered.resolve(obj);
        }, 0);
        return defered;
    }

    $.queryUrl = function(url, key) {
        url = url || "";
        url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //去除网址与hash信息
        var json = {};
        //考虑到key中可能有特殊符号如“[].”等，而[]却有是否被编码的可能，所以，牺牲效率以求严谨，就算传了key参数，也是全部解析url。
        url.replace(/(^|&)([^&=]+)=([^&]*)/g, function(a, b, key, value) {
            //对url这样不可信的内容进行decode，可能会抛异常，try一下；另外为了得到最合适的结果，这里要分别try
            try {
                key = decodeURIComponent(key);
            } catch (e) {}

            try {
                value = decodeURIComponent(value);
            } catch (e) {}

            if (!(key in json)) {
                json[key] = /\[\]$/.test(key) ? [value] : value; //如果参数名以[]结尾，则当作数组
            } else if (json[key] instanceof Array) {
                json[key].push(value);
            } else {
                json[key] = [json[key], value];
            }
        });
        return key ? json[key] : json;
    }

    $.encodeURIJson = function(json) {
        var s = [];
        for (var p in json) {
            if (json[p] == null) continue;
            if (json[p] instanceof Array) {
                for (var i = 0; i < json[p].length; i++) s.push(encodeURIComponent(p) + '=' + encodeURIComponent(json[p][i]));
            } else {
                s.push((p) + '=' + encodeURIComponent(json[p]).replace(/\(/g, '%28').replace(/\)/g, '%29'));
            }
        }
        return s.join('&');
    }

    $.encode4Html = function(s) {
         var str = (s === null || s === undefined) ? "" : s;
         var el = document.createElement('pre');
         var text = document.createTextNode(str);
         el.appendChild(text);
         //return s;
         return el.innerHTML.replace(/\"/g, '&#34;').replace(/\'/g, '&#39;');
     }

    /**
     * 修改URL的hash
     * @param  {[type]} json [description]
     * @return {[type]}      [description]
     */
    $.changeHash = function(json) {
        var hash = (location.hash || "#").substr(1);
        var obj = $.queryUrl(hash);
        if (!json) {
            return obj;
        };
        json = json || {};
        obj = $.extend(obj, json);
        for (var name in obj) {
            if (obj[name] === null) {
                delete obj[name];
            };
        }
        var hash = $.encodeURIJson(obj);
        location.hash = hash;
        return obj;
    };
    /**
     * 初始化页面里的hash，自动将hash上的值定位到页面的输入框里
     * 页面的HTML添加data-name的自定义属性，值为hash的key
     * @return {[type]} [description]
     */
    $.initHash = function() {
        var hash = (location.hash || "#").substr(1);
        var obj = $.queryUrl(hash);
        for (var name in obj) {
            var value = obj[name];
            var selector = '[data-name="' + name + '"]';
            if (!$.isArray(value)) {
                value = [value];
            };
            $(selector).each(function(i) {
                var tag = this.tagName.toLowerCase();
                var tagList = ["input", "select", "textarea"];
                if ($.inArray(tag, tagList) === -1) {
                    return false;
                }
                var val = value.shift();
                if (val === undefined) {
                    return false;
                };
                if (tag == 'input' && this.type == 'checkbox') {
                    if (val == this.value) {
                        this.checked = true;
                        return true;
                    };
                };
                this.value = val;
            })
        }
    };
    // 加上IE8缺失的indexOf方法
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt /*, from*/ ) {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }

    // 通过date类获取YYYY-MM-DD形式的日期字符串
    Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm   = (this.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd   = this.getDate().toString();
        return yyyy + '-' +
                (mm[1] ? mm : "0" + mm[0]) + '-' +
                (dd[1] ? dd : "0" + dd[0]);
    };

    $.goto = function(key){
		window.location.href = ROUTERS[key]['url'];
	}

//});