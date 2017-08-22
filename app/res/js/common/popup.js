define('res/js/common/popup', ['res/js/common/jquery-tools'], function() {
	$.popup = $.Class(function() {
        var isIE8 = !!window.ActiveXObject && document.documentMode;
		return {
			init: function(config) {
				this.config = config;
				this.config.is_reload = this.config.is_reload || false;
				this.modal();
				if (config.content) {
					this.initInline();
				} else if (config.url) {
					this.initIframe();
				}
                // 隐藏外层的滚动条，不然弹窗的滚动条跟外层的就叠在一起了
                $('.skylar-main-area').css('overflow', 'hidden');
				if (config.popupDone) config.popupDone(this);
			},
			initIframe: function() {
				var self = this;
                var sizeCss = {
					width: this.config.width || '800px',
					height: this.config.height || '650px',
                    // 用flexbox后无需进行负margin
					// 'marginLeft': -(this.config.width || '800') / 2,
					// 'marginTop': -(this.config.height || '650') / 2
				};
				var frame = $('<iframe id="iframeBox" border=0 frameborder="no" scrolling="no" class="iframe-box" src=' + this.config.url + ' />').css(sizeCss);
                var wrapper = $('<div class="popup-content"></div>').css(sizeCss);

                var onLoad = function() {
                    self.doc = $(frame[0].contentWindow.window.document);
                    if (self.config.confirm) {
                        if (self.doc.find('.popup-footer').length !== 0) {
                            self.doc.find('.popup-footer').append('<a href="javascript:;" class="popup-footer-confirm">' + (self.config.confirm.text || '确认') + '</a>').find('.popup-footer-confirm').on('click', function(event) {
                                self.config.confirm.callback(self, event);
                            })
                        } else {
                            $('<div class="popup-footer"></div>').append('<a href="javascript:;" class="popup-footer-confirm">' + (self.config.confirm.text || '确认') + '</a>').insertAfter(self.doc.find('.popup-body')).find('.popup-footer-confirm').on('click', function(event) {
                                self.config.confirm.callback(self, event);
                            });
                        }
                    }
                    if (self.config.cancel) {
                        if (self.doc.find('.popup-footer').length !== 0) {
                            self.doc.find('.popup-footer').append('<a href="javascript:;" class="popup-footer-cancel">' + (self.config.cancel.text || '取消') + '</a>').find('.popup-footer-cancel').on('click', function(event) {
                                self.config.cancel.callback(self, event);
                            })
                        } else {
                            $('<div class="popup-footer"></div>').append('<a href="javascript:;" class="popup-footer-cancel">' + (self.config.cancel.text || '取消') + '</a>').insertAfter(self.doc.find('.popup-body')).find('.popup-footer-cancel').on('click', function(event) {
                                self.config.cancel.callback(self, event);
                            });
                        }
                    }

                    if (self.config.closeTrigger == 'cancel') {
                        self.doc.find('.popup-close').on('click', function(event) {
                            if (self.config.cancel) {
                                self.config.cancel.callback(self, event);
                            } else {
                                self.destroy();
                            }
                        });
                    } else if (self.config.closeTrigger == 'confirm') {
                        if (self.config.confirm) {
                            self.doc.find('.popup-close').on('click', function(event) {
                                self.config.confirm.callback(self, event);
                            });
                        } else {
                            self.destroy();
                        }
                    } else {
                        self.doc.find('.popup-close').on('click', function(event) {
                            $(window.parent.document.body).css('overflow','auto')
                            self.destroy();
                        });
                    }
                }
                // 没必要js设定高度，绝对定位后，上下左右都为0即可铺满document
                // this.config.overlay_height = isIE8 ? $(document).height()-4 : $(document).height()
                // this.config.content = $('<div class="popup-iframe"></div>').css('height',this.config.overlay_height);
                var className = this.config.className ? 'popup '+this.config.className : 'popup';
                this.config.content = $('<div class="' + className + '"></div>');
				this.config.content.append(wrapper);
                wrapper.append(frame);

                if (frame[0].attachEvent) { // for IE8
                    frame[0].attachEvent('onload', onLoad);
                } else {
                    frame[0].onload = onLoad;
                }
				$(document.body).append(this.config.content);
				$(document.activeElement).blur();
			},
			initInline: function() {
				var self = this;
				var className = this.config.className ? 'popup '+this.config.className : 'popup';
				this.content = $('<div class="' + className + '"><div class="popup-content"><div class="popup-body"></div></div></div>');
				if (this.config.title) {
					$('<div class="popup-header"><a class="popup-close"><i class="fa fa-close"></i></a><h5 title='+ this.config.title +'>' + this.config.title + '</h5></div>').insertBefore(this.content.find('.popup-body'))
				}
				if (this.config.confirm) {
					if (this.content.find('.popup-footer').length !== 0) {
						this.content.find('.popup-footer').append('<button href="javascript:;" class="popup-footer-confirm">' + (this.config.confirm.text || '确认') + '</button>').find('.popup-footer-confirm').on('click', function(event) {
							self.config.confirm.callback(self, event);
						})
					} else {
						$('<div class="popup-footer"></div>').append('<button href="javascript:;" class="popup-footer-confirm">' + (this.config.confirm.text || '确认') + '</button>').insertAfter(this.content.find('.popup-body')).find('.popup-footer-confirm').on('click', function(event) {
							self.config.confirm.callback(self, event);
						});
					}
				}
				if (this.config.cancel) {
					if (this.content.find('.popup-footer').length !== 0) {
						this.content.find('.popup-footer').append('<button href="javascript:;" class="popup-footer-cancel">' + (this.config.cancel.text || '取消') + '</button>').find('.popup-footer-cancel').on('click', function(event) {
							self.config.cancel.callback(self, event);
						})
					} else {
						$('<div class="popup-footer"></div>').append('<button href="javascript:;" class="popup-footer-cancel">' + (this.config.cancel.text || '取消') + '</button>').insertAfter(this.content.find('.popup-body')).find('.popup-footer-cancel').on('click', function(event) {
							self.config.cancel.callback(self, event);
						});
					}
				}
				if (this.config.closeTrigger == 'cancel') {
					this.content.find('.popup-close').on('click', function(event) {
						if (self.config.cancel) {
							self.config.cancel.callback(self, event);
						} else {
							self.destroy();
						}

					});
				} else if (this.config.closeTrigger == 'confirm') {
					if (self.config.confirm) {
						self.content.find('.popup-close').on('click', function(event) {
							self.config.confirm.callback(self, event);
						});
					} else {
						self.destroy();
					}
				} else {
					self.content.find('.popup-close').on('click', function(event) {
						self.destroy();
					});
				}
				this.content.find('.popup-body').append(this.config.content);
				$(document.body).append(this.content);
				$(document.activeElement).blur();
			},
			modal: function() {
				if (this.config.modal != false) {

				}
			},
			close: function() {

				if ( this.config.beforeClose ) this.config.beforeClose(this);
				if ( this.config.is_reload ) parent.location.reload();
				if ( this.doc ) {
					this.doc.find('*').unbind('click');
					this.config.content.remove();
				} else {
					this.content.find('*').unbind('click');
					this.content.remove();
				}
                // 重新显示外层的滚动条
                $('.skylar-main-area').css('overflow', 'auto');
			},
			destroy: function() {
				this.close();
			}
		}
	})
	var tipsTimer;
	$.tips = function(config) {
		if (typeof config != 'object') {
			var arg         = Array.prototype.slice.call(arguments);
			config          = {};
			config.text     = arg[0];
			config.success  = arg[1];
			config.time     = arg[2];
			config.callback = arg[3];
		}
		config.time = typeof config.time !== 'undefined' ? config.time : 1500;
		var html = ['<div id="tips" class="tips clearfix">',
			'<i class="tips-icon"></i>',
			'<span class="tips-txt"></span>',
			'</div>'
		].join("");
		if ($('#tips').length == 0) {
			$(html).appendTo(document.body);
		};
		$('#tips .tips-txt').html(config.text);
		var type = config.success ? "success" : "warning";
		$('#tips').show().removeClass('success warning').addClass(type);
		//iframe内
		if (top !== self) {
			var width = Math.min($(document.body).width() - 30, 500);
			$('#tips').css({
				top: 30,
				width: width,
				marginLeft: -width / 2
			});
			$('#tips .tips-txt').css({
				width: (width - 50)
			});
		}
		//  else {
		// 	var topValue = Math.max(document.body.scrollTop, document.documentElement.scrollTop, 20);
		// 	$('#tips').css('top', topValue);
		// }
		clearTimeout(tipsTimer);
		tipsTimer = setTimeout(function() {
			if (config.callback) config.callback();
			$('#tips').hide(300);
		}, config.time ? config.time : 1500);
	}




	/**
	 * [confirm description]
	 * @param  {Object} config [description]
	 * @return {[promise]}        [description]
	 */
    $.confirm = function(config){

		//var flag = null;
		var deferred = new $.Deferred();

		if (typeof(config) !== 'object'){

    		var args = null;
			args = [].slice.call(arguments);
    		config = {
    			title : args[0],
    			message : args[1]
    		}

    	}

	   	$.popup({
    		title:config.title || '提示',
    		content:'<p class="confirm-tip"><span class="popup_icon confirm_icon"></span>'+config.message+'</p>',
    		confirm:{
    			text:config.confirm_text || '确定',
    			callback:function(self,e){
    				e.stopPropagation();
    				self.close();
    				deferred.resolve(true)
    			}
    		},
    		cancel:{
    			text:config.cancel_text || '取消',
    			callback:function(self){
    				self.close();
    				deferred.reject(false);
    			}
    		},
    		closeTrigger:'cancel',
    		popupDone:function(self){
    			//把焦点定在确认键上
				$(self.content).find('.popup-footer-confirm').focus();
			}
    	})

    	return deferred;
    }



	/**
	 * [alert description]
	 * @param  {Object}| String(title,message)   [description]
	 * @return {[promise]}        [description]
	 */

    $.alert = function(config){

    	'use strict';
    	var def = new $.Deferred();

    	if (typeof(config) !== 'object'){

    		var args = null;
			args = [].slice.call(arguments);
    		config = {
    			title : args[0],
    			message : args[1],
    			success: args[2] || ''
    		}

    	}
    	$.popup({
			title:config.title,
			content:'<div class="alert_container"><span class="popup_icon alert_icon ' + config.success + '"></span><div class="alert_message">'+config.message+'</div></div>',
			confirm:{
				text:'确定',
				callback:function(self,e){
					e.stopPropagation();
					def.resolve(true);
					self.close();
				}
			},
			closeTrigger:'confirm',
			popupDone:function(self){
				//把焦点定在确认键上
				$(self.content).find('.popup-footer-confirm').focus();
			}
		})
		return def.promise();
    };

    /**
     * [prompt 接受一个值]
     * @param  {[配置项]} config [Object]
     * @return {[promise]}        [promise]
     */

    $.prompt = function(config){
    	'use strict';
    	var def = new $.Deferred();

    	if (typeof(config) !== 'object'){

    		var args = null;
			args = [].slice.call(arguments);
    		config = {
    			title : args[0],
    			label : args[1],
    			success: args[2] || '',
                defaultValue: args[3] || ''
    		}

    	}

    	$.popup({
			title:config.title,
			content:'<div class="prompt_container"><div class="prompt_message"><label>' + config.label + '：</label><input value = "' + (config.defaultValue || "") +'" type="text" name="prompt" id="prompt" /></div></div>',
			confirm:{
				text:'确定',
				callback:function(self,e){
					e.stopPropagation();
					var val = $.trim($('#prompt').val());

                    if (val){
                        def.resolve(val);
                        self.close()  
                    }else{
                        $.tips("输入的值不能为空")
                    }

				}
			},
			cancel:{
				'text':'取消',
				callback:function(self){
					def.reject();
					self.close();
				}
			},
			closeTrigger:'cancel',
			popupDone:function(self){
				//把焦点定在输入框中
				$(self.content).find('input[type=text]').focus();
			}
		})
		return def.promise();
    }



	$.loading = {
		_curFrame:0,
		_playTimer:null,
		PICNUM:8,
		PICHEIGHT:64,
		_frame:88,
		show: function(modal) {
			var self = this;
			if ($('.loading').length > 0) {
				return;
			}
			var html;
			if(modal){
				html = $('<div class="loading-wrap"><div class="est-valign-ghost"></div><div class="loading"><i class="mum"></i></div></div>');
			}else{
				html = $('<div class="loading"><i class="mum"></i></div>');
			}

			self._playTimer = setInterval(function(){
				self._loading_animate();
			},self._frame);
			$(document.body).append(html);
		},
		_loading_animate:function(){
			if (!$('.loading').is(':visible')){
				clearInterval(this._playTimer);
				return;
			}
			var top = this._curFrame * ( - this.PICHEIGHT);
			$('.loading .mum').css('top',top);
			this._curFrame = (this._curFrame + 1) % this.PICNUM;
		},
		hide: function() {
			$('.loading-wrap,.loading').remove();
			clearInterval(this._playTimer);
		}
	}

	$.waitremoves = {
		show: function(modal) {
			if ($('.loading').length > 0) {
				return;
			}
			var html;
			if(modal){
				html = $('<div class="loading-wrap"><div class="est-valign-ghost"></div><div class="loadingremove"><div class="remove">正在等待客户端回应</div><i class="fa fa-spinner fa-spin"></i><a class="removecancle">取消</a></div></div>');
			}else{
				html = $('<div class="loading"><i class="fa fa-spinner fa-spin"></i></div>');
			}

			$(document.body).append(html);
		},
		hide: function() {
			$('.loading-wrap,.loadingremove').remove();
		}
	}

	$.waitremove = {
		_curFrame:0,
		_playTimer:null,
		PICNUM:8,
		PICHEIGHT:64,
		_frame:88,
		show: function(modal,mid) {
			var self = this;
			if ($('.loading').length > 0) {
				return;
			}
			var	html = $('<div data-mid="'+mid+'" class="loading waiting usb"><i class="mum"></i><span>正在等待客户端回应</span><a class="removecancle">取消</a></div>');
			self._playTimer = setInterval(function(){
				self._loading_animate();
			},self._frame);
			$(document.body).append(html);
		},
		_loading_animate:function(){
			if (!$('.loading').is(':visible')){
				clearInterval(this._playTimer);
				return;
			}
			var top = this._curFrame * ( - this.PICHEIGHT);
			$('.loading .mum').css('top',top);
			this._curFrame = (this._curFrame + 1) % this.PICNUM;
		},
		hide: function() {
			$('.loading-wrap,.loading').remove();
			clearInterval(this._playTimer);
		}
	}

	$.usbregiter = {
		_curFrame:0,
		_playTimer:null,
		PICNUM:8,
		PICHEIGHT:64,
		_frame:88,
		show: function(modal) {
			var self = this;
			if ($('.loading').length > 0) {
				return;
			}
			var	html = $('<div class="loading usb"><i class="mum"></i><span>U盘正在注册,请耐心等待。</span></div>');
			self._playTimer = setInterval(function(){
				self._loading_animate();
			},self._frame);
			$(document.body).append(html);
		},
		_loading_animate:function(){
			if (!$('.loading').is(':visible')){
				clearInterval(this._playTimer);
				return;
			}
			var top = this._curFrame * ( - this.PICHEIGHT);
			$('.loading .mum').css('top',top);
			this._curFrame = (this._curFrame + 1) % this.PICNUM;
		},
		hide: function() {
			$('.loading-wrap,.loading').remove();
			clearInterval(this._playTimer);
		}
	}

	$.usbunlock = {
		_curFrame:0,
		_playTimer:null,
		PICNUM:8,
		PICHEIGHT:64,
		_frame:88,
		show: function(modal) {
			var self = this;
			if ($('.loading').length > 0) {
				return;
			}
			var	html = $('<div class="loading usb"><i class="mum"></i><span>正在取消注册,请耐心等待..</span></div>');
			self._playTimer = setInterval(function(){
				self._loading_animate();
			},self._frame);
			$(document.body).append(html);
		},
		_loading_animate:function(){
			if (!$('.loading').is(':visible')){
				clearInterval(this._playTimer);
				return;
			}
			var top = this._curFrame * ( - this.PICHEIGHT);
			$('.loading .mum').css('top',top);
			this._curFrame = (this._curFrame + 1) % this.PICNUM;
		},
		hide: function() {
			$('.loading-wrap,.loading').remove();
			clearInterval(this._playTimer);
		}
	}

})