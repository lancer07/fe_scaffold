define("js/common/accordion",[], function() {

	(function($) {
		$.fn.accordion = function(options) {
			var self = this;
			var settings = $.extend({}, {
				openFirst: false,
				mulity:false
			}, options);

			return this.each(function() {
				var dts = $(this).children('dt');
				dts.click(function(){
					if ( this.id === self.currentActiveId ) return false;
					if (typeof(settings.beforeSwitch) == 'function'){
						settings.beforeSwitch();
					}
					onClick.call(this);
				});
				if(!settings.mulity){
					dts.each(hide);
				}
				if (settings.open) $(this).children('dt:first-child').click();
			});

			function onClick() {
				$('dt').removeClass('actives');
				var $this = $(this);
				if(!settings.mulity){
					$this.siblings('dt').each(hide);
				}
				if($this.next('dd').length == 0){
					$this.addClass('actives');
				}else{
					$this.next('dd').slideToggle('fast');
					$this.find('i').toggleClass('open');
					$this.next('dd').attr('activeTab','');
					$this.next('dd').find('li:first-child').click();
				}
				self.currentActiveId = $this.attr('id');
				return false;
			}

			function hide() {
				var $this = $(this);
				$this.next('dd').hide();
				$this.find('i').removeClass('open');
			}

		}
	})(jQuery);

});