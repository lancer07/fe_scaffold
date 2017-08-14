define('js/common/guidance', [
	'js/common/jquery-tools',
	'js/common/jquery-cookie'
], function() {
	var $steps;
	var $DOC      = $(document.body);
	var html      = '';
	var footer    = $('#change-step').html();
	$.guidance = $.Class(function() {
		return {
			_ORDER: 1,
			docHeight:0,
			show: function(order) {
				this._ORDER = order;
				html = $('#step-' + order).html();
				$('.gd-popup').remove();
				$DOC.append('<div style="height:' + this.docHeight + 'px" class="gd-popup">' + html + footer + '</div>').height();
				this.setStepPos();
				this.setStepActive(order);
				if (this._ORDER == 5) {
					$('#explore').show();
					$('#next').hide();
				}
			},

			init: function() {
				if (!$.cookie('gd-view')) {
					$.cookie('gd-view', true, {
						path: '/',
						expires: new Date((new Date()).getFullYear() + 10, 0, 1) // 设置一个较大的失效日期，使得gd 不再弹出
					});
					
					this.docHeight = $(document).height();
					this.show(1);
					this._initEvent();
				}
			},

			_initEvent: function() {
				var self = this;
				$(document.body).delegates({
					'ul.gd-steps li': function() {
						var order = $(this).attr('data-step');
						self.show(order);
					},
					'#close': function() {
						self.hide();
					},
					'#explore': function() {
						self.hide();
					},
					'#next': function() {
						self.show(++self._ORDER);
						if (self._ORDER == 5) {
							$('#explore').show();
							$('#next').hide();
						}
					}
				});
				// 当窗口调整时，对应元素位置改变，高亮的位置也要随之改变
				$(window).resize(function() {
					self.setStepPos();
				});
			},

			// 设置高亮对应的步骤序号
			setStepActive: function(order) {
				$steps = $('.gd-steps').find('li');
				$steps.eq(order - 1).addClass('active');
			},

			// 设置高亮目标的位置
			setStepPos: function() {
				var $step = $('.gd-step');
				
				var offset = this.getPos($step.attr('data-focus'));
				// $step.css('left', offset.left).css('top', offset.top);
				$step.css({
					'left': offset.left,
					'top': offset.top
				});
				this.ScrollTop(offset.top)
			},

			// 滚动到相应的位置
			ScrollTop: function(top){
				var $body = $(document.body);
				$body.animate({scrollTop:top},500)
			},

			// 获取高亮目标的位置
			getPos: function(focus) {
				if(focus){
					var $focus = $('.' + focus).size() !== 0 ? $('.' + focus) : $('#' + focus);
					return $focus.offset();
				} else{
					return {top:0,left:0}
				}
				
			},

			hide: function() {
				$('.gd-popup').remove();
			}
		}
	})
});