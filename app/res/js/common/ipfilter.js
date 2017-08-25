define('res/js/common/ipfilter', ['res/js/common/popup'], function() {
	$.getIp = function(wrapper, noTips){
		var $wrap = $(wrapper);
		var ips = [];

		for (var m = 0, l = $wrap.length; m < l; m++) {
			var inpts = $($wrap[m]).find('input.ip');
			var ip = [];

			for (var i = 0; i < 4; i++) {
				var val = inpts.eq(i).val();
				var intVal = parseInt(val);
				if(inpts.eq(i).hasClass('isemp'))
				{
					if ($.trim(val) !== "" && ((intVal != 0 && !intVal) || (intVal > 255 || intVal < 0))) {
						if (!noTips) {
							$.tips('请输入一个0-255之间的整数', false);
						}
						inpts.eq(i).focus();
						return '';
					}
				}
				else if(inpts.eq(i).hasClass('ipran'))
				{
					if ($.trim(val) !== "" && (intVal > 254 || intVal < 1)) {
						if (!noTips) {
							$.tips('请输入一个1-254之间的整数', false);
						}
						inpts.eq(i).focus();
						return '';
					}
				}
				else {
					if ($.trim(val) === "" || (intVal != 0 && !intVal) || (intVal > 255 || intVal < 0)) {
						if (!noTips) {
							$.tips('请输入一个0-255之间的整数', false);
						}
						inpts.eq(i).focus();
						return '';
					}
				}
				ip.push(inpts[i].value);
			};

			ips.push(ip.join('.'));
		}
		return ips;
	}

	$.setIp = function(wrapper, ipStr) {
		var $wrap = $(wrapper);
		var ip = ipStr ? ipStr.split('.') : [];
		$wrap.each(function(index, el) {
			var inpts = $(this).find('input.ip');
			for (var i = 0; i < 4; i++) {
				inpts.eq(i).val(ip[i]);
			};
		});
	}

	var ipfilter = {
		init: function() {
			// if ($('.ipfilter').length == 0) {
			// 	return;
			// }
			var self = this;
			$(document.body).delegates({
				'.ip': {
					keydown: function(e) {
						function fixIe8(dom) {
							var rtextRange = dom[0].createTextRange();
							rtextRange.moveStart('character', dom[0].value.length);
							rtextRange.collapse(true);
							rtextRange.select();
						}

						var code = e.keyCode || e.which;
						if (e.ctrlKey && code == 86) {
							return true;
						}
						switch (code) {
							//退格键
							case 8:
								var val = $(this).val();
								if (val === '' && $(this).prev('.ip').length > 0) {
									$(this).prev('.ip').focus();
									// ($.browser.version == '8.0' || $.browser.version == '9.0') && fixIe8($(this).prev('.ip'));
									return false;
								} else {
									return true;
								}
								//输入[.]和空格到下一个位置，110和229:[.]，32空格
							case 110:
							case 190:
							case 39:
							case 32:
								if ($(this).next('.ip').length > 0) {
									$(this).next('.ip').focus();
									// $.browser.version == '8.0' && fixIe8($(this).next('.ip'));
								}
								return false;
							case 37:
								if ($(this).prev('input').length > 0) {
									$(this).prev('input').focus();
									// $.browser.version == '8.0' && fixIe8($(this).prev('input'));
								}
								return false;
								//数字输入：数字键：[48-57]，小键盘：[96-105]
							case 9:
							case 13:
							case 46:
							case 48:
							case 49:
							case 50:
							case 51:
							case 52:
							case 53:
							case 54:
							case 55:
							case 56:
							case 57:
							case 96:
							case 97:
							case 98:
							case 99:
							case 100:
							case 101:
							case 102:
							case 103:
							case 104:
							case 105:
								return true;
							default:
								return false;
						}
					},

					keyup: function() {
						var $this = $(this);
						var value = $this.val();
						if (value.length >= 3) {
							var thisValue = value.substr(0, 3);
							$this.val(thisValue);
						}
					},

					input: function() {
						var $this = $(this);
						var value = $this.val();
						if (value === "") {
							return;
						}
						if($this.hasClass('ipran'))
						{
							if (parseInt(value) == NaN || parseInt(value) < 0 || parseInt(value) > 254) {
								$.tips({
									text: "请输入一个0-254之间的整数",
									success: false
								});
								$this.focus().val('254');
								return false
							}
						}else
						{
							if (!$.isNumeric(value) || parseInt(value) < 0 || parseInt(value) > 255) {
								$.tips({
									text: "请输入一个0-255之间的整数",
									success: false
								});
								$this.focus().val('255');
							}else{	

								$this.focus().val(parseInt(value));
							}
						}
					},
					paste:function(event){
						event.preventDefault();
						var e = event.originalEvent;
						var clipboardData = e.clipboardData || window.clipboardData;
						var text  = clipboardData && clipboardData.getData('text');
						var ipreg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
						if(ipreg.test(text)){
							$.setIp($(this).parents('.ipfilter'),text);
						}
					}
				}
			});
		}
	};
	ipfilter.init();

	return ipfilter;
})
