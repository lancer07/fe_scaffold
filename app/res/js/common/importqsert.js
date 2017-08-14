define('js/common/importqsert', ['js/common/au_modules', 'js/common/jquery-tools', 'module/webuploader/webuploader'], function(certUtil) {
	
	if (!CERT_INFO.hasModuleName){	//添加模块名称
        certUtil.addModuleName(CERT_INFO);
    }

    // 不可见模块
    var unVisibleObj = {
		health_online:       1,
		com_c_bcm_nacplugin: 1,
		com_ent_softmgr:     1,
		com_softwaredis:     1,
		com_sslvpn:          1,
		com_hassets:         1
	}
	// 不显示过期时间模块
    var unExpires = {
		"com_360av":          1,
		"com_360av_server":   1,
		"com_linux_360av":    1,
		"com_linuxser_360av": 1,
		"com_winser_360av":   1,
		"com_mac_360av":      1,
		"com_leakfix":        1,
		"com_leakfix_server": 1,
		"com_winser_leakfix": 1
    }

	var importqsert = {
		init: function() {
			$(document.body).delegates({
				'#import-qsert': function() {
					if ($cur_user != 1){
						return $.tips('您没有更新授权的权限！');
					}
					$.popup({
						title: '导入授权信息',
						content: $('#authorization-popup').html(),
						// cancel: {
						// 	text: '取消',
						// 	callback: function(self) {
						// 		self.close();
						// 	}
						// },
						popupDone: function() {
							var uploader = WebUploader.create({
								swf: '/res/moudle/webuploader/Uploader.swf',
								server: '/tools/cert/upload', //TODO
								pick: {
									'id': '#picker',
									'multiple': false
								},
								accept: { //似乎不起作用，可能是不在常用类型列表里
									'extensions': 'qcert'
								},
								formData: {
										YII_CSRF_TOKEN: SYS_CONF.csrf_token
								},
								fileVal:'certfile',
								auto:true
							});
							$('#upload-btn').click(function(event) {
								if (uploader.getStats().uploadFailNum > 0) {
									uploader.retry();
								} else {
									uploader.upload();
								}
							});
							importqsert.uploaderInit(uploader);
						},
						closeTrigger: 'cancel'
					});
				},
				'.auth_info #qsert-block': function() {
					$.popup({
						title:'授权信息',
						content:$.tpl($('#qsert-tpl').html(), CERT_INFO),
						popupDone:function(){
							// $('.qsert_module_container>h2:nth-child(1)').click();
							$(document.body).css('overflow', 'hidden');
							$('.logo_placeholder').css({
								'background': 'url('+(CERT_INFO.logo != '' ? CERT_INFO.logo : '/index/logo')+') rgb(214,214,214) no-repeat center center'	
							});
							if ($('.logo_placeholder').attr('disabled')) {
								return;
							}
							var uploader = WebUploader.create({
								swf: '/res/moudle/webuploader/Uploader.swf',
								server: '/tools/cert/logo', //TODO
								auto:true,
								pick: {
									id: '.logo_placeholder',
									multiple: false
								},
								fileVal:'logo',
								accept:{
									title: 'Images',
				   					extensions: 'png',
				   					mimeTypes: 'image/png'
								},
								formData: {
									YII_CSRF_TOKEN: SYS_CONF.csrf_token
								},
								fileSingleSizeLimit: 2*1024*1024
							});
							uploader.on('uploadProgress', function(file, percentage) {
								$.loading.show(true);
							}).on('uploadSuccess', function(file,response) {
								$.loading.hide();
								uploader.trigger('reset');
								if (response.result != 0) {
									$.tips(response.reason, false);
									return;
								}
								$('.logo_placeholder').css({
									'background':'url('+response.data.url+'?'+new Date()*1+') rgb(214,214,214) no-repeat center center'	
								})
								$('.au-icon').attr('src',response.data.url+'?'+new Date()*1);
							}).on('uploadError', function() {
								uploader.trigger('reset');
								$.loading.hide();
							}).on('error', function(err) {
								$.loading.hide();
								switch(err){
									case 'F_EXCEED_SIZE':
										$.tips('文件大小不能超过2MB');
										break;
									case 'Q_TYPE_DENIED':
										$.tips('请选择png图片')
								}
								uploader.trigger('reset');
							});
						},
						beforeClose:function(){
							$(document.body).css('overflow', 'auto');
						}
					})
				},
				'.q_header .fa-close':function(){
					$('#qsert').empty().hide(300);
				},
				'.qsert_module_container>h2':function(){
					var me = $(this);
					var parent = me.parent();
					var ul_id = me.next('ul').attr('id');
					var certType = ul_id.split('-')[0];
					if ( me.hasClass('disable') ) return;
					if ( me.hasClass('active') ){
						me.removeClass('active');
						me.next('ul').slideUp();
						return;
					}
					parent.find('>h2').removeClass('active');
					me.addClass('active');
					if ( me.next('ul').is(':empty') ){
						var modules      = CERT_INFO['product'][certType]['modules'];

						var html = $.tpl($('#qsertModules-tpl').html(), {
							modules:      modules,
							unVisibleObj: unVisibleObj,
							unExpires:    unExpires
						});
						$('#' + ul_id).html(html);
					}
					parent.find('>ul').slideUp();
					me.next('ul').slideDown();
				}
			});
		},

		'uploaderInit': function(uploader) {
			var uploadBtn = $('#upload-btn');
			var upfileStates = $('#upfile-states');

			uploader.on('beforeFileQueued', function(file) {
				if (file.ext != "qcert") {
					$('#upfile-info').hide();
					uploadBtn.hide();
					uploader.removeFile(file, true);
					upfileStates.find('#upfile-state4').show().siblings().hide();
					$('#picker-file').val(file.name);
					return false; //不加入队列
				} else {
					$('.upfile-error').hide();
					$('#upfile-info').text(file.name).show();
					uploadBtn.show();
					upfileStates.find('#upfile-state0').show().siblings().hide();
					return true;
				}
			}).on('uploadProgress', function(file, percentage) {
				upfileStates.find('#upfile-state1').show().siblings().hide();
			}).on('uploadSuccess', function(FILE,response) {

				//返回参数错误时触发上传失败事件
				if(response.result){
					uploader.trigger('uploadError',response);
					return;
				}

				upfileStates.find('#upfile-state2').show().siblings().hide();
				
				$.tips('上传成功',true,1000);
				setTimeout(function(){
					location.reload();
				},1100)
				

			}).on('uploadError', function(res) {
				uploader.trigger('reset');
				upfileStates.find('#upfile-state3').html(res.reason).show().siblings().hide();

			});
		}
	};

	importqsert.init();


	return importqsert;
})