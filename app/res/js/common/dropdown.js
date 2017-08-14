define('js/common/dropdown', function() {
	// var dropdown = {
	// 	init:function(){
	// 		if($('.dropdown').length === 0){
	// 			return;
	// 		}
	// 		var dropdown = $('.dropdown');
	// 		var showType = null;
	// 		for(var i=dropdown.length-1; i>=0; i--){
	// 			var dropmenu = $(dropdown[i]).children('ul.dropmenu');
	// 			showType = dropmenu.attr('data-showtype')? dropmenu.attr('data-showtype'):'click';
	// 			if(!dropmenu.attr('data-items') || dropmenu.children('li').length !=0){
	// 				return;
	// 			}
	// 			var itemArray = dropmenu.attr('data-items').split(',');
	// 			itemlength = itemArray.length;
	// 			var liHtml ='';
	// 			for(var j=0; j<itemlength;j++){
	// 				liHtml += '<li><a href="javascript:;">'+itemArray[j]+'</a></li>';
	// 			}
	// 			dropmenu.append($(liHtml));
	// 		}

	// 		this.eventinit(showType);			
	// 	},	
	// 	eventinit:function(etype){
	// 		switch(etype){
	// 			case 'mouseover':
	// 				$('.dropdown').on('mouseover',function(event){
	// 					event.stopPropagation();
	// 					var $self = $(this);
	// 					$(document.body).on('mouseover',function(){
	// 						$self.children('.dropmenu').stop().slideUp('1000');
	// 					})
	// 					$self.children('.dropmenu').stop().slideDown('400');
	// 				});
	// 				break;
	// 			default:
	// 				$('.dropdown').on('click',function(event){
	// 					event.stopPropagation();
	// 					var $self = $(this);
	// 					$(document.body).on('click',function(){
	// 						$self.children('.dropmenu').stop().slideUp('1000');
	// 					})
	// 					$self.children('.dropmenu').stop().slideToggle('400',function(){
	// 						$(this).children('li').on('click',function(event){
	// 							event.stopPropagation();
	// 						});
	// 					});
	// 				});
	// 		}	
	// 	}
	// };

	var dropdown = {
		$dropdown: null,
		$targetBtn: null,
		init: function() {
			if ($('.dropdown').length == 0) {
				return false;
			}
			this.initPage();
			this.initEvent();
		},

		initPage: function() {
			if ($('.dropdown').length === 0) {
				return;
			}
			this.$dropdown = $('.dropdown');
			this.$dropdown.css('position', 'relative');

			this.$dropdown.each(function(index, item) {
				var $btns = $(item).children('a');
				$btns.splice(0, 1);
				this.$targetBtn = $btns;
				this.$targetBtn.css('position', 'absolute');
				$btns.hide();
			});

		},

		initEvent: function() {
			var self = this;
			this.$dropdown.hover(function(e) {
				// if (e.target == self.$dropdown.find('a:eq(0)')[0] && self.$dropdown.find('.dropdown-star').length > 0) {
					// this.$targetBtn.hide();
				// } else {
					this.$targetBtn.each(function(index, item) {
						var $item = $(item);
						var height = parseInt($(item).height());
						$item.css({
							'top': height * (index + 1),
							'left': 0	
						});
						$item.show();
					});
				// }
			}, function() {
				this.$targetBtn.hide();
			});
		}
	};
	dropdown.init();

	return dropdown;
});