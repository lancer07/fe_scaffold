define('res/js/common/search', [
	'res/js/common/jquery-tools',
	'res/js/common/ipfilter'
], function() {
	var search = {
		type: null,

		ip2Number: function(ip) {
			return Number(ip[0].split('.').join(''));
		},

		init: function() {
			if ($('.search-wrap').length == 0) {
				return;
			}
			var hash = $.changeHash();
			var searchKey = hash.search_key || hash.query;
			var searchCol = $('#search-input').attr('search_col') || 'ip|name';
			if (hash.search_col == 'ipzone') {
				$('.iprange').show();
				$('.pc-detail').hide();
				$.each(searchKey.split('-'), function(index, ip) {
					$.setIp('.ipfilter:eq(' + index + ')', ip);
				});
			} else {
				$('.iprange').hide();
				if (searchKey){
					$('.pc-detail').show().val(searchKey);
					$('#fa-search').hide();
					$('#clear').show();
				}
			}

			$(document.body).delegates({
				'.search-options': {
					mouseover: function(e) {
						var $this = $(this);
						$this.find('.option').show();
					},
					mouseout: function(e) {
						var $this = $(this);
						$this.find('.option').hide();
					}
				},
				'.search-options .option p': {
					click: function(e) {
						var $this = $(this);
						var index = $this.index();
						switch (index) {
							case 0:
								$('.search-type').hide();
								$('.pc-detail').show();
								break;
							case 1:
								$('.search-type').hide();
								$('.iprange').show();
								break;
						}
					}
				},

				'#clear': function() {
					$(this).hide();
					$('#fa-search').show();
					if($('.search-options').is(':visible')){
						if ($('.iprange').is(':visible')) {
							searchCol = 'ipzone';
							$.setIp('.ipfilter', '');
						} else {
							$('#search-input').val('');
						}
						$.changeHash({
							search_col: null,
							search_key: null
						});
					}else{
						$('#search-input').val('');
						$.changeHash({
							query: null
						});
					}
				},

				'#fa-search': {
					'click': function(event) {
						var searchKey;
						// 显示 X
						$(this).hide();
						$('#clear').show();
						if($('.search-options').is(':visible')){
							if ($('.iprange').is(':visible')) {
								var start = $.getIp('.ipfilter:eq(0)');
								var end = $.getIp('.ipfilter:eq(1)');
								searchCol = 'ipzone';
								if (search.ip2Number(start) - search.ip2Number(end) > 0) {
									$.tips({
										text: '请输入合理范围的ip段',
										success: false
									});
									return false;
								}
								searchKey = start + '-' + end;
							} else {

								searchCol = "ip|name";
								searchKey = $.trim( $('#search-input').val() );
							}
							$.changeHash({
								start: null,
								page: null,
								search_col: searchCol,
								search_key: searchKey
							});
						}else{

							$.changeHash({
								start: null,
								page: null,
								query: $.trim( $('#search-input').val() )
							});
						}

					}
				},

				'.iprange input': {
					keypress: function(e) {
						if (e.keyCode == 13) {
							$('#fa-search').trigger('click');
						}
					}
				},

				'#search-input': {
					keypress: function(e) {
						if (e.keyCode == 13) {
							$('#fa-search').trigger('click');
						}
					},
					change: function(){
						if ( '' === $.trim($(this).val())){
							$('#clear').trigger('click')
						}
					}
				}

			});
		}
	};
	search.init();

	return search;
})