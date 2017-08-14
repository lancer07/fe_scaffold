define('js/common/nav', ['js/common/jquery-tools'], function() {
	var nav = {
		interval: null,
		init: function() {
			if ($('.common-nav').length == 0) {
				return;
			}
			var self = this;
			var leave2 = null;
			$(document.body).delegates({
				'.common-nav .level1>li': {
					mouseover: function(e) {
						var tar = e.currentTarget || e.srcElement;
						var self = this;
						if (!$(this).hasClass('active')) {
							$('.common-nav .level1>li').removeClass('hover');
							$(this).addClass('hover');
						}
						$('.common-nav .level1>li:not(.hover) .level2').hide();
						$(this).find('.level2').css({
							left: tar.offsetLeft - 1,
							// top: tar.offsetTop + 40,
							zIndex: 10
						}).show();
					},
					mouseout: function() {
						$(this).removeClass('hover');
						$(this).find('.level2').hide();
					}
				},
				'.common-nav .level2>li': {
					mouseover: function(e) {
						var tar = e.currentTarget || e.srcElement;
						if (!$(this).hasClass('active')) {
							$(this).addClass('hover');
						}
						$(this).find('.level3').show().css({
							left: tar.offsetLeft + 94,
							top: tar.offsetTop - 1,
							zIndex: 100
						});
					},
					mouseout: function() {
						$(this).removeClass('hover');
						$(this).find('.level3').hide();
					}
				},
				'.common-nav .level3>li': {
					mouseover: function(e) {
						var tar = e.currentTarget || e.srcElement;
						if (!$(this).hasClass('active')) {
							$(this).addClass('hover');
						}
						$(this).find('.level4').show().css({
							left: tar.offsetLeft + 107,
							top: tar.offsetTop - 1,
							zIndex: 111111
						});
					},
					mouseout: function() {
						$(this).removeClass('hover');
						$(this).find('.level4').hide();
					}
				},
				'.common-nav .level4 li': {
					mouseover: function() {
						if (!$(this).hasClass('active')) {
							$(this).addClass('hover');
						}
					},
					mouseout: function() {
						$(this).removeClass('hover');
					}
				},
				'.crumbs>a': {
					click: function(e) {
						var tar = e.currentTarget || e.srcElement;
						var self = $(this);
						if (self.find('.crumbs-down').length == 0) {
							return true;
						}
						// else if(self.find('.crumbs-home').length >0){
						// 	return;
						// }
						$('.crumbs>a').removeClass('active');
						self.addClass('active');
						$('.crumbs-dialog').remove();
						var clone;
						if ($(this).attr('href') == '/index') {
							clone = $('<ul></li>');
							clone.append($('.common-nav .level1>li').clone());
							// clone.find('li').each(function(i){
							// 	$(this).append($('.level1>li>a').eq(i).clone());
							// })
						} else {
							clone = $('.common-nav .level' + (self.index()) + '>li>a[href="' + self.attr('href') + '"]').parent().find('>ul').clone();
						}
						clone.addClass('crumbs-dialog').css({
							left: tar.offsetLeft + tar.offsetWidth - 17,
							top: tar.offsetTop + tar.offsetHeight,
							zIndex: 9
						}).find('ul,.open').remove();
						clone.show().appendTo(document.body);

						return false;
					}
				},
				'.crumbs-home': {
					click: function(e) {
						location.href = '/index';
						return false;
					}
				}
			})
			$(document).click(function() {
				$('.crumbs-dialog').remove();
				$('.crumbs>a').removeClass('active');
			})
		}
	};
	nav.init();

	return nav;
})