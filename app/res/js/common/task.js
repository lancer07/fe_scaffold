define('js/common/task', [
	'js/common/jquery-tools',
	'js/common/table',
	'module/jquery-ui/jquery-ui'
], function() {
	var LIMIT = 7;
	var objHash = {};
	var normal_task_num = 0;
	var finish_task_num = 0;
	function dataBuild(_this){
		var Def = new $.Deferred();
		if(_this){
			_this.addClass('active');
		}
		var container = $('.task-wrap');
		objHash['type'] = _this.attr('data-value');
		objHash.limit = LIMIT;
		objHash.onlyme = $('#onlyMe').prop('checked');
		container.find('.common-content-table').empty();
		container.find('.common-content-table').append($('#'+_this.attr('data-tpl')).html());

		// 总数不足页数(应该判断最新任务和历史任务)
		var current_task_num = objHash['type'] === 'finish' ? finish_task_num : normal_task_num;
		if (objHash['page'] && objHash['start'] && current_task_num <= objHash['start'] ){
			objHash['start'] = objHash['start'] - LIMIT;
			objHash['page'] = objHash['page'] - 1;
		}
		$.getJson(_this.attr('data-url'), objHash, true).then(function(d){

			container.find('.common-content-table table tbody').empty();
			container.find('.common-content-table table tbody').append($.tpl($('#'+$($('#'+_this.attr('data-tpl')).html()).attr('data-tpl')).html(), d.data));
			container.find(".pager").unbind();
			$.pager(container.find(".pager"), d.data.total / objHash['limit'], objHash['page'] || 1, function(data) {
				objHash['start'] = objHash['limit'] * (data.page-1);
				objHash['page'] = data.page;
				dataBuild($('#task-nav li.active'));
			}, d.data.total).run();
			Def.resolve(d);
		}).fail(function(){
			Def.reject('Server end ERROR');
		})
		return Def.promise();
	}
	$(document.body).delegates({
		'#task-nav li':function(){
			var _this = $(this);
			$('#task-nav li').removeClass('active');
			objHash['start'] = 0
			objHash.page = 1;
			dataBuild(_this).then(function(d){
				// 保留任务数
				// normal_task_num --> 最新任务
				// finish_task_num --> 历史任务
				if (objHash['type'] === 'normal'){
					normal_task_num = d.data.total;
				}else{
					finish_task_num = d.data.total;
				}
			});
		},
		'#onlyMe':{
			change:function(){
				dataBuild($('#task-nav li.active'));
			}
		},
		'#taskManagement':function(){
			if ($('.task-wrap').length > 0){
				$('#task-nav li:eq(0)').trigger('click');
				$('.task-wrap, .task-mask').show(200);
				return false;
			}
			$(document.body).append($('#task-tpl').html());
			$('.task-wrap, .task-mask').show(200);
			$('.task-wrap').draggable({ cursor: "move", containment: ".task-mask",handle:'#task-nav' });
			$('#task-nav li:eq(0)').trigger('click');
			return false;
		},
		'.taskprogress-normal':function(){
			$.popup({
				title:'任务详情',
				url:'/task/index/detail#id='+$(this).parents('tr').attr('data-id')+'&type='+$('#task-nav li.active').attr('data-value'),
				width:800,
				height:600
			})
		},
		'.taskprogress-admin' : function() {
			$.alert('操作警告','此任务由其它管理员发起,不可查看此项任务的进度详情');
		},
		'.close-task':function(){
			$('.task-wrap,.task-mask').hide(200);
		},
		'.task-mask':{
			click:function(){
				$('.task-wrap,.task-mask').hide(200);
			}
		},
		'.task-cancel':{
			click:function(){
				var _self = this;
				$(this).blur();  //去除取消焦点，防止点击回车再次触发取消
				$.popup({
					title: '提示',
					content: '<p class="confirm-tip">确定取消此条任务吗？</p>',
					confirm: {
						text: '确认',
						callback: function(self) {
							$.postData('/task/index/cancel', {ids:$(_self).parents('tr').attr('data-id')},true).then(function(d){
								$.tips({text:'取消成功！',success:true,time:1000});
								normal_task_num = normal_task_num > 0 ? normal_task_num - 1 : 0; 		//取消成功，任务数减1
								dataBuild($('#task-nav li.active'))
							})
							self.close();
						}
					},
					cancel: {
						text: '取消',
						callback: function(self) {
							self.close();
						}
					},
					closeTrigger: 'cancel',
					popupDone:function(self){
						$( self.content ).find('.popup-footer-confirm').focus();
					}
				});

				return false;
			}
		},
		'.task-delete':{
			click:function(){
				var _self = this;
				$.popup({
					title: '提示',
					content: '<p class="confirm-tip">确定删除此条任务吗？</p>',
					confirm: {
						text: '确认',
						callback: function(self) {
							$.postData($(_self).attr('href'),{ids:$(_self).parents('tr').attr('data-id')},true).then(function(d){
								finish_task_num = finish_task_num > 0 ? finish_task_num - 1 : 0;		//删除成功，任务数减1
								$.tips({text:'删除成功！',success:true,time:1000});
								dataBuild($('#task-nav li.active'));
							});
							self.close();
						}
					},
					cancel: {
						text: '取消',
						callback: function(self) {
							self.close();
						}
					},
					closeTrigger: 'cancel',
					popupDone:function(self){
						$( self.content ).find('.popup-footer-confirm').focus();
					}
				});

				return false;
			}
		},
		'.task-pause':{
			click:function(){
				var _self = this;
				$.postData($(_self).attr('href'),{ids:$(_self).parents('tr').attr('data-id'),action:'pause'},true).then(function(d){
					$.tips({text:'操作成功！',success:true,time:1000});
					dataBuild($('#task-nav li.active'));
				})
				return false;
			}
		},
		'.task-goon':{
			click:function(){
				var _self = this;
				$.postData($(_self).attr('href'),{ids:$(_self).parents('tr').attr('data-id'),action:'contiune'},true).then(function(d){
					$.tips({text:'操作成功！',success:true,time:1000});
					dataBuild($('#task-nav li.active'));
				})
				return false;
			}
		},
		'.pagination-num':function(){
			$(this).focus();
		}
	})
	$(document.body).on('receiveMessage',function(event,obj){

		var data = obj.data;
		if(obj.type === 'task'){
			UpdateTask({
				name:     data.name,
				progress: data.progress
			})

		}
	});


	function UpdateTask(task){

		if (task && task.name){
			// 若原先有任务只需更新里面的任务信息；
			if ( $('.have-task').length!==0 ){
				$('.have-task').html(task.name+'&nbsp;&nbsp;'+task.progress+'%');
				$('.progress').css({
					left:(task.progress - 100)+'%'
				})
				return;
			}
			//原生没有任务时
			$('.no-task').remove();
			$('<span class="have-task"/>').html(task.name+'&nbsp;&nbsp;'+task.progress*1+'%').appendTo($('.task-management'));
			$('<span style="left:' + (task.progress - 100) +'%" class="progress"><i></i></span>').appendTo($('.task-management'));
		}else {
			$('.task-management').empty();
			$('<span class="no-task"><i></i>任务管理</span>').appendTo($('.task-management'));
		}
	}
});
