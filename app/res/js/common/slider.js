define('res/js/common/slider', function() {
	var slider = {
		config: {},
		init: function(config) {
			var self = this;
			config.showPicNum = config.showPicNum ? config.showPicNum : 3;
			config.container = config.container || '.slider'
			this.config = config;

			if ($('.slider').length === 0) {
				return;
			}
			$('.slider').each(function(i,el){
				self.allLength($(el));
			})

			this.resize(config);

			$(document.body).delegates({
				'.prev,#preTask': function(event, page) {
					var commpleteFlag = $(this).attr('flag');
					if(commpleteFlag  == 'false'){
						return;
					}
					
					var nowPage = $(this).parents('.slider').find('input[type="radio"]:checked').index();
					var $this = $(this);
					config.viewportWidth = $this.parents('.slider').find('ul').parent('div').width();
					var lis = $this.parents('.slider').find('li');
					
					page = page || nowPage - 1;

					if (nowPage == 0) {
						return;
					}
					$(this).attr('flag',false);
					if (config.sliderModle === 'yScroll') {
						$this.parents('.slider').find('ul').animate({
							'top': 0
						}, config.slideSpeed);
					} else {
						var movedis = (config.viewportWidth + parseInt(lis.css('marginRight'))+parseInt(lis.css('borderRightWidth'))*config.showPicNum) * (nowPage - page);
						$this.parents('.slider').find('ul').animate({
							'left': parseInt($this.parents('.slider').find('ul').css('left').replace('px')) +
								movedis + 'px'
						}, config.slideSpeed,function(){
							$this.attr('flag',true);
						});
					}

					$this.parents('.slider').find('.switchRadio').find('input[type="radio"]').eq(page).prop('checked', true);
				},

				'.next,#nextTask': function(event, page) {
					var commpleteFlag = $(this).attr('flag');
					if(commpleteFlag  == 'false'){
						return;
					}
					
					var nowPage = $(this).parents('.slider').find('input[type="radio"]:checked').index();
					var $this = $(this);
					config.viewportWidth = $this.parents('.slider').find('ul').parent('div').width()
					var lis = $this.parents('.slider').find('li');

					page = +page || (+nowPage) + 1;
					var tlength = Math.ceil($this.parents('.slider').attr('page'));
					if (nowPage +1 >= tlength) {
						return;
					}
					$(this).attr('flag',false);
					if (config.sliderModle === 'yScroll') {
						$this.parents('.slider').find('ul').animate({
							'top': -(lis.height())
						}, config.slideSpeed);
					} else {
						var movedis = (config.viewportWidth + parseInt(lis.css('marginRight'))+parseInt(lis.css('borderRightWidth'))*config.showPicNum) * (page - nowPage);
						$this.parents('.slider').find('ul').animate({
							'left': parseInt($this.parents('.slider').find('ul').css('left').replace('px')) -
								movedis + 'px'
						}, config.slideSpeed,function(){
							$this.attr('flag',true);
						});
					}

					$this.parents('.slider').find('.switchRadio').find('input[type="radio"]').eq(page).prop('checked', true);
				},

				'.switchRadio input[type="radio"]': {
					'change': function() {
						var page = $(this).attr('data-page');
						var maxLength = Math.ceil($(this).parents('.slider').attr('page'));
						var viewport = $(this).parents('.slider').find('ul').parent('div').width();
						var lis = $(this).parents('.slider').find('li');
						var movedis = (viewport + parseInt(lis.css('marginRight'))+parseInt(lis.css('borderRightWidth'))*config.showPicNum)*page;
						$(this).parents('.slider').find('ul').animate({
							'left': -movedis + 'px'
						}, config.slideSpeed,function(){
							
						});
					}
				}
			});

			$(window).resize(function(event) {
				self.resize(config);
			});

			$('.slider').fadeIn();
		},

		resize: function(config) {
			$('.slider').each(function(index,ele){
				$(this).css({
					width: $(this).parent().width()
				});
				var lis = $(this).find('li');

				if($(this).attr('id')==='taskLIst'){
					lis.width(($(this).parent().width())*0.88/config.showPicNum-config.showPicNum);
				}

				var gap = parseInt(lis.css('marginRight')) * (config.showPicNum - 1)
							+ (parseInt(lis.css('borderRightWidth'))* (config.showPicNum-1));
				
				var viewportWidth = lis.width() * config.showPicNum + gap;

				var limargin = (viewportWidth - 150) / 2 + 'px';

				var picleft = ($(this).width() - (viewportWidth)) / 2;

				var $radioGroup;


				$(this).find('ul').parent().width(viewportWidth);

				switch (config.sliderModle) {
					case 'xScroll':
						$('.picWrap').css({
							left: picleft,
							height: lis.css('height')
						});
						break;
					case 'yScroll':
						$('.picWrap').css({
							left: picleft,
							height: lis.css('height')
						});
						$('.slider').find('ul').css('width', viewportWidth + parseInt(lis.css('marginRight')));
						break;
				}

				if ($('#common-use li').not('.none').length <= 3) {
					$('.prev').hide();
					$('.next').hide();
				}else {
					$('.prev').show();
					$('.next').show();
				}

				if (config.radioBtn) {
					$radioGroup = $(this).find('.switchRadio');

					$radioGroup.css({
						top: parseInt($('.picWrap').css('top')) + lis.height() + 'px'
					});

					$radioGroup.empty().append($.tpl($('#switch-radio').html(), {
						count: Math.ceil($(this).attr('page'))
					}));

					// 初始化选中第一页
					$radioGroup.find('input[type="radio"]').attr('name',$(this).attr('id')+'_switch').eq(0).prop('checked', true);
				}

				if (config.slideBtn) {
					$('.slideBtn span').css({
						'line-height': lis.height() + 'px'
					});
					$('.slideBtn').css({
						width: $(this).width() * 0.8 + 'px'
					});
					$('.slideBtn').show();
				}
				
			})
			
		},

		allLength: function(el) {
			el.attr('page',el.find('li').not('.none').length/3);
		},

		reload: function(el) {
			el.find('ul').css('left', 0);
			this.allLength(el);
			this.resize(this.config);
		}
	}
	return slider;
})