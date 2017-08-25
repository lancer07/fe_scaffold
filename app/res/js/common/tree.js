define('res/js/common/tree', ['vendor/jquery.zTree/js/jquery.ztree.all-3.5', 'res/js/common/ipfilter', 'res/js/common/popup', 'res/js/common/group-dropdown'], function() {

	var groupList = [];
	var hasPeimitNodes = [];
	var vm_types = {
		"1":"H3C CAS",
		"2":"Citrix XenServer",
		"3":"oVirt Engine",
		"4":"VMware vCenter",
		"5":"Hyper-V",
		"7":"云端时代 VDI桌面",
		"8":"Huawei FusionCompute",
		"9":"Cnware WinCenter",
		"10":"RHEV Manger",
		"11":"Tong oCloud"
	}
	var isVirtual = $('.nav-group ul').attr('tree_type') === 'virtual_tree';
	var isInterchanger = $('.nav-group ul').data('root') == "交换机";
	var treeUrl = $('.nav-group ul').data('url') || '/client/group/listall';
	var updateUrl = $('.nav-group ul').data('update') || '/client/group/update';
	var deleteUrl = $('.nav-group ul').data('delete') || '/client/group/delete';
	if (isVirtual){
		treeUrl = '/virtual/index/gettree';
	}

	function addHoverDom(treeId, treeNode) {
		if (treeNode.id === 0) {
			return;
		}

		if ($('#editBtn_' + treeNode.tId).length > 0 || $('#deleteBtn_' + treeNode.tId).length > 0) {
			$('#editBtn_' + treeNode.tId + ',#deleteBtn_' + treeNode.tId).show();
			return;
		}
		//移除编辑和删除ICON
		$('#editBtn_' + treeNode.tId + ',' + '#deleteBtn_' + treeNode.tId).remove();

		var aObj = $("#" + treeNode.tId + "_span").css({
			'padding-right': '0'
		});
		var editbtn = $("<i  gid='" + treeNode.id + "' tid='" + treeNode.tId + "' id='editBtn_" + treeNode.tId + "' ' class='fa fa-pencil-square-o edittree' title=" + '编辑' + "></i>");
		if(treeNode.id === 1 && !isVirtual && !isInterchanger)
			editbtn = $("<i  gid='" + treeNode.id + "' tid='" + treeNode.tId + "' id='editBtn_" + treeNode.tId + "' ' class='fa fa-cog edittree' title=" + '编辑' + "></i>");
		var deletebtn = $("<i gid='" + treeNode.id + "' tid='" + treeNode.tId + "' id='deleteBtn_" + treeNode.tId + "' ' class='fa fa-trash-o deletetree' title=" + '删除' + "></i>");
		// if (treeNode.node_type !=='machine'){
		// 	//deletebtn.insertAfter(aObj);
		// 	if (treeNode.id !== 1 || isVirtual) {
		// 		deletebtn.insertAfter(aObj);
		// 	}
		// 	editbtn.insertAfter(aObj);
		// }
		// editbtn.insertAfter(aObj);
		if(isVirtual) {
            if(treeNode.node_type === 'host') {
                deletebtn.insertAfter(aObj);
                editbtn.insertAfter(aObj);
            }
        } else {
            if ( 1 !== treeNode.id  && "默认分组" !== treeNode.name ) {
                deletebtn.insertAfter(aObj);
                editbtn.insertAfter(aObj);
            }
            else if ( 1 === treeNode.id  && "默认分组" === treeNode.name ) {            	
                editbtn.insertAfter(aObj);
            }
        }

		if (isInterchanger){
			deletebtn.insertAfter(aObj);
		}
		editbtn.on('click',function(){
					var editBtn = $(this);
					if (editBtn.prop('disabled')) return;
					editBtn.prop('disabled',true);
					var tid = editBtn.attr('tid');
					var gid = editBtn.attr('gid');
					var treeNodeTag = tree.zTreeObj.getNodesByParam('id',gid,null)[0];
					if (isVirtual){	//虚拟化主机详情

						$.getJson('/virtual/index/gethostinfo/',{search_id:treeNode.search_id},true).then(function(res){
							var vm_type = res.data.vm_type;
							res.data.vm_type = vm_types[vm_type];
							$.popup({
								title:'主机详情',
								content:$.tpl($('#host_edit').html(),res.data),
								confirm:{
									text:'重新连接',
									callback:function(self){
										var $confirmBtn = $(self.content).find('button.popup-footer-confirm');
										if ($confirmBtn.prop('disabled')) return;
										$confirmBtn.prop('disabled',true);
										var params = {
											operate_type: 1,
											type:         vm_type,
											search_id:    treeNode.search_id,
											user_name:    $.trim($('#edit_account').val()),
											pass_wd:      $.trim($('#edit_pass').val()),
											ip:           $('#edit_ip').text(),
											port:         $.trim($('#edit_port').val()),
											protocol:     $('#edit_protocal').val()
										}
										if (!params.user_name){
											$confirmBtn.prop('disabled',false);
											$('#edit_account').focus();
											return $.tips('用户名不能为空',false,2000);
										}
										if( $('#edit_port').is(':visible') && !portCheck(params.port) ){
											$confirmBtn.prop('disabled',false);
											$('#edit_port').focus();
											return $.tips('请输入一个合法的端口（1-65535范围内正整数）',false,2000);
										}
										$.postData('/virtual/import/import',params,true).done(function(res){
											if (res.result){
												$confirmBtn.prop('disabled',false);
												return $.tips(res.reason,2000,false);
											}
											$.tips('修改主机详情成功',3000,true);
											self.close();
										}).fail(function(){
											$confirmBtn.prop('disabled',false);
										})

									}
								},
								popupDone:function(self){
									$('#edit_protocal:visible').val(res.data.protocol);
									$('#edit_account').focus();
									var $popupBody = $(self.content);
									var $confirmBtn = $(self.content).find('button.popup-footer-confirm');
									$popupBody.find('input').on('keydown',function(e){
										if (e.keyCode === 13){
											$confirmBtn.click();
										}
									})

								},
								closeTrigger: 'cancel',
								beforeClose:function(self){
									var $popupBody = $(self.content);
									var $confirmBtn = $(self.content).find('button.popup-footer-confirm');
									$popupBody.find('input').unbind('keydown');
									$confirmBtn.prop('disabled',false);
									editBtn.prop('disabled',false);
								}
							})
						})


					}else{
						if(gid == 1 && !isInterchanger){
							$.getJson('/client/group/info?gid=' + gid).then(function(res){
								$.popup({
									title: '自动分组设置',
									content: $.tpl($('#editDefautTpl').html(), {name: treeNode.name, data: res.data}),
									confirm: {
										text: '确认',
										callback: function(self) {
											var ip_rules = [];


											var autoip=0;
											if ( $('#assetSwitch').is(':checked') ) {
												autoip=2;
											}

											var data = {
												gid: gid,
												auto_ip_grouping: autoip,
												name: '默认分组',
												pid: 0,
												ip_rules: ip_rules.join(',')
											}
											$.postData(updateUrl, data, true).then(function(res) {
												if (res.reason == 'success') {
													$.tips('编辑分组成功！', true);
													location.reload();
													self.close();
												}
											})
										}
									},
									cancel: {
										text: '取消',
										callback: function(self) {
											//deferedForTags.reject();
											self.close();
										}
									},
									closeTrigger: 'cancel',
									beforeClose: function() {
										editBtn.prop('disabled',false);
									}
								});
							})
						}
						else{
							$.getJson('/client/group/info?gid=' + gid).then(function(res){
								$.popup({
									title: '编辑分组',
									content: $.tpl($('#editTpl').html(), {name: treeNode.name, data: res.data}),
									confirm: {
										text: '确认',
										callback: function(self) {
											var ip_rules = [];

											if ( $('#group-name').val() == '' ) return $.tips('请输入分组名');

											if ( $('#ipSwitch').is(':checked') && $('#acSwitch').is(':checked')) {

												$('.ip-list-view p').each( function(index, el) {
													ip_rules[index] = $(this).find('.ip_rule').eq(0).text() + '-'
																		+ $(this).find('.ip_rule').eq(1).text();
												});

												if ( ip_rules.length <= 0 ) return $.tips('请先添加IP段', false);
											}
											var autoip=0;
											if($('#acSwitch').is(':checked')){
												if($('#ipSwitch').is(':checked')){
													autoip=1;
												}
												else
													autoip=2;
											}
											var data = {
												gid: gid,
												auto_ip_grouping: autoip,
												name: $('#group-name').val(),
												pid: $('.selectedGroup').attr('data-id'),
												ip_rules: ip_rules.join(',')
											}

											$.postData(updateUrl, data, true).then(function(res) {
												if (res.reason == 'success') {
													$.tips('编辑分组成功！', true);
													location.reload();
													self.close();
												}
											})
										}
									},
									cancel: {
										text: '取消',
										callback: function(self) {
											//deferedForTags.reject();
											self.close();
										}
									},
									closeTrigger: 'cancel',
									popupDone: function() {
									$('.help_tip').helper();
										$('#acSwitch').on('change', function() {
											if ($(this).is(':checked')) {
												$('input[name="auto_ip_grouping"]').attr('disabled',false);
												$('#ipSwitch').attr('checked',true);
												$('.ip-list').stop().slideDown('fast');
											} else {
												$('input[name="auto_ip_grouping"]').attr('disabled',true);
												$('.ip-list').stop().slideUp('fast');
											}
										});
										$('input[name="auto_ip_grouping"]').on('change', function() {
											if ($(this).val()=='1') {
												$('.ip-list').stop().slideDown('fast');
											} else {
												$('.ip-list').stop().slideUp('fast');
											}
										});

										$.when($('.group-dropdown').groupDropdown(false,true)).done(function(obj){
											obj.initSelectNode(treeNode.pId);
											if(!treeNode.pId == 0){
												obj.hideNode(treeNode.pId);
											}
											obj.hideNode(1);
											$('.edit-box').parents('.popup-body').css('overflow','visible');
											$('#addIpfields').on('click', function() {
												var ip_rules = $.getIp('.edit-box .ipfilter');
												if (ip_rules.length != 2) {
													return;$.tips('请输入完整IP');
												}
												$('.ip').val('');
												$('.ip-list-view').show();
												$('.ip-list-view').append($('<p><span class="ip_rule">' + ip_rules[0] + '</span><span class="ipdivider">-</span><span class="ip_rule">' + ip_rules[1] + '</span><i class="remove_ip_rule fa fa-remove"></i></p>'));
											})

											$('.ip-list-view').delegates({
												'.remove_ip_rule': function() {
													$(this).parent('p').remove();
													if ( $('.ip-list-view').children('p').length <= 0 ) {
														$('.ip-list-view').hide();
													}
												}
											})
										})

									},
									beforeClose: function() {
										editBtn.prop('disabled',false);
									}
								});
							})
						}
					}

					return false;
				})


		deletebtn.on('click',function(){
			    var delBtn = $(this);
			    if (delBtn.prop('disabled')) return;
			    delBtn.prop('disabled',true);
				var tid      = delBtn.attr('tid');
				var gid      = delBtn.attr('gid');
				var treeNode = tree.zTreeObj.getNodesByParam('id',gid,null)[0];
				if (isVirtual){

					// TODO deleteHost
					$.confirm('确定删除','是否删除'+treeNode.name).done(function(){
						$.getJson('/virtual/index/delvmhost/',{search_id:treeNode.search_id},true).done(function(res){
							$.tips('删除成功',2000,true);
							var href = location.href.replace(/gid=[0-9]+/,'gid=0');
							window.location.href = href;
							window.location.reload();
						}).fail(function(err){
							$.tips(err.reason,2000,false);
						})
					}).fail(function(){
						delBtn.prop('disabled',false);
					});

				}else{

					$.popup({
						title: '删除分组',
						content: $.tpl($('#deleteTpl').html(), {
							groupList: groupList
						}),
						confirm: {
							text: '确认',
							callback: function(self) {
								/*var tags = [];
								$('.tips-label input:checked').each(function(){
									tags.push(this.value);
								})
								deferedForTags.resolve({add_tags:tags.join(','),gid:0});
								*/
								if($('.delete-box').attr('data-id') == '1' && $('.selectedGroup').attr('data-id') =='0'){
									$.tips('不能直接分组到全网计算机');return;
								}
								var data = {
									gid: gid,
									movegid: $('.selectedGroup').attr('data-id')
								}
								$.postData(deleteUrl, data, true).then(function(res) {
									if (res.reason == 'success') {
										self.close();
										setTimeout(function(){
											$.changeHash({
												gid:0
											})
											location.reload();
										},1500)
									}
								});
							}
						},
						cancel: {
							text: '取消',
							callback: function(self) {
								//deferedForTags.reject();
								self.close();
							}
						},
						closeTrigger: 'cancel',
						popupDone:function(){
							$.when($('.group-dropdown').groupDropdown(false,true)).done(function(obj){
								obj.initSelectNode(treeNode.pId);
								obj.expandNode(treeNode.pId);
								obj.hideNode(treeNode.id);	//隐藏当前分组
								$('.delete-box').parents('.popup-body').css('overflow','visible');
							});
						},
						beforeClose:function(){
							delBtn.prop('disabled',false);
						}
					});
				}
				return false;
		})
	}

    function isParent(list, node) {
        $(list).each(function(index, el) {
            var pid = el.pid || el.pId;
            if (el.pid == node.id) return true;
        });
        return false;
    }

    function removeHoverDom(treeId, treeNode) {
        var id = treeNode.tId + '_span';
        var $span = $('#' + id);
        var $this = $('#' + id).parents('li');
        $('#editBtn_' + treeNode.tId + ',#deleteBtn_' + treeNode.tId).hide();
        if (!$this.hasClass('active')) {
            // $span.removeClass('text-ellipsis').css('width', 'auto');
            $this.find('>.lonely_bg').remove();
            $('#editBtn_' + treeNode.tId + ',#deleteBtn_' + treeNode.tId).hide();
        }
        $this.removeClass('cur');
    }


    var tree = {
        zTreeObj: null,
        def: null,
        init: function() {
            var self = this;
            self.def = $.Deferred();
            if ($('.nav-group').length == 0) {
                return;
            } else {
                var addDiyDom = function(treeId, treeNode) {
                    var aObj = $("#" + treeNode.tId + "_a");
                    //if ($("#diyBtn_" + treeNode.id).length > 0) return;
                    // var icon = $("<i class='fa fa-desktop' title="+treeNode.name+"></i>")
                    // icon.insertBefore(aObj);

                    // 区分虚拟化下的ICON
                    var icon = null;
                    switch(treeNode.isGroupNode){
                        case true:
                            icon = 'fa-sitemap';
                            break;
                        case false:
                            icon = 'fa-desktop';
                            break;
                    }

                    //区分虚拟化下导入状态的ICON
                    if (isVirtual) {
                        if (treeNode.node_type === 'host' && treeNode.id !== 0) {
                            if (treeNode.status == 2) {
                                icon = 'vm_types success ';
                            } else {
                                icon = 'vm_types false ';
                            }

                            icon += vm_types[treeNode.plat_type];

                            // 图标改成单个文件，特殊处理
                            if(treeNode.plat_type == 1) {
                            	if(treeNode.status == 2) {
	                            	icon = " node-icon H3C-success ";
                            	} else {
                            		icon = " node-icon H3C-fail ";
                            	}
                            }

                        } else if (treeNode.node_type === 'machine') {
                            icon = treeNode.status === 'online' ? 'machine online' : 'machine offline';
                        } else if ( treeNode.node_type === 'folder') {
                            icon = " node-icon icon-folder ";
                        } else if ( treeNode.node_type === 'dataCenter') {
                            icon = " node-icon icon-data-center ";
                        } else if ( treeNode.node_type === 'cluster') {
                            icon = " node-icon icon-cluster ";
                        } else if ( treeNode.node_type === 'resourcePool') {
                            icon = " node-icon icon-resource-pool ";
                        } else if ( treeNode.node_type === 'pool') {
	                        // 特殊处理Xen平台的pool图标
                            icon = " node-icon icon-cluster ";
                        } else if ( treeNode.node_type === 'hostPool') {
	                        // 特殊处理Xen平台的pool图标
                            icon = " node-icon icon-host-pool ";
                        }
                    }

                    // var icon = treeNode.isGroupNode ? 'fa-sitemap' : 'fa-desktop';
                    treeNode.reason = treeNode.reason && treeNode.reason.replace(/\s/g, '&nbsp;');
                    var iconElement = $("<i class='fa " + icon + "' title=" + treeNode.reason + "></i>");
                    iconElement.insertBefore(aObj);

                };
                $.getJson(treeUrl, {
                        // include_level: true
                    }, true).then(function(data) {
                        // stripScript(data.data.list);
                        groupList = [];

                        var glist = data.data.list || data.data.tree_array.group_tree;
                        if (data.data.cvm && data.data.cvm.length !== 0){
                            $('.nav-group ul').data('cvms',data.data.cvm);
                        }

                        var wholeNet = {
                            id: 0,
                            gid: 0,
                            name: $('.nav-group ul').data('root') || '全网计算机',
                            isGroupNode: true
                        };
                        for(var index in glist){
                            var group = glist[index];
                            groupList[index] = {
                                pId:         undefined != group.pid ? group.pid : group.pId,
                                name:        group.display_name || group.name,
                                id:          group.id,
                                isGroupNode: true,
                                // isParent:    isParent(glist, group) ? true : false,
                                has_permit:  group.has_permit,
                                search_id:   group.search_id,
                                node_type:   group.node_type,
                                status:      group.status,
                                plat_type:   group.plat_type,
                                reason:      group.node_type==="machine"?group.status==='online'?"设备在线":"设备离线":group.reason || ''
                            };
                        }
                        groupList.push(wholeNet);
                        var setting = {
                            view: {
                                fontCss: {
                                    "color": "#666",
                                    "font-size": '12px'
                                },
                                addDiyDom: addDiyDom,
                                addHoverDom: addHoverDom,
                                removeHoverDom: removeHoverDom
                            },
                            // check:{
                            //  enable: true,
                            //  chkStyle: "checkbox",
                            // },

                            data: {
                                keep: {
                                    leaf: true
                                },
                                simpleData: {
                                    enable: true,
                                    idKey: 'id',
                                    pIdKey: 'pId',
                                    // 设置根节点为"全网计算机"
                                    rootPId: 0
                                }
                            },

                            callback: {
                                onExpand: function(e, treeId, treeNode) {
                

         //                            var position = $('#' + treeNode.tId).position();
					
									// var left = position.left;
									// var top = position.top - 40 + $('.au-group').scrollTop();
									
									// $('.au-group').animate({
									// 	scrollLeft: left,
									// 	scrollTop: top
									// }, '400');
                                    
                                    if(isVirtual) {
                                        $(".lonely_bg").css({left: 0}).width(getLonelyWidth());
                                    } else {
                                        $(".lonely_bg").css({left: "-100%", width: "200%"})
                                    }
       
                                },
                                onNodeCreated: function(event, treeId, treeNode) {
                                	var space = "", contianerWidth = isVirtual?210:64;
                                	for(var i = 0, len = treeNode.level; i < len; i++) {
                                		space += "<span class='space'></span>";
                                	}
                                	
                                	$('#' + treeNode.tId).prepend(space);
                                    $('#' + treeNode.tId).find('#' + treeNode.tId + '_span').addClass('text-ellipsis').css('max-width', contianerWidth);
                                },
                                onClick: function(e, treeId, treeNode) {
                                    if(window.isNormal === true && treeNode.id === 0){
                                        $.tips("你没有所选分组的管理员权限, 请选择有权限的分组或联系账号管理员、超级管理员设定分组权限")
                                        return;
                                    }
                                    //用户信息
                                    if($('#userapplylist').length > 0){
                                        $('#userinfolist').show();
                                        $('#userapplylist').hide();
                                        if(table){
                                            table = $.table('#userinfolist', true, false);
                                        }
                                        else
                                            var table = $.table('#userinfolist', true, false);

                                        $.changeHash({
                                            t:new Date()*1,
                                            limit : 12,
                                            start: 0,
                                            page: 1,
                                            gid: treeNode.id
                                        });
                                    }
                                    else{
                                        $.changeHash({
                                            gid: treeNode.id,
                                            start: 0,
                                            page: 1,
                                            search_id:treeNode.search_id,
                                            node_type:treeNode.node_type,
                                            search_key: null,
                                            search_col: null
                                        });
                                    }
                                    try {
                                        //去除搜索条件
                                        clearSearch( $('#clear') )
                                    } catch (e) {

                                    }

                                    var tid = treeNode.tId;
                                    var $this = $('#'+tid);
                                    var $span = $('#'+tid+'_span');
                                    $('.nav-group').trigger('treeClick', [treeNode.id, treeNode]);

                                    //*清除其它a标签的HOVER状态；
                                    $('.ztree').find('li').removeClass('active');

                                    // $('.text-ellipsis').css('width','auto');
                                    // $('.ztree').find('li a span').removeClass('text-ellipsis');
                                    $('.ztree').find('li').find('>.lonely_bg').remove();


                                    if($this.find('>.lonely_bg').length==0){
                                        var width =Math.max(60- ($this.offset().left - $('.ztree').offset().left), 64) + 'px'
                                        // $span.addClass('text-ellipsis').css('width', width);

                                        $('<div class="lonely_bg"/>').prependTo($('#' + tid));
                                    }

                                    $this.addClass('active');

                                    if(isVirtual) {
                                        $(".lonely_bg").css({left: 0}).width(getLonelyWidth());
                                    } else {
                                        $(".lonely_bg").css({left: "-100%", width: "200%"})
                                    }
                                }
                            },
                            edit: {
                                enable: false
                            }

                        }
                        self.zTreeObj = $.fn.zTree.init($('.nav-group ul'), setting, groupList);
                        self.initEvent();
                        //self.initGid();

                        // 普通管理员不能访问全网节点，默认选中全网下第一个有权限的分组
                        var tmpGid = $.changeHash().gid || 0 ;
                        if (window.modules_type === 41 && window.isNormal === true && tmpGid == 0) {
                            var nodes = self.zTreeObj.getNodes(),
                                rootNodes = nodes ? nodes[0] : {children: []},
                                initGid = 0;


                            findHasPermitNode(rootNodes)
                            if(hasPeimitNodes.length !== 0){
                                $.changeHash({
                                    gid: hasPeimitNodes[0].id,
                                    start: 0,
                                    page: 1
                                });
                            }
                        }
                        self.initSelectNode();
                        self.def.resolve(self.zTreeObj);
                        // $('#group_ul').trigger('groupready', [self.zTreeObj]);
                    })
            }
        },
        initSelectNode: function() {
            var tree     = this.zTreeObj;
            var gid      = $.changeHash().gid || 0;
            var node     = tree.getNodesByParam('id', gid, null)[0];
            var rootNode = tree.getNodesByParam('id', 0, null)[0];
            tree.expandNode(rootNode);
            
            if (!node){
                var href = location.href.replace(/gid=(-?\d)+/,'gid=0');
                window.location.href = href; 
                node = rootNode;
            }

            if(node) {
                tree.selectNode(node);

                setTimeout(function(){
                    if ($('#' + node.tId).find('>.lonely_bg').length == 0) {
                        $('<div class="lonely_bg"/>').prependTo($('#' + node.tId));
                    }

                    var width = Math.max(60 - ($('#' + node.tId).offset().left - $('.ztree').offset().left), 64) + 'px'
                    // $('#' + node.tId + '_span').addClass('text-ellipsis').css('width', width);
                    $('#' + node.tId).addClass('active');
                    if(isVirtual) {
                        $(".lonely_bg").css({left: 0}).width(getLonelyWidth());
                    } else {
                        $(".lonely_bg").css({left: "-100%", width: "200%"})
                    }
                }, 500)
            }
        },
        initGid: function() {
            $.changeHash({
                gid: 0
            });
        },
        initEvent: function() {
            $('.common-group').delegates({
                '#addGroup': function() {
                    var _self = this;
                    $.popup({
                        title: '新建分组',
                        content: $.tpl($('#addGroupTpl').html(), {
                            groupList: groupList
                        }),
                        confirm: {
                            text: '确认',
                            callback: function(self) {
                                var ip_rules = [];
                                if ($('.group-name').val() == '') return $.tips('请输入分组名');
                                if ( $('#ipSwitch').is(':checked') && $('#acSwitch').is(':checked')) {
                                    $('.ip-list-view p').each( function(index, el) {
                                        ip_rules[index] = $(this).find('.ip_rule').eq(0).text() + '-'
                                                            + $(this).find('.ip_rule').eq(1).text();
                                    });
                                    if ( ip_rules.length <= 0 ) return $.tips('请先添加IP段', false);
                                }
                                if(!$('.selectedGroup').attr('data-id')){
                                    return $.tips('请选择上级分组');
                                }
                                if ($('#groupNamePop').val() && $('#groupNamePop').val().length > 14) {
                                    return $.tips('分组长度不超过14个字符')
                                }
                                var autoip=0;
                                if($('#acSwitch').is(':checked')){
                                    if($('#ipSwitch').is(':checked')){
                                        autoip=1;
                                    }
                                    else
                                        autoip=2;
                                }

                                var data = {
                                    auto_ip_grouping: autoip,
                                    name: $('#groupNamePop').val(),
                                    pid: $('.selectedGroup').attr('data-id'),
                                    ip_rules: ip_rules.join(',')
                                }

                                $.postData( $('.nav-group ul').data('add') || '/client/group/add', data, true).then(function(res) {
                                    if (res.reason == 'success') {
                                        $.tips('新建分组成功！', true);
                                        location.reload();
                                        self.close();
                                    }
                                })
                            }
                        },
                        cancel: {
                            text: '取消',
                            callback: function(self) {
                                //deferedForTags.reject();
                                self.close();
                            }
                        },
                        closeTrigger: 'cancel',
                        popupDone: function() {
                            $('#acSwitch').on('change', function() {
                                if ($(this).is(':checked')) {
                                    $('input[name="auto_ip_grouping"]').attr('disabled',false);
                                    $('#ipSwitch').attr('checked',true);
                                    $('.ip-list').stop().slideDown('fast');
                                } else {
                                    $('input[name="auto_ip_grouping"]').attr('disabled',true);
                                    $('.ip-list').stop().slideUp('fast');
                                }
                            });
                            $('input[name="auto_ip_grouping"]').on('change', function() {
                                if ($(this).val()=='1') {
                                    $('.ip-list').stop().slideDown('fast');
                                } else {
                                    $('.ip-list').stop().slideUp('fast');
                                }
                            });

                            $.when($('.group-dropdown').groupDropdown(false,true)).done(function(obj){
                                if ($(_self).data('root') != 'interchanger') {
                                    obj.hideNode(1);
                                }
                                $('#addGroupPopup').parents('.popup-body').css('overflow','visible');
                                $('#addIpfields').on('click', function() {
                                    var ip_rules = $.getIp('#addGroupPopup .ipfilter');
                                    if (ip_rules.length != 2) {
                                        return $.tips('请输入完整IP');
                                    }
                                    $('.ip').val('');
                                    $('.ip-list-view').show();
                                    $('.ip-list-view').append($('<p><span class="ip_rule">' + ip_rules[0] + '</span><span class="ipdivider">-</span><span class="ip_rule">' + ip_rules[1] + '</span><i class="remove_ip_rule fa fa-remove"></i></p>'));
                                });

                                $('.ip-list-view').delegates({
                                    '.remove_ip_rule': function() {
                                        $(this).parent('p').remove();
                                        if ($('.ip-list-view').children('p').length <= 0) {
                                            $('.ip-list-view').hide();
                                        }
                                    }
                                })
                            });
                            $('.help_tip').helper();
                        }
                    });
                },
                "#groupManage": function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var limit = Math.floor((($(window).height() * 0.9 - 125) > 555 ? 555 : ($(window).height() * 0.9 - 125)) / 41) - 2;
                    $.popup({
                        title: '分组管理',
                        url: $('#groupManage').attr('href') + '#limit=' + limit,
                        width: 1024,
                        height: ($(window).height() * 0.9) > 680 ? 680 : ($(window).height() * 0.9),
                        beforeClose: function() {
                            parent.location.reload();
                        }
                    });
                },
                '#groupImport': function() {
                    $.popup({
                        title: '导入分组',
                        content: $.tpl($('#importGroupTpl').html()),
                        closeTrigger: 'cancel'
                    });
                },
                '#importVirtualGroup':function(){
                        var me = this;
                        $.popup({
                            title:'导入终端',
                            content:$('#import_option').html(),
                            confirm:{
                                text:'确定',
                                callback:function(self){
                                    var $confirmBtn = $(self.content).find('button.popup-footer-confirm');
                                    if ($confirmBtn.prop('disabled')) return;
                                    $confirmBtn.prop('disabled',true);
                                    var data = {
                                        operate_type: 0,
                                        type:         $.trim($('#v_platform').val()),
                                        user_name:    $.trim($('#v_account').val()),
                                        pass_wd:      $.trim($('#v_pass').val()),
                                        protocol:     $.trim($('#v_protocal:visible').val()),
                                        ip:           $.trim($.getIp('#v_ip')),
                                        port:         $.trim($('#v_port:visible').val()),
                                        sync_vm_grp: $('#v_sync_vm_grp').prop("checked") ? 1 : 0
 
                                    }
                                    
                                    if (!data.ip) {
                                        $confirmBtn.prop('disabled', false);
                                        return $.tips('请输入一个合法的IP', false, 2000);
                                    }
                                    if (!data.user_name) {
                                        $('#v_account').focus();
                                        $confirmBtn.prop('disabled', false);
                                        return $.tips('用户名不能为空', false, 2000);
                                    }
                                    if (data.user_name.length > 100) {
                                        $('#v_account').focus();
                                        $confirmBtn.prop('disabled', false);
                                        return $.tips('用户名过长，不能超过100个字符', false, 2000);
                                    }
                                    if (!data.pass_wd) {
                                        $('#v_pass').focus();
                                        $confirmBtn.prop('disabled', false);
                                        return $.tips('密码不能为空', false, 2000);
                                    }
                                    if (data.pass_wd.length > 100) {
                                        $('#v_pass').focus();
                                        $confirmBtn.prop('disabled', false);
                                        return $.tips('密码过长，不能超过100个字符', false, 2000);
                                    }


                                    if( $('#v_port').is(':visible') && !portCheck(data.port) ){
                                        $('#v_port').focus();
                                        $confirmBtn.prop('disabled',false);
                                        return $.tips('请输入一个合法的端口（1-65535范围内正整数）',false,2000);
                                    }
                                    $(me).find('i.fa-cog').addClass('fa-spin');     //转动小ICON
                                    $.postData('/virtual/import/import',data,true).then(function(res){

                                        if(res.result){
                                            $(me).find('i.fa-cog').removeClass('fa-spin');
                                            $confirmBtn.prop('disabled',false);
                                            return $.tips(res.reason,false,1500);
                                        }
                                        $.tips(res.data,true,5000);
                                        self.close();
                                    }).fail(function(){
                                        $confirmBtn.prop('disabled',false);
                                        $(me).find('i.fa-cog').removeClass('fa-spin');
                                    })

                                }
                            },
                            cancel:{
                                text:'取消',
                                callback:function(self){
                                    self.close();
                                }
                            },
                            closeTrigger:'cancel',
                            popupDone:function(self){
                                $('#v_platform').change();
                                var $popupBody = $(self.content);
                                var $confirmBtn = $(self.content).find('button.popup-footer-confirm');
                                $popupBody.find('input').on('keydown',function(e){
                                    if (e.keyCode === 13){
                                        $confirmBtn.click();
                                    }
                                })

                            },
                            beforeClose:function(self){
                                var $popupBody = $(self.content);
                                var $confirmBtn = $(self.content).find('button.popup-footer-confirm');
                                $popupBody.find('input').unbind('keydown');
                                $confirmBtn.prop('disabled',false)
                            }
                        })
                },
                '#sync_group':function(){
                    var me = this;
                    $(me).find('i.fa-refresh').addClass('fa-spin');
                    $.postData('/virtual/import/refresh',null,true).then(function(res){
                        $.tips(res.data,true,3000);
                    }).fail(function(err){
                        if (err.result === 10139) return;  
                        $(me).find('i.fa-refresh').removeClass('fa-spin');
                    })
                },

                'li a': {
                    mouseover: function() {
                        var $span = $(this).find('span:eq(1)');
                        var $this = $(this).parent('li');
                        var gid = $span.parent('a').find('i').attr('gid');
                        var treeNode = tree.zTreeObj.getNodesByParam('id', gid, null)[0];
                        if ($this.hasClass('active')) {
                            return;
                        }
                        $('.ztree').find('li').removeClass('cur');
                        $('.cur>.lonely_bg').remove();
                        $this.addClass('cur').prepend($('<div class="lonely_bg"/>'));

                        if(isVirtual) {
                            $(".lonely_bg").css({left: 0}).width(getLonelyWidth());
                        } else {
                            $(".lonely_bg").css({left: "-100%", width: "200%"})
                        }

                        // var width = Math.max(60 - ($this.offset().left - $('.ztree').offset().left), 64) + 'px'
                        // $span.addClass('text-ellipsis').css('width', width);
                    },
                    mouseout: function() {

                        var $span = $(this).find('span:eq(1)');
                        var gid = $span.parent('a').find('i').attr('gid');
                        var $this = $(this).parent('li');
                        var treeNode = tree.zTreeObj.getNodesByParam('id', gid, null)[0];
                        $this.removeClass('cur');

                        if (!$this.hasClass('active')) {
                            // $span.removeClass('text-ellipsis').css('width', 'auto');
                            $this.find('>.lonely_bg').remove();
                            if(treeNode){
                                $('#editBtn_' + treeNode.tId + ',#deleteBtn_' + treeNode.tId).hide();
                            }

                        }
                    }
                },
                '#sync_node_group' : syncNodeGroup
            });
        }
    };

    function showImportVirtualGroup() {
        $.popup({
            title:'导入分组',
            content:"是否按虚拟化结构导入分组",
            confirm:{
                text:'确定',
                callback:function(self){
                    var data = {};
                    $.postData('/virtual/index/syncvmgrp',data,true)
                    .then(function(res){
                        $.tips(res.data,true,5000);
                        self.close();
                    })
                }
            },
            cancel:{
                text:'取消',
                callback:function(self){
                    self.close();
                }
            },
            closeTrigger:'cancel'
        })
    }

    /**
     * 查找有权限的节点
     * @return {[type]} [description]
     */

    function findHasPermitNode(node){
        if(!node){
            return;
        }
        for (var i = 0, len = node.children.length; i < len; i++) {
            if (node.children[i].has_permit === true){
                hasPeimitNodes.push(node.children[i]);
                break;
            } else if ( node.children[i].children ) {
                findHasPermitNode(node.children[i]);
            }
        }
    }

    function clearSearch(ele) {
        $(ele).hide();
        $('#fa-search').show();
        if ($('.iprange').is(':visible')) {
            searchCol = 'ipzone';
            $.setIp('.ipfilter', '');
        } else {
            searchCol = 'ip|name';
            $('#search-input').val('');
        }
    }
    // var comReg = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]","g")
    // function stripScript(obj){
    //     var key = null;
    //     for (key in obj) {
    //         if (typeof obj[key] === 'object' && !(obj[key] instanceof Array)) {
    //             stripScript(obj[key]);
    //         }
    //         if (typeof obj[key] === 'string') {
    //             obj[key] = obj[key].replace(comReg, '');
    //         }
    //     }
    // }

    function portCheck(port){
        
        if ( port && isNum( port ) && parseInt(port,10) < 65535 && parseInt(port,10) > 0 ){
            return true;
        }
        return false;
    }

    function isNum(n){
        return /^[0-9]+$/g.test(n);
    }


    function getLonelyWidth(){
        var $lonely = $(".lonely_bg"), 
            namePos = $lonely.siblings("a").position(),
            nameWidth = $lonely.siblings("a").outerWidth(true),
            $commonGroup = $(".common-group");

        var liList = $("#group_ul li"), maxWidth = 0;
        liList.each(function(){
            var tmpWidth = $(this).find("a").position().left + $(this).find("a").outerWidth(true);
            if(tmpWidth > maxWidth) {
                maxWidth = tmpWidth;
            }
        })

        return $commonGroup.width() > (maxWidth - 0) ? $commonGroup.width() : (maxWidth - 0);
    }
    
    /**
     * 设备组树 同步配置
     */
    function syncNodeGroup(){
    	$.postData('/nac/config/syncconf',{
    		gid : $.changeHash().gid || 0
    	},true).then(function(res){
    		if (res.result == 0) {
    			$.tips('同步成功',true,1000,function(){
    				location.reload();
    			});
    		}else{
    			$.tips(res.reason,2000,false);
    		}
        });
    }

    tree.init();
    return tree;
});
