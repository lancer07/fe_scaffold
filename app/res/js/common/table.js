define('res/js/common/table', ['res/js/common/tab', 'res/js/common/jquery-tools', 'res/js/common/pager', 'res/js/common/popup'], function(tab) {
	$.tableFieldSort = $.Class(function(changeHash) {
		var getType = function(table) {
			var obj = $.changeHash();
			if (!obj.sort) {
				obj.sort = table.find('.sort-btm,.sort-top').parent().attr('data-sort');
				if (table.find('.sort-btm').length > 0) {
					obj.asc = false;
				} else if (table.find('.sort-top').length > 0) {
					obj.asc = true;
				}
				// $.changeHash(obj);

			} else {
				return {
					name: obj.sort,
					asc: obj.asc === 'true'
				}
			}
		}
		return {
			init: function(table, callback) {
				this.table = $(table);
				this.callback = callback;
			},
			run: function() {
				this.table.find('tr th[data-sort]').each(function() {
					var i = $(this).find('span i');
					if (i.length < 1) {
						$('<i></i>').appendTo($(this).find('span'));
					};
				});
				var types = getType(this.table);
				if (types) {
					var i = this.table.find('tr th[data-sort="' + types.name + '"]').find('span');
					i.removeClass('sort').addClass('sort-' + (types.asc ? "top" : "btm"));
				};
				this.bindEvent();
			},
			bindEvent: function() {
				var self = this;
				this.table.delegates({
					'tr th[data-sort] span': function() {
						self.table.find('tr th[data-sort] span').addClass('sort').removeClass("sort-top").removeClass("sort-btm");
						var name = $(this).parent().attr("data-sort");
						var revert = $(this).attr("data-sort-revert"); // 默认升序, 否则降序
						var types = getType(self.table);
						var type = !!revert ? 'desc' : 'asc';
						if (types && types.name == name) {
							if (types.asc) {
								type = 'desc';
							} else {
								type = 'asc';
							}
						};
						$(this).removeClass("sort").addClass(type == 'asc' ? 'sort-top' : 'sort-btm');
						if(!changeHash){
							var obj = $.changeHash({
								sort: name,
								asc: type == 'asc'
							});
						}
						//自定义列
						if(typeof(selectedCols) != 'undefined'){
							//修改spanName
							selectedCols.forEach(function(col){
								if(col.id == name){
									if(type == 'desc'){
										col.spanClass = 'sort-btm';
									}
									if(type == 'asc'){
										col.spanClass = 'sort-top';
									}
								}else{
									col.spanClass = 'sort';
								}
							});

						}

						self.callback && self.callback(obj);
					}
				})
			}
		}
	});

	$.table = $.Class(function() {
		return {
			defaultLimit: 12,
			init: function(container, changeHash, init) {
				this.container = $(container);
				this.content = this.container.find('.common-content-table');
				this.url = this.content.attr("data-url");
				this.checkboxStr = this.container.attr('data-checkbox') || 'table tbody tr input[type="checkbox"]';
				this.changeHash = changeHash;
				this.hash = $.changeHash();
				this.data = null;
				this.tpl = '';
				this.init = init === false ? false : true;
				this.allCheck = false;
				this.replaceContentFlag = false;
				this._initStatus();
				this._bindEvent();
				this._initHash();
			},
			_initHash: function() {
				var self = this;
				window.onhashchange = function() {
					if (self.changeHash) {
						self.run();
					}
				}
				self.hash.limit ? '' : self.hash.limit = self.defaultLimit;
				self.hash.gid ? '' : self.hash.gid = 0;
				self.hash.t = new Date().getTime();
				self.hash.tags = null;
				self.hash.is_online = null;

				if (this.container.find(".table-swtich").length > 0) {
					if (!(tabKey in self.hash)) { // TODO tabKey是哪来的鬼！！！
						var tabKey = this.container.find(".table-swtich").attr("data-key") || 'type';
						$swtichChoice = this.container.find(".table-swtich .swtich-btn:eq(0)");
						if(!$.changeHash()[tabKey]){
							self.hash[tabKey] = $swtichChoice.attr('data-value');
						}
						self.url ? '' : self.url = $swtichChoice.attr('data-url');
					}
				}
				if(self.init){
					$.changeHash(self.hash);
				}
			},
			_initStatus: function() {
				var self = this;
				var el = this.container.find('.table-swtich');
				var pars;
				if (el.length == 0) {
					var params = this.container.attr("data-pars") || this.container.find('.common-content-table').attr('data-pars');
					pars = $.queryUrl(params);
				}else{
					var tabKey = this.container.find(".table-swtich").attr("data-key") || 'type';
					var $swtichChoice;
					if (tabKey in self.hash) {
						$swtichChoice = this.container.find(".table-swtich .swtich-btn[data-value='" + self.hash[tabKey] + "']");
					} else {
						$swtichChoice = this.container.find(".table-swtich .swtich-btn:eq(0)");
					}
					pars = $.queryUrl($swtichChoice.attr('data-pars'));
				}
				self.hash = $.extend(pars, $.changeHash());
			},
			changeTab: function() {
				var self = this;
				var el = this.container.find('.table-swtich');
				var tags = $.changeHash().tags;
				if (el.length === 0) {
					var tpl = this.container.find('.common-content-table').attr('data-tpl');
					if (this.replaceContentFlag != true) {
						this.replaceContent(tpl);
					}

					this.request();

					return;
				} else {
					if (this.replaceContentFlag === true) {
						this.request();
						return;
					}
					var tabKey = this.container.find(".table-swtich").attr("data-key") || 'type';
					var $swtichChoice;
					if (tabKey in self.hash) {
						$swtichChoice = this.container.find(".table-swtich .swtich-btn[data-value='" + self.hash[tabKey] + "']");
					} else {
						$swtichChoice = this.container.find(".table-swtich .swtich-btn:eq(0)");
					}

					el.find('.swtich-btn').removeClass('active').find('.triangle').appendTo($swtichChoice);
					$swtichChoice.addClass('active');


					self.hash[tabKey] = $swtichChoice.attr('data-value');

					self.hash = $.extend($.queryUrl($swtichChoice.attr('data-pars')), $.changeHash());
					self.url = $swtichChoice.attr('data-url');
					var tpl = $swtichChoice.attr('data-tpl');
					if (tpl){
						this.replaceContent(tpl);
						this.request();
					}
				}
			},
			boastInterval: null,
			boastful: function(dom, value) {
				var self = this;
				var v = value / 10;
				var k = 0;
				clearInterval(self.boastInterval);
				this.boastInterval = setInterval(function() {
					dom.text(value);
					// k++;
					// if (v * k > value) {
					// 	clearInterval(self.setInterval);
					// } else {
					// 	dom.text(v * k);
					// }

				}, 0)

			},
			_bindEvent: function() {
				var self = this;
				self.checkLength = 0;
				GID = $.changeHash().gid;
				CURPAGE = 1;
				curpage = 1;
				this.container.delegates({
					'.common-content-tools a[data-request="true"]': function(event) {
						//
						event.preventDefault();
						var def = new $.Deferred();
						$this = $(this);
						var ids = self.getSelectedRows(true);
						if (!ids) {
							var info = $this.attr('nosel-info') || ($.tmp && $.tmp['nosel-info']) || "请选择要操作的数据";
							$.tips(info);
							return false;
						};
						var length = ids.split(',').length;
						var except = [];
						if (ids === 'ALL') {
							if (self.data.total > self.checkLength){
								except = self.getExceptRows();	
							}
							length = self.container.find('table tbody tr').length;
						};
						var pars = $.queryUrl($this.attr('data-pars'));
						var obj = {};
						var name = $this.attr('data-key') || 'mids';
						obj[name] = ids;
						obj['except'] = except;
						obj = $.extend(obj, pars);

						if(!$this.attr('data-setting')){
							if(!$this.hasClass('freeze')){   //只对能够点击的按钮进行操作，其他按钮处于“冻结”状态。
								self.commonBtnEvent($this, obj, length, function() {
									//将checkbox设置为不选中
									$('#selectCurrentPage').prop('checked', false);
									$('#selectAllPage').prop('checked', false);
									$('table tr input[type="checkbox"]').prop('checked', false);
									if ($this.attr('data-refresh')) {
										self.request();
									}
									/*if($this.attr('task-refresh')){
										$.getJson('/task/index/current',true).then(function(res){
											var arr = $('.have-task').text().split(' ');
											arr[0] = res.name+'&nbsp';
											$('.have-task').html(arr.join(''));
										})
									}*/
								})
							}
						}else{
							$(this).trigger('beforecommonBtnEvent',[def]);
							return $.when(def).then(function(){
								pars = $.queryUrl($this.attr('data-pars'));
								obj = $.extend(obj, pars);
								self.commonBtnEvent($this, obj, length, function() {
									//将checkbox设置为不选中
									$('#selectCurrentPage').prop('checked', false);
									$('#selectAllPage').prop('checked', false);
									$('table tr input[type="checkbox"]').prop('checked', false);
									if ($this.attr('data-refresh')) {
										self.request();
									}

									/*if($this.attr('task-refresh')){
										$.getJson('/task/index/current',true).then(function(res){
											var arr = $('.have-task').text().split(' ');
											arr[0] = res.name+'&nbsp';
											$('.have-task').html(arr.join(''));
										})
									}*/
								})
							});
						}
						self.checkLength = 0;
					},
					//全选当前页
					"#selectAllPage":{
						change: function(e) {
							CURPAGE = $.changeHash().page;
							GID = $.changeHash().gid;
							var checked  = this.checked;
							var checkbox = self.content.find('table tbody input[type="checkbox"]');
							var tip      = self.getCustomTip();
							var limit    = $.changeHash().limit;
							checkbox.each(function() {
								if (!this.disabled) {
									this.checked = checked;
								};
							});
							if (!checked) {
								self.content.find('table tbody').find('.table-allcheck-tip').remove();
								self.container.find('.common-content-tools a[data-request="true"]').removeClass('available');
								self.allCheck = false;
								self.checkLength = 0;
							} else {
								self.container.find('.common-content-tools a[data-request="true"]').addClass('available');
								//屏蔽单页tip的出现
								if(self.data.total - limit > 0){
									self.content.find('table tbody').find('.table-allcheck-tip').remove().end().prepend('<tr class="table-allcheck-tip" ><td colspan="' + self.content.find('table th:visible').length + '"><span data-tip="已勾选' + checkbox.length + tip.classify + tip.noun + '，">已勾选所有共' + self.data.total + tip.classify + tip.noun + '，</span><a id="selectCurrentPage" href="javascript:;" data-checked="false" data-tip="勾选本页' + tip.noun + '共' + checkbox.length + tip.classify + '">勾选本页' + tip.noun + '共<span class="boastful">'+ checkbox.length +'</span>'+tip.classify+'</a></td></tr>');
									self.allCheck = true;
									self.checkLength = self.data.total;
								}
							}
						},
					},
					//全选所有页面
					"#selectCurrentPage": function(e) {
						e.stopPropagation();
						var $self    = $(this);
						var tip      = self.getCustomTip();
						var checkbox = self.content.find('table tbody input[type="checkbox"]');
						if ($self.attr('data-checked') == 'true') {
							$self.attr('data-checked', 'false');
							$self.text($self.attr('data-tip'));
							self.allCheck = true;
							self.checkLength = self.data.total;
							$('#selectAllPage').prop('checked',true).change();
						} else {
							$self.attr('data-checked', 'true');
							$self.text('勾选所有'+self.data.total+tip.classify+tip.noun);
							self.allCheck = false;
							self.checkLength = checkbox.length;
							var text = $self.prev('span').attr('data-tip');
							$self.prev('span').attr('data-tip', $self.prev('span').text()).text(text);
							self.boastful(self.content.find('.boastful'), self.data.total);
							//+++
							$('#selectAllPage').prop('checked',false);
							for(var i = 0 ; i < checkbox.length; i++){
								$(checkbox[i]).prop('checked',true);
							}
						}

					},
					//table里的checkbox
					'.common-content-table table tbody tr input[type="checkbox"]': function() {
						var checked    = this.checked;
						var CHECKED    = $('#selectAllPage').prop('checked');
						var checkbox   = self.content.find('table tbody input[type="checkbox"]');
						var checkedNum = self.content.find('table tbody input[type="checkbox"]:checked').length;
						var totalNum   = self.data.total;
						var tip        = self.getCustomTip();
						var limit      = $.changeHash().limit || 12;
						curpage = $.changeHash().page;
						gid = $.changeHash().gid;
						//console.log(curpage,CURPAGE,gid,GID);
						//确保换页和换分组时，勾选的计数能清零
						// console.log(gid!=GID);
						// console.log(curpage !=CURPAGE);
						if(gid != GID || curpage!=CURPAGE) {
							self.checkLength = 0;
							GID = gid;
							CURPAGE = curpage;
						}


						if (!checked) {
							//勾选终端的checkedbox会自动取消掉(因为载入过程(loading)中，勾选了也会累加checkedLength），但当loading消失时，其实才算是完全加载页面。此时会将所有勾选的选项都清除。但self.checkedLength会累加勾选
							if(limit - totalNum >= 0){
								self.checkLength = checkedNum;
							} else {
								self.checkLength-- ;
							}
							if(self.checkLength < 0){
								self.checkLength = 0;
							}
							$('#selectAllPage').prop("checked", false);
						}else{
							if(self.checkLength > totalNum){
								self.checkLength = totalNum;
							}
							if(limit - totalNum >= 0){
								self.checkLength = checkedNum;
							} else {
								self.checkLength++;
							}


						}

						if (self.checkLength == totalNum ) {
							var $selectAllPage = $('#selectAllPage');
							if($selectAllPage.size() > 0){
								self.allCheck = true;
								$selectAllPage.prop('checked','true');
							}
							if((curpage == CURPAGE)&& (totalNum - limit > 0 )) {
								self.content.find('table tbody').find('.table-allcheck-tip').remove().end()
								.prepend('<tr class="table-allcheck-tip" ><td colspan="' + self.content.find('table th:visible').length + '"><span data-tip="已勾选' + checkedNum + tip.classify + tip.noun +'，">已勾选所有共' + self.data.total + tip.classify + tip.noun +'，</span><a id="selectCurrentPage" href="javascript:;" data-checked="false" data-tip="勾选本页' + tip.noun + '共' + checkbox.length + tip.classify +'">勾选本页' + tip.noun + '共<span class="boastful">'+checkbox.length+'</span>'+tip.classify+'</a></td></tr>');

							}
						} else if ( self.checkLength > checkbox.length){
							if(curpage == CURPAGE) {
								self.content.find('table tbody').find('.table-allcheck-tip').remove().end()
								.prepend('<tr class="table-allcheck-tip" ><td colspan="' + self.content.find('table th:visible').length + '"><span data-tip="已勾选' + checkbox.length + tip.classify + tip.noun +'，">已勾选' + self.checkLength + tip.classify + tip.noun +'，</span><a id="selectCurrentPage" href="javascript:;" data-checked="false" data-tip="勾选本页' + tip.noun + '共' + checkbox.length + tip.classify +'">勾选本页' + tip.noun + '共<span class="boastful">'+checkbox.length+'</span>'+tip.classify+'</a></td></tr>');
								//self.boastful(self.content.find('.boastful'), checkbox.length);
								self.boastful(self.content.find('.boastful'),checkbox.length);
							}

						} else {
							self.allCheck = false;
							self.content.find('table tbody').find('.table-allcheck-tip').remove();
						}

						//去掉class状态
						var btns_sup_mac = self.container.find('.common-content-tools a[data-request="true"][mac-support="true"]');
						var btns_no_sup_mac = self.container.find('.common-content-tools a[data-request="true"][mac-support="false"]');
						var has_mac = false;
						if(btns_sup_mac.length){
							btns_sup_mac.removeClass("available");
							btns_sup_mac.removeClass("freeze");
						}
						if(btns_no_sup_mac.length){
							btns_no_sup_mac.removeClass("available");
							btns_no_sup_mac.removeClass("freeze");
						}

						//重新添加class
						if (checkedNum > 0) {
							//遍历被选中的元素
							var checkedElements = self.content.find('table tbody input[type="checkbox"]:checked');
							checkedElements.each(function(i,el){
								var client_type = el.parentElement.parentElement.getAttribute('data-clitype');
								if(client_type == '5') //终端为mac
								{
									has_mac = true;
									return false;
								}
							})

							if(has_mac) //终端为mac
							{
								btns_sup_mac.addClass('available');
								btns_no_sup_mac.addClass('freeze');

							}else{
								self.container.find('.common-content-tools a[data-request="true"]').addClass('available');
							}
						} else {
							self.container.find('.common-content-tools a[data-request="true"]').removeClass('available');
							self.container.find('.common-content-tools a[data-request="true"]').removeClass('freeze');

						}
						return;
					},
					'.btn-filter': function() {
						var $self = $(this);
						var FILTER_URL = $self.data('filter_href') || '/client/client/filters';
						if ($self.hasClass('active')) {
							var height = $self.parents('.common-content-tools').next('.filter-choice').css('height').replace('px', '');
							if ($self.attr('data-auto-limit') == 'true') {
								$.changeHash({
									limit: parseInt($.changeHash().limit) + parseInt(parseInt(height) / 38)
								});
							}
							$.changeHash({
								tags: null,
								is_online:null,
								believe: null
							});
							$('.filter-choice').hide().empty()
							$self.removeClass('active');
						} else {
							$self.addClass('active');
							$.getJson(FILTER_URL, {}, true).then(function(data) {
								// 过滤掉平台中没有子项的数据

								var filterData = data.data["操作系统"], osList = [];
								if (filterData && filterData.length){
									for(var i = 0, len = filterData.length; i < len; i++) {
										if(filterData[i].sub_os){
											osList.push(filterData[i]);
										}
									}
									data.data["操作系统"] = osList;
								}
								var height = $self.parents('.common-content-tools').next('.filter-choice').empty().show().append($.tpl($('#' + $self.attr('data-tpl')).html(), data.data)).css('height').replace('px', '');
								if ($self.attr('data-auto-limit') == 'true') {
									$.changeHash({
										tags:'',
										limit: parseInt($.changeHash().limit) - parseInt(parseInt(height) / 38)
									});
								}
							})

						}
					},
					'.filter-choice label[filter=tags]': {
						'mouseenter':function(event){
							var container = $(this);
							var isAllchecked = container.prev('input').prop('checked');
							if (container.data('filterTimer')){
								// container.find('.os_box').slideDown()
								clearTimeout(container.data('filterTimer'));
								return;
							}
							$('.os_box').hide('fast');
							var position = $(this).closest('span').position();
							var height   = $(this).height() + 10 ;
							// var left     = (position.left - 150) < 0 ? 0 : position.left - 150;
							var left     = (position.left < 100?30:position.left)
							var hash     =  $.changeHash();
							container.find('.os_box').css({
								left:left,
								top:position.top + height,
							}).stop().slideDown('fast',function(){
								if (isAllchecked){
									container.find('input').prop('checked',isAllchecked);
								}
							});
						},
						'mouseleave':function(){

							var container = $(this);
							var filterTimer = setTimeout(function(){
								container.find('.os_box').stop().hide("fast");
								container.data('filterTimer',null);
							},400);
							container.data('filterTimer',filterTimer)
						}
					},
					'.filter-choice input': {
						change:function(e){
							var hash = $.changeHash();
							var filter = $(this).attr('filter');
							switch(filter){
								case 'tags':
									// var id = $(this).attr('id');
									var tags = [];
									$('input[filter=tags]:checked').each(function(){
										tags.push($(this).val());
									})
									$.changeHash({
										tags : tags.length ? tags.join(',') : null
									})
									break;
								case 'is_online':
									var input = $(this).closest('div').find('input:checked');
									$.changeHash({
										is_online: input.length == 1 ? input.val() : null
									});
									break;
								case 'type':
									var os_box = $(this).next('label').find('.os_box');
									os_box.length && os_box.find('input').prop('checked',$(this).prop('checked')).change();
									break;
								default:
									var input = $(this).closest('div').find('input:checked'),
										hashMap = {};

									hashMap[filter] = input.length == 1 ? input.val() : null;
									$.changeHash(hashMap);
									break;
							}

						}
					},
					'.filter-choice .subinput':{
						change:function(){
							var inputs = $(this).parents('ul').find('input');
							var chks   = $(this).parents('ul').find('input:checked');
							var p_inpt   = $(this).parents('label').prev('input');
							var os_type = [];
							var tags    = []

							if ( chks.length > 0 && chks.length === inputs.length ){
								p_inpt.removeClass('checkbox_true_part').prop('checked',true);
							}else if( chks.length > 0 ){
								p_inpt.addClass('checkbox_true_part').prop('checked',false);
							}else{
								p_inpt.removeClass('checkbox_true_part').prop('checked',false);
							}
							chks.each(function(){
								os_type.push($(this).val());
							})
							$(this).parents('label').attr('os_type',os_type.join(','));
						}
					},

					'.filter-empty': function() {
						// var filterData = {}, filterKey = $(this).closest('.filter-choice').data("filter-key");
						$('.btn-filter').click();
						// $('.filter-choice').hide().empty();
						// $('.btn-filter').removeClass('active');
						// $.changeHash({
						// 	tags: null,
						// 	is_online:null,
						// 	believe: null
						// });
						// filterData[filterKey ? filterKey : "tags"] = null;
						// $.changeHash(filterData);
					},
					'.export': function() {
						var pars = $.changeHash();
						pars["export"] = true;
						//自定义列
						if(typeof(defaultColNames) != "undefined" && typeof(allColumns)!= "undefined" && typeof(allColumns.length) != "undefined"){
							var columns = {},exportCols = [];
							defaultColNames.forEach(function(d){
								var tmpCol = allColumns.filter(function(col){
									return col.id == d;
								});
								if(tmpCol.length > 0){
									exportCols.push(tmpCol[0]);
								}
							});
							exportCols.forEach(function(col){
								columns[col.id] = col.label;
							});
							pars["columns"] = columns;
						}

						$.postData(self.url, pars, true).then(function() {
							$.tips('操作成功，完成后您将从通知中心收到消息提醒！', true);
						})
					},
					'.table-swtich .swtich-btn': function() {
						var $this = $(this);
						// $this.parent().find('.swtich-btn').removeClass('active');
						// $this.addClass('active');
						var obj = $.queryUrl($this.attr('data-pars'));
						obj[$this.parent().attr('data-key')] = $this.attr('data-value');
						$.changeHash({ // 请求参数初始化
							tags:       null,
							is_online:  null,
							start:      null,
							page:       null,
							sort:       null,
							asc:        null,
							search_col: null,
							search_key: null
						});
						$.changeHash(obj);
						self.replaceContentFlag = false;
						self.hash = $.changeHash();
					},
					'tr td a[data-request="true"]': {
						'click': function() {
							var obj = {};
							obj = $.extend({}, obj, $.queryUrl($(this).attr('data-pars')));
							obj[$(this).parents('tr').attr('data-key')?$(this).parents('tr').attr('data-key'):"mids"] = $(this).parents('tr').attr('data-id');

							self.commonBtnEvent(this, obj, 0, false, true);
							return false;
						}
					},
					'a[data-dialog="true"]':{
						'click':function(){
							var _this = $(this);
							$.popup({
								title: _this.attr('data-title'),
								url: '/security/index/detail',
								width:_this.attr('data-width'),
								height:_this.attr('data-height')
							});
						}
					}
				});
			},
			//通过button的click事件
			commonBtnEvent: function(el, keysData, length, callback) {
				el = $(el);
				var url = el.attr('href') || el.attr('data-url');
				if (!url) {
					return;
				};
				//beforeSend事件
				var result = $.event.trigger('beforeSend', keysData, el[0]);
				var self = this;
				$.getPromise(result, result).then(function(data) {
					data = data || {};
					var panel;
					var pars = $.queryUrl(el.attr('data-pars'));
					var confirm = el.attr('data-confirm');
					var confirmMinNum = el.attr('data-confirm-min') | 0;
					var showConfirm = confirm;
					if (confirm && confirmMinNum && length <= confirmMinNum) {
						showConfirm = false;
					};
					var reload = el.attr('data-reload') == 'false' ? false : true;
					pars = $.extend(pars, keysData, data);

					function operate() {
						var hash = $.changeHash();
						delete hash.url;
						pars = $.extend(hash, pars);
						$.postData(url, pars, true).then(function(data) {
							$.tips("操作成功", true);
							callback && callback();
							if (reload) {
								setTimeout(function() {
									self.request();
								}, 1000)
							};
						}).always(function() {

						})
					}
					if(showConfirm){
						/*$.popup({
							title: '提示',
							content: '<p class="confirm-tip">'+confirm+'</p>',
							confirm: {
								text: '确认',
								callback: function(self) {
									operate();
									self.close();
								}
							},
							cancel: {
								text: '取消',
								callback: function(self) {
									self.close();
								}
							},
							closeTrigger: 'cancel'
						});*/
						$.confirm({
							message:confirm
						}).done(function(result){
								operate()
						})
					}else{
						operate();
					}

				})
			},
			//获取选定的行数
			getSelectedRows: function(str) {
				var checkbox = this.content.find(this.checkboxStr);
				if (checkbox.length === 0) {
					return '';
				};
				if (this.allCheck) {
					return 'ALL';
				}
				var ids = [];
				checkbox.each(function() {
					if (!this.checked) {
						return;
					};
					var tr = $(this).parents("tr");
					var id = $(this).attr('data-id') ? $(this).attr('data-id') : tr.attr("data-id");
					ids.push(id);
				});
				return str ? ids.join(',') : ids;
			},

			// 获取反选的行数
			getExceptRows: function(){
				var except = [];
				var container = self.container || $('.common-content-main');
				container && container.find('table tbody input[type=checkbox]').each(function(){
					if ( !$(this).is(':checked') ){
						except.push( $(this).attr('data-id') || $(this).parents('tr').attr('data-id') )
					}
				})
				return except.join(',');
			},

			/**
			 * 替换主体内容
			 * @param  {[type]} tpl [description]
			 * @return {[type]}     [description]
			 */
			replaceContent: function(tpl) {
				tpl = $.tpl($('#' + tpl).html());
				this.content.html(tpl);
				this.replaceContentFlag = true;
				// var tags = this.content.find('.lists-tab-tags01');
				// var hash = $.changeHash();
				// var self = this;
				// tags.each(function(){
				//     var $this = $(this);
				//     var name = $(this).attr('data-name');
				//     var el;
				//     if (name && hash[name]) {
				//         el = $this.find('a[data-value="'+hash[name]+'"]');
				//     }
				//     if (!el || el.length == 0) {
				//         el = $this.find('a:first');
				//     };
				//     el.addClass('cur');
				//     var obj = {};
				//     obj[name] = el.attr('data-value');
				//     $.changeHash(obj);

				//     var tpl = el.attr('data-tpl');
				//     if (tpl) {
				//         tpl = $.tpl($('#' + tpl).html());
				//         self.container.find('.lists-tag-cont').html(tpl);
				//     };
				// })
				this.tableSort();
				this.replaceContentEvent();
			},
			//表格排序
			tableSort: function() {
				var tbl = this.container.find(".common-table");
				var self = this;
				$.tableFieldSort(tbl, function() {
					// return self.request();
				}).run();
			},
			//替换内容后的自定义事件
			replaceContentEvent: function() {
				//替换内容后
				if (!this.container.data("changeContent")) {
					this.container.data("changeContent", 1);
					this.container.trigger("changeContentOnce", [this]);
				};
				this.container.trigger("changeContent", [this]);
			},
			afterRequestEvent: function(data) {
				//请求完成后
				if (!this.container.data("afterRequest")) {
					this.container.data("afterRequest", 1);
					this.container.trigger("afterRequestOnce", [data, this]);
				};
				this.container.trigger("afterRequest", [data, this]);
			},
			beforeRequestEvent: function() {
				//请求前触发
				if (!this.container.data("beforeRequest")) {
					this.container.data("beforeRequest", 1);
					this.container.trigger("beforeRequestOnce", [this]);
				};
				this.container.trigger("beforeRequest", [this]);
			},
			//发送数据请求
			request: function(name, value) {
				var self = this;
				var requestData = self.hash;
				var data = name || {};
				if (name && typeof name === 'string') {
					data = {};
					data[name] = value;
					//使用传来的参数（之前一直没有使用）
					requestData[name] = value;
				} else {
					for(var i in data){
						requestData[i] = data[i];
					}
				}
				var url = self.url;

				$('.common-content-tools a[data-request="true"]').removeClass('available');
				$('.common-content-tools a[data-request="true"]').removeClass('freeze');


				if (self.xhr && self.xhr.abort) self.xhr.abort();

				$.loading.show();

				// console.log(self.hash,requestData);
				self.xhr = $.getJson(url, self.hash, true).done(function(data) {

					if(data.result){
						$.tips(data.reason?data.reason:'未知错误');
						return false;
					}
					self.data = data.data;
					self.data.list = data.data.list || data.data.clients;
					self.renderData(self.data);
					//self.renderCustomColumn(self.data);
					self.setDataNums(self.data);
					self.setCrumbs(self.data);
					return data;
				}).always(function(data) {
					self.afterRequestEvent(data.data || data);
					$.loading.hide();
					//确保在载入完成后，保证载入过程中点击的checkbox无效
					self.checkLength = 0;
					// console.log(self.checkLength);
				}).xhr;
				return true;
			},
			//如果当前页没有数据，（且比数据最大页小），且页数大于1，可以通过该方式返回到上一页
			goToPrevPage: function(num) {
				var hash = $.changeHash();
				var page = hash.page | 0;
				var limit = (hash.limit | 0) || this.defaultLimit;
				if (page < 2) {
					return false;
				};
				//小于数据最大页，则回到上一页，否则回到数据最大页
				if(page <= num){
					var start = (page - 2) * limit;
					page = page - 1;
				} else {
					page = num;
					start = (page - 1) * limit;

				}

				this.request({
					start: start,
					// page: page - 1
					page : page
				});
				return true;
			},
			//渲染数据
			renderData: function(data) {
				//如果不是表格，则可以通过自定义事件afterRequest进行渲染
				this.allCheck = false;
				var table = this.container.find(".common-content-table table");
				if (table.length == 0) {
					return true;
				};
				//如果有数据但当前页面没有数据，则返回到上一页或者数据的最大页（防止很多上一页依然没有数据）
				if (data.list && data.list.length === 0 && data.total > 0) {
					var num = Math.ceil(data.total/$.changeHash().limit);
					if (this.goToPrevPage(num)) {
						return true;
					}
				};
				var checked = false;
				var selectAllPage = $('#selectAllPage,label[for="selectAllPage"]');
				var hasNext = data.total > data.list.length;
				// selectAllPage[hasNext ? "show" : "hide"]();
				if ((data.list == undefined) || (data.list && data.list.length === 0)) {
					$('#selectAllPage').attr('checked', false);
					$('#selectCurrentPage, #selectAllPage').prop("disabled", true);
					var length = table.find('thead tr th:not(.none)').length;
					var domWithMessage = this.container.find('.lists-tab li.cur a');
					var message = domWithMessage.size() ?
									domWithMessage.attr('data-empty-message') :
									this.container.find('.table-swtich a.active').attr('data-empty-message');
					var tpl = '<tr><td colspan="' + length + '">' + (message || "查询数据为空") + '</td></tr>';
				} else {
					$('#selectAllPage').attr('checked', false);
					$('#selectAllPage').attr('disabled', false);
					if ($('#selectAllPage').attr('checked')) {
						$('#selectCurrentPage').attr('checked', false);
						checked = true;
					}
					var tpl = $.tpl($('#' + table.attr('data-tpl')).html(),data);
				}
				table.find("tbody").html(tpl);
				this.setStatus(this);

				if (table.attr('data-head')) {
					var tpl_head = $.tpl($('#' + table.attr('data-head')).html(),data);
					table.find("thead").html(tpl_head);
				}
				//渲染自定义列的表头
				if(table.attr('data-head-custom')){
					var tpl_head_custom = $.tpl($('#' + table.attr('data-head-custom')).html(),selectedCols);
					table.find("thead").html(tpl_head_custom);

					//渲染排序icon
					table.find('tr th[data-sort]').each(function() {
						var i = $(this).find('span i');
						if (i.length < 1) {
							$('<i></i>').appendTo($(this).find('span'));
						};
					});
				}
				if (checked) {
					var checkbox = this.content.find('table tr input[type="checkbox"]:not(:disabled)');
					checkbox.each(function() {
						this.checked = checked;
					})
				};
				this.renderPager(data);
				this.replaceContentEvent(data);
			},
			//渲染分页
			renderPager: function(data) {
				var self = this;
				self.container.find(".pager").unbind();
				var hash = $.changeHash();
				if (!hash.limit) return;
				$.pager(self.container.find(".pager"), data.total / ((hash.limit | 0) || self.defaultLimit), 0, function(data) {
					hash = $.changeHash();
					if (data.page && hash.limit) {
						var start = (data.page - 1) * (hash.limit | 0);
						$.changeHash({
							start: start,
							page: data.page
						})
					};
				}, data.total).run();
			},
			//显示查询的数目
			setDataNums: function(data) {
				var els = this.container.find('i.num');
				var numselector = this.container.attr('data-num-selector');
				if (numselector) {
					els = els.add($(numselector).find('i.num'));
				};
				els.each(function() {
					var item = $(this);
					var key = item.attr('data-key');
					if (key) {
						item.html(data[key] || 0);
					};
				})
			},
			//设置提示语
			setCrumbs: function(data) {
				var selector = this.container.attr('data-crumbs');
				if (!selector) {
					return false;
				};
				var curLi = this.container.find('.lists-tab ul li.cur');
				var crumbs = curLi.attr('data-crumbs');
				if (crumbs) {
					crumbs = crumbs.replace(/\{\$(\w+)\}/g, function(a, b) {
						return data[b];
					});
					$(selector).html(crumbs);
				};
			},
			//单点checkbox
			setStatus : function(self) {
				if(self.hash.level) {
					var level = (self.hash.level).split(',');
					for(var i = 0 ; i < level.length ; i ++) {
					if(level[i] == 1) {
						$('#sugClean').prop('checked',true);
					} else if(level[i] == 2) {
						$('#opClean').prop('checked',true);
					} else if(level[i] == 4) {
						$('#sugSave').prop('checked',true);
					}
				}
				}
			},
			//获取自定义的全选提示
			getCustomTip: function() {
				var tip  = {};
				var self = this;

				if (self.container.find('.table-swtich').length > 0) {
					var $current = self.container.find('.table-swtich a.active');
				} else {
					var $current = self.container;
				}
				tip.noun     = $current.attr('data-noun') || '条目';
				tip.classify = $current.attr('data-classify') || '个';

				return tip;
			},
			run: function() {
				this.beforeRequestEvent();
				this.hash = $.changeHash();
				this.changeTab();
			}
		}
	})

	return $.table;

})