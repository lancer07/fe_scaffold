define('res/js/common/upgrade',[],function(){

	'use strict';

	var TASKNAME = {
		'checker' 		: '更新',
		'downloader' 	: '下载',
		'updater'		: '升级'
	}

	var Upgrade = function(){
		this.upgrade_list = [];
	}

	Upgrade.prototype = {
		init : function(config){
			//升级程序所处阶段
			this.Upgrade_status = this.fStatus(config);

			//升级程序类型['main','virus','leak']
			this.type 			= config.type || '';

			//升级程序名称[‘控制台’，‘病毒库’，‘补丁库’]
			this.name 			= config.type === 'main' ? '控制台' : config.type === 'virus' ? '病毒库' : '补丁库',

			//更新内容
			this.changelog 		= null;

			this.isExcute 		= config.success == 0 ? true :false,

			//下载进度
			this.progress 		= 0;

			//  下载定时器
			this.progressTimer  = null;

			this.step 			= config.step || '';

			this.ERR_TIP 		= '请检查网络连接是否正常';

			return this;

		},
		UPGRADE_DATA:function(val){
			var self = this;
			switch(val){
				case "CHECK_UPGRADE" :
					var data = {
						title: '检查更新',
						message: '<div><span>正在检查' + self.name + '是否有可用更新：</span><div><img  src="/res/img/res/js/common/upgrade_loading.gif" classs="check_upgrade_loading"/></div></div>',
						confirm_text: '后台检查',
						cancel_text: '取消',
						confirm_trigger: function(){
							self.hideBox()
						},
						cancel_trigger:function(){
							self.cancelUpgrade().then(function(){
								$('.ver_span[data-type=' + self.type + '] .arrow-up_loading').hide();
								$('.ver_span[data-type=' + self.type + '] .new_ver').hide();
								$('.ver_span[data-type=' + self.type + '] .arrow-up_loading').css('opacity', 1);
							})
						}
					};
					break;

				case "CHECK_ERR" :
					var data = {
						title: "检查失败",
						message: "<div>检查更新失败，" + self.ERR_TIP + "</div>",
						confirm_text: "重新检查",
						cancel_text: '取消',
						confirm_trigger: function() {
							$('#'+self.type).fadeOut().remove();
							self.TriggerTask('checker',Upgrade.upgrade_list)
						},
						cancel_trigger:function(){
							self.cancelUpgrade().then(function(){
								$('.ver_span[data-type=' + self.type + '] .arrow-up_loading').hide();
								$('.ver_span[data-type=' + self.type + '] .new_ver').hide();
								$('.ver_span[data-type=' + self.type + '] .arrow-up_loading').css('opacity', 1);
							})
						}
					};
					break;
				case "SHOW_UPGRADE_CONTENT":
					var data = {
						title: '升级内容',
						message: $.tpl($('#upgrade-content-tpl').html(),self.changelog),
						confirm_text: '下载更新',
						cancel_text: '重新检查',
						confirm_trigger: function() {
							self.TriggerTask('downloader',Upgrade.upgrade_list,function(){
								$('#' + self.type).fadeOut().remove();
								self.getUpgradeData().then(function(res){
									self.showUpgradeDetail(res);
									self.getDownloadProgress(0);
								})

							})
						},
						cancel_trigger:function(){
							$('#'+self.type).fadeOut().remove();
							self.changelog = null;
							self.progress  = 0;
							self.TriggerTask('checker',Upgrade.upgrade_list,function(){
								self.getUpgradeData().then(function(res){
									self.showUpgradeDetail(res);
								})
							});
						}
					};
					break;
				case "DOWNLOADING":
					var data = {
						title: '正在下载',
						message: '<div><p>下载进度：</p><p class="loading_process"><span class="proc_width"></span><i>'+self.progress+'%</i></p></div>',
						confirm_text: '后台下载',
						cancel_text: '取消',
						confirm_trigger: function(){
							self.hideBox()
						},
						cancel_trigger:function(){
							self.cancelUpgrade().then(function(){
								$('.ver_span[data-type=' + self.type + '] .arrow-up_loading').hide();
								$('.ver_span[data-type=' + self.type + '] .arrow-up_loading').css('opacity', 1);
							})
						}
					};
					break;
				case "DOWNLOAD_ERR":
					var data = {
						title: '正在下载',
						message: '<div><p>下载失败，' + self.ERR_TIP + '</p></div>',
						confirm_text: '重新下载',
						cancel_text: '取消',
						confirm_trigger: function() {
							self.TriggerTask('downloader',Upgrade.upgrade_list,function(){
								$('#' + self.type).fadeOut().remove();
								self.getUpgradeData().then(function(res){
									self.showUpgradeDetail(res);
									self.getDownloadProgress(0);
								})

							})
						},
						cancel_trigger:function(){
							self.cancelUpgrade().then(function(){
								$('.ver_span[data-type=' + self.type + '] .arrow-up_loading').hide();
								$('.ver_span[data-type=' + self.type + '] .arrow-up_loading').css('opacity', 1);
							})
						}
					};
					break;

				case "UPGRAD_CONFIRM":
					var data = {
						title: '升级内容',
						message: $.tpl($('#upgrade-content-tpl').html(), self.changelog),
						confirm_text: '立即升级',
						cancel_text: '重新检查',
						confirm_trigger: function(){
							self.startUpgrade()
						},
						cancel_trigger:function(){
							$('#'+self.type).fadeOut().remove();
							self.changelog = null;
							self.progress  = 0;
							self.TriggerTask('checker',Upgrade.upgrade_list,function(){
								self.getUpgradeData().then(function(res){
									self.showUpgradeDetail(res);
								})
							})
						}
					};
					break;

				case "UPGRADING":
					var data = {
						title: '正在升级',
						message: '<div><p>' + self.name + '正在升级，请耐心等待升级完成！</p><p><img  src="/res/img/res/js/common/upgrade_loading.gif" classs="check_upgrade_loading"/></p></div>',
						confirm_text: '后台升级',
						confirm_trigger: function(){
							self.hideBox()
						}
					};
					break;

				case "UPGRADED":
					
					var successMsg = self.type === 'main' ? '主程序升级正在进行，可能短暂地失去响应，请稍后重新打开页面！' 
												: '你当前的'+ self.name +'已经更新到最新版本，请点击确定刷新界面';
					var data = {
						title: '更新成功',
						message: '<div><p>' + successMsg + '</p></div>',
						confirm_text: '确定',
						confirm_trigger: function() {
							location.reload();
						}
					};
					break;

				case "UPGRADE_ERR":
					var data = {
						title: '更新失败',
						message: '<div><p>你当前的'+ self.name +'更新失败</p></div>',
						confirm_text: '重新检查',
						cancel_text: '取消',
						confirm_trigger: function(){
							$('#'+self.type).fadeOut().remove();
							self.changelog = null;
							self.progress  = 0;
							self.TriggerTask('checker',Upgrade.upgrade_list,function(){
								self.getUpgradeData().then(function(res){
									self.showUpgradeDetail(res);
								})
							})
						},
						cancel_trigger:function(){
							self.cancelUpgrade().then(function(){
								$('.ver_span[data-type=' + self.type + '] .arrow-up_loading').hide();
								$('.ver_span[data-type=' + self.type + '] .arrow-up_loading').css('opacity', 1);
								$('.ver_span[data-type=' + self.type + '] .new_ver').hide();
							})
						}

					};
					break;
				case "STATUS_ERR":
					var data = {
						title: '出错',
						message: '<div><p>当前更新程序出现异常，请重新启动升级程序</p></div>',
						confirm_text: '重新更新',
						cancel_text: '取消',
						confirm_trigger: function(){
							$('#'+self.type).fadeOut().remove();
							self.TriggerTask('checker',function(){
							})
						}
					};
					break;
			}
			return data;
		},
	}



	Upgrade.prototype.fStatus = function(obj) {
		var s = '';
		switch (obj.step) {
			case 'checker':
				s = obj.success == 1 ? 'SHOW_UPGRADE_CONTENT' : obj.success == 0 ? 'CHECK_UPGRADE' : 'CHECK_ERR';
				break;
			case 'downloader':
				s = obj.success == 1 ? 'UPGRAD_CONFIRM' : obj.success == 0 ? 'DOWNLOADING' : 'DOWNLOAD_ERR';
				break;
			case 'updater':
				s = obj.success == 1 ? 'UPGRADED' : obj.success == 0 ? 'UPGRADING' : 'UPGRADE_ERR';
				break;
			default:
				s = "STATUS_ERR";
		}
		return s;
	}

	Upgrade.prototype.updateSelf = function(obj){
		this.Upgrade_status = this.fStatus(obj);
		this.type 			= obj.type || '';
		this.name 			= obj.type === 'main' ? '控制台' : obj.type === 'virus' ? '病毒库' : '补丁库';
		this.step 			= obj.step || '';
		this.isExcute      	= obj.success == 0 ? true : false;
		if ( obj.ERR_TIP )  this.ERR_TIP = obj.ERR_TIP;
	}

	Upgrade.prototype.getUpgradeData = function(){
		var self = this;
		var def = new $.Deferred();
		if ( !self.changelog && (self.Upgrade_status === 'SHOW_UPGRADE_CONTENT' || self.Upgrade_status === 'UPGRAD_CONFIRM')){
			self.getChangelog().then(function(res){
				if (isArray(res.data) && res.data.length === 0){
					self.changelog = null;
					$('.ver_span[data-type=' + self.type + '] .new_ver').fadeOut('fast');
				}else{
					self.changelog = res.data;
					$('.ver_span[data-type=' + self.type + '] .new_ver').fadeIn('fast');
				}
				def.resolve(self.UPGRADE_DATA(self.Upgrade_status))
			})
		}else{
			if (self.Upgrade_status === 'UPGRADED'){
				$('.ver_span[data-type=' + self.type + '] .new_ver').fadeOut('fast');
			}
			def.resolve(self.UPGRADE_DATA(self.Upgrade_status))
		}
		return def.promise();
	}

	Upgrade.prototype.TriggerTask = function (task, list, callback) {
		var self = this;
		var isExcuting = false;

		if (CERT_INFO.over_limit) {
			$.alert('升级提示', '部署的终端数量超过授权数量,无法升级');
			Upgrade.upgrade_list[self.type] && delete Upgrade.upgrade_list[self.type];
			return false;
		}

		for (var i = 0 ; i < list.length ; i++ ){
			if ( list[i].step === task && list[i].isExcute ){
				$.alert('升级提示','请等待' + list[i].name + '的' + TASKNAME[task] + '进程执行完成');
				isExcuting = true;
				break;
			}
		}
		if (isExcuting){
			return;
		}
		var params = {
			type: self.type,
			step: task
		}

		$.postData('/tools/upgrade/TriggerUpgradeJob', params, true).then(function(res) {
			if (!res.data.status) {
				$.alert('升级提示', res.data.msg);
				Upgrade.upgrade_list[self.type].hideBox();
				delete Upgrade.upgrade_list[self.type];
				return;
			}

			self.updateSelf({
				type:self.type,
				step:task,
				success:0
			});

			$('.ver_span[data-type=' + self.type + '] .arrow-up_loading').css('display','inline-block').fadeIn();

			if (typeof(callback) === 'function') {
				callback(res);
			}

		}).fail(function(){

			delete Upgrade.upgrade_list[self.type];

		})
	}

	Upgrade.prototype.getChangelog = function(){
		var self = this;
		var def = new $.Deferred();
		var params = {
			type: self.type,
		}
		$.getJson('/tools/upgrade/changelog', params, true)
			.then(function(res) {
				if (!res.data) {
					res.data = [];
				}
				// if ( "main" === self.type && res.data.title ) res.data.title = getBuildNum(res.data.title);
				def.resolve(res)
			})
		return def.promise();
	}

	Upgrade.prototype.showUpgradeDetail = function(data) {
		var self = this;

		if(!self.changelog && self.Upgrade_status === 'SHOW_UPGRADE_CONTENT'){
			delete Upgrade.upgrade_list[self.type];
			return $.alert('升级提示','你当前的'+ self.name + '已经更新到最新版本' );
		}

		var box = $($('#upgrade_process_tpl').html()).css({
			width: $(document).width(),
			height: $(document).height()
		});

		box.find('.popup-body').append($(data.message));

		var html = $($.tpl(box.get(0).outerHTML, data)).attr('id',self.type);

		$(document.body).append(html);

		var container = $('.process_container')

		var pos = {
			left : ( $(window).width() - container.width() )/2,
			top  : ( $(window).height() - container.height() )/2
		}

		if (typeof(data.cancel_trigger) === 'function') {

			$('.process_container .popup-footer-cancel').on('click', data.cancel_trigger);
		}

		if (typeof(data.confirm_trigger) === 'function') {

			$('.process_container .popup-footer-confirm').on('click', data.confirm_trigger);
		}
	}

	Upgrade.prototype.cancelUpgrade =function() {
		var def = new $.Deferred();
		var self = this;
		var params = {
			type : self.type,
			step : self.step
		}
		var prevObj = Upgrade.upgrade_list[self.type];

		if (self.step === 'checker') delete Upgrade.upgrade_list[self.type];	

		$.getJson('/tools/upgrade/cancelupgradejob', params, true).then(function(res) {
			if (res.result) {
				$.tips(res.reason);
				def.reject(false)
			}
			$('div#' + self.type).fadeOut().remove();
			$.alert('升级提示','取消' + TASKNAME[self.step] + '成功！');

			if ( self.step === 'downloader' ){
				Upgrade.upgrade_list[self.type] = prevObj;
				self.updateSelf({
					type:self.type,
					step:'checker',
					success:1
				})
			}

			if (self.progressTimer){
				clearInterval(self.progressTimer);
			}

			def.resolve(true)
		})

		return def.promise();
	}

	Upgrade.prototype.startUpgrade = function() {
		var self = this;
		if ( self.type === 'main') {
			$.confirm({
				title: '升级提示',
				message: '升级即将开始，升级期间控制台不可使用'
			}).done(function() {

				self.TriggerTask('updater',Upgrade.upgrade_list,function(){
					$('div#'+self.type).hide().remove();
					self.getUpgradeData().then(function(res){
						self.showUpgradeDetail(res);
					})
				});
			})
		} else {

			self.TriggerTask('updater',Upgrade.upgrade_list,function(){
				$('div#' + self.type ).hide().remove();
				self.getUpgradeData().then(function(res){
					self.showUpgradeDetail(res);
				})
			});
		}

	}

	Upgrade.prototype.getDownloadProgress =	function (progress) {
		var self = this;
		var URL = '/tools/upgrade/getupgradeinfofromlog';

		self.progress = parseInt(progress) || 0;
		if ( self.progress === 100) {
			return;
		}

		var params = {
			type: self.type,
			step: 'downloader'
		};

		$.getJson(URL, params, false).then(function(res) {
			//console.log(res);
			var response = res.data;
			if (response && response['error'] * 1 !== 0) {
				self.Upgrade_status = "DOWNLOAD_ERR";
				return;
			}

			var prg = response ? (response.progress * 2.5 - 250) : -250;
			self.progress = response.progress;

			if (response.progress > 50) {
				$('.loading_process > i').css('color', '#fff');
			}

			if (parseInt($('.loading_process > i').text()) !== response.progress) {
				$('.loading_process > i').text((response.progress) + '%');
				$('.proc_width').animate({
					'left': prg + 'px'
				}, 200);
			}
			if (response && response.progress !== 100) {

				self.progressTimer = setTimeout(function() {
					self.getDownloadProgress(response.progress);
				}, 2000);

			} else {
				$.tips('下载成功', true, 1500);
			}

		}).fail(function() {
			self.Upgrade_status = "DOWNLOAD_ERR"
			$('#'+self.type).hide().remove();
		})
	}

	/**
	 * [hideBox description]
	 * 隐藏弹窗
	 */
	Upgrade.prototype.hideBox = function() {
		var self = this;
		var ver_info = $('.function-icon-version');
		var arrow_up = ver_info.find('.arrow-up_loading');
		$('div#'+ self.type +' .process_container').animate({
			left: ver_info.offset().left + 'px',
			top: ver_info.offset().top + 'px'
		}, 500).hide(400, function() {
			arrow_up.css('opacity', 1);
			$('.process_container .popup-footer-cancel').off('click');
			$('.process_container .popup-footer-confirm').off('click');
			$('div#'+self.type).fadeOut(100).remove();
		})
	}


	function isArray(val) {
		if (Object.prototype.toString.call(val) === '[object Array]') {
			return true;
		}
		return false;
	}

	// function getBuildNum(title){
	// 	return parseInt(title.replace(/\./g, "").substring(2), 10);
	// }

	return Upgrade;
})

