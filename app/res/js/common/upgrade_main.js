define('res/js/common/upgrade_main', ['res/js/common/jquery-tools', 'res/js/common/upgrade'], function(_, Upgrade) {
	Upgrade.upgrade_list = [];

	resizer();
	
	for (var i = 0 ; i < DOING_UPGRADE.length; i++){
		var task = DOING_UPGRADE[i];
		if (task.type && task.step){
			Upgrade.upgrade_list[task.type] = new Upgrade().init(task);
			if ( task.success == 0 )	$('.ver_span[data-type=' + task.type + '] .arrow-up_loading').css('display','inline-block').show();
			if ( task.need_update == 1 )	$('.ver_span[data-type=' + task.type + '] .new_ver').fadeIn('fast');
		}
		
	}




	$(document.body).on('receiveMessage', function(e, data) {

		if (data.type !== 'upgrade') {
			return;
		}

		var tagIndex = data.data.indexOf('<');
		var tag = data.data.slice(tagIndex);
		var params = {
			token:       $(tag).attr('data-token'),
			auto:        $(tag).attr('data-auto'),
			type:        $(tag).attr('data-type'),
			step:        $(tag).attr('data-step'),
			need_update: $(tag).attr('data-need_update'),
			success:     $(tag).attr('data-success'),
			ERR_TIP:     $(tag).attr('data-success') == -1 ? data.data.slice(0,tagIndex) : ''
		}

		$('.ver_span[data-type=' + params.type + '] .arrow-up_loading').fadeOut();
		
		// 非自动触发升级，而且已经取消的升级过程，对消息不处理
		if (params.auto !== '1' && !Upgrade.upgrade_list[params.type]) {
			return;
		}

		if (!Upgrade.upgrade_list[params.type]){
			Upgrade.upgrade_list[params.type] = new Upgrade().init(params);
			if ( params.success == 0 )	$('.' + params.type + ' .arrow-up_loading').css('display','inline-block').fadeIn();
		}

		Upgrade.upgrade_list[params.type].updateSelf(params);   //状态更新

		if (params.auto === '1' || params.token !== SYS_CONF.csrf_token) { 	//根据TOKE判断是否为启用升级的管理员
			return;
		}

		if (params.auto === '1' && params.step === "checker" && params.need_update != 1){	//无须任务更新，不用提示用户
			return;
		}

		addMessage(data);							//添加消息到消息列表
		$('.popup').remove(); 						//关闭取消确认弹窗
		$('div#' + params.type).fadeOut().remove();	//关闭当前升级弹窗

		Upgrade.upgrade_list[params.type].getUpgradeData().then(function(res){
			Upgrade.upgrade_list[params.type].showUpgradeDetail(res)
		});
	})

	$(document.body).delegates({

		'.ver_update, .ver_dropMenu .ver_span': function() {
			var isExcuting = false;
			if ( $(this).hasClass('disable') ) return $.alert('升级提示', '该模块授权已过期,无法升级');

			var type = $(this).hasClass('ver_update') ? $(this).attr('id').split('-')[0] : $(this).attr('data-type');
			
			if ( !Upgrade.upgrade_list[type] ){

				for (var i = 0 ; i < Upgrade.upgrade_list.length ; i++ ){
					if ( Upgrade.upgrade_list[i].step === 'checker' && Upgrade.upgrade_list[i].isExcute ){
						$.alert('升级提示',Upgrade.upgrade_list[i].name + '正在检查更新！');
						isExcuting = true;
						break;
					}
				}
				if (!isExcuting) startChecker(type);	

			}else {
				$( type + ' .arrow-up_loading').css('opacity', 0);
				Upgrade.upgrade_list[type] && Upgrade.upgrade_list[type].getUpgradeData().then(function(res){
					Upgrade.upgrade_list[type].showUpgradeDetail(res)
				});
			}			
			
		},

		'.process_container .fa-close, .closeTrigger': function() {
			var type = $(this).parents('.upgrade_box').attr('id');
			var self = this;
			if ($('.popup').length !== 0) {
				return;
			}
			Upgrade.upgrade_list[type] && Upgrade.upgrade_list[type].hideBox();

		}
	})


	function resizer() {
		$(window).on('resize', function(event) {
			var box = $('.upgrade_box');
			if (!box.length) {
				return;
			}
			box.css({
				width: $(document).width(),
				height: $(document).height()
			});
		});
	}

	function addMessage(msg){
		var $msg_div      = $('<div class="message" data-id=' + msg['id'] + ' />');
		var $msgCount     = $('#messageCount');
		var clearWrapper  = $('.clear-wrapper');
		var msgListOutter = $('#msgListOutter');
		var divNoMessage  = $('#noMessage');
		var msgContent    = [];
		var count         = $msgCount.text();

		msgContent.push('<p class="time-stamp">' + msg['time'].replace(' ', '<br/>') + '</p>');
		msgContent.push('<p>' + ( msg['data'] || '') + '</p>');
		msgContent.push('<i id="deploy-tip-close" class="fa fa-close"></i>');

		$msg_div.append($( msgContent.join('') )).appendTo($('#messageList'));

		$msgCount.text( ++count ).show();
		divNoMessage.hide();
		clearWrapper.show();
        msgListOutter.show();
	}

	function startChecker(type){	

		Upgrade.upgrade_list[type] = new Upgrade().init({
			type:type,
			step:'checker',
			success:0,
		})	
		Upgrade.upgrade_list[type].TriggerTask('checker', Upgrade.upgrade_list, function(res) {
			Upgrade.upgrade_list[type].getUpgradeData().then(function(udata){
				Upgrade.upgrade_list[type].showUpgradeDetail(udata);
			});

		})
	}

})