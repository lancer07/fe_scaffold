define('res/js/common/tab',function(){
	var tab ={
		/**
		 * tab的dom范围
		 * @param  {[type]} dom          tab范围的jquery对象
		 * @param  {[type]} func         切换页卡之后后执行的操作
		 * @param  {[type]} notShowFirst [description]
		 * @param  {[type]} funcTabBefor 切换页卡之前执行的操作
		 */
		init:function(dom, func, notShowFirst, funcTabBefor){
			var self = this;
			dom = $(dom);
			if (dom.length===0){
				return;
			}
			dom.each(function() {
				var navWrapper  = $(this);
				var activeTab   = null;
				var tabSwitch   = navWrapper.find('.tabswitch');
				var $tabHeader   = navWrapper.find('.tabswitch-header');
				var navContents = navWrapper.children('.dataTab').length == 0 ? $('.dataTab'):navWrapper.children('.dataTab');
				if (notShowFirst){
					navContents.hide()
				}else{
					navWrapper.attr('activeTab',tabSwitch.children().first().attr('data-tab'));
					tabSwitch.children().first().addClass('active');
					navContents.hide().first().show();
				}
				tabSwitch.delegates({
					'li':function(){
						var $self     = $(this);
						var lis       = $self.siblings('li');
						var dataTabId = $self.attr('data-tab');

						if ($(this).hasClass('disable') || (navWrapper.attr('activeTab') === dataTabId)) return
						if(funcTabBefor && "function" === typeof funcTabBefor) {
							if(!funcTabBefor(dom)){
								return;
							}
						}
						lis.removeClass('active');
						$self.addClass('active');
						if (navContents.length <= 0) {
							navContents = navWrapper.children('.dataTab');
						}
						navContents.stop().hide();
						$('#'+dataTabId).stop().show();
						navWrapper.attr('activeTab',dataTabId);
						if(func){
							func($self);
						}

					}

				});

				$tabHeader.delegates({
					".scroll-right": function() {
						var $this = $(this), $ul = $tabHeader.find(".tabswitch-tabs > ul");

						move($ul, -90, computeTabWidth($ul) - $ul.width())
					},
					".scroll-left": function() {
						var $this = $(this), $ul = $tabHeader.find(".tabswitch-tabs > ul");
						move($ul, 90)
					}
				})
			});
		}
	}

	function computeTabWidth($obj) {
		var width = 0;
		$obj.find("li").each(function(){
			width += $(this).outerWidth();
		})

		return width;
	}

	function getTranslate(strTranslate) {
		return strTranslate.replace(/[^0-9\-,]/g,'').split(',');
	}

	function move(obj, step, hideWidth) {
		hideWidth = hideWidth || 0;
		var $obj = $(obj)
		var translate = getTranslate($obj.css("transform"))
		if(translate && translate.length < 4) {
			translate = [0,0,0,0,0,0];
		}
		var offsetX = translate[4] - 0;

		// 向左移动
		if(step < 0 && (hideWidth < 0 || Math.abs(offsetX) > hideWidth) ){
				return;
		}

		// 向右移动
		if(step > 0 && offsetX === 0 ){
			return;
		}
		$obj.css("transform", "translateX(" + (offsetX+step) + "px)")
	}
	return tab;
});