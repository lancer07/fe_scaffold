define('res/js/common/switch', ['res/js/common/jquery-tools'], function() {

	$(document.body).delegates({
		'.switch': function() {
			var $this = $(this);
			if ($this.attr('disabled') != undefined || $this.hasClass('disabled') || $this.prop('disabled')) {
				return;
			}
			if ($this.attr('data-status') === 'on') {
				$this.removeClass('fa-toggle-on').addClass('fa-toggle-off').attr('data-status', 'off');
				if ($this.find('input[type=hidden]').length > 0) {
					$this.find('input[type=hidden]')[0].value = 0;
				}
			} else {
				$this.removeClass('fa-toggle-off').addClass('fa-toggle-on').attr('data-status', 'on');
				if ($this.find('input[type=hidden]').length > 0) {
					$this.find('input[type=hidden]')[0].value = 1;
				}
			}
		}
	});

});