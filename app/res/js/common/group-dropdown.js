define('res/js/common/group-dropdown', ['vendor/jquery.zTree/js/jquery.ztree.all-3.5'], function(tree){
	(function($){
		var obj = {};
		$.fn.groupDropdown = function(multiSelect,autoScroll){
			var groupsGet     = new $.Deferred();
			var URL           = this.data('url') || '/client/group/listall';
			var groups        = null;
			var selectedGroup = null;
			var $this         = this;
			var zTree         = null;
			var initNodeId    = null;
			var initFlag      = true;
			var setting       = {
				view: {
					// 不显示动画效果
					expandSpeed: '',
					showIcon: false,
					fontCss: {
						"color": "#666",
						"font-size": '12px'
					},
					addDiyDom: function(treeId, node) {
						var level = $this.find("#" + node.tId + "_a");
						if ($this.find("#diyBtn_" + node.id).length > 0) return;
						var icon = node.isGroupNode ? 'fa-sitemap' : 'fa-desktop';
						// var iconElement = $("<i class='fa fa-users' title=" + node.name + "></i>");
						var iconElement = $("<i class='fa fa-sitemap' title=" + node.name + "></i>");
						$this.find("#" + node.tId + "_span").attr('data-id',node.id);
						iconElement.insertBefore(level);
					}
				},
				check: {
					enable: multiSelect == false ? false : true,
					chkStyle: "checkbox"
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: multiSelect == false ? {
					onClick: onClick
				} : {
					onClick:onClick,
					onCheck:oncheck
				}
			};
			initEvent();
			getGroups(URL).then(function(list){
				groups = [];

				$(list).each(function(_, group) {
					groups.push({
						pId:         group.pid,
						id:          group.id,
						name:        group.display_name || group.name,
						isGroupNode: true,
						// isParent:    isParent(list, group)
					});
				});
				var wholeNet = {
						id: 0,
						gid: 0,
						name: $this.data('root') ||  '全网计算机',
						isGroupNode: true
					};
				groups.push(wholeNet);
				zTree = $.fn.zTree.init($this.find('.common-group-container .selectable-group ul'), setting, groups);
				var node = zTree.getNodesByParam('id', 0, null)[0];

				zTree.expandNode(node);

				var res = {
					elem:$this,
					zTree:zTree,
					getSelectedGroups:getSelectedGroups,
					getSelectedGroup:getSelectedGroup,
					initSelectNode:initSelectNode,
					expandNode:function(id){
						var node = zTree.getNodesByParam('id',id,null);
						zTree.expandNode(node[0]);
					},
					hideNode:function(id){
						var node = zTree.getNodesByParam('id',id,null);

						if(node && node.length){
							$this.find('#' + node[0].tId).hide();
						}
					}
				};
				groupsGet.resolve(res);
			});
			
			return groupsGet.promise();

			function onClick(event, treeId, treeNode, clickFlag){
				event.stopPropagation();
				var $selectedGroup = $(event.target).parents('.common-group-container').prev('span');
				var self = $this.find('#'+treeNode.tId);
				var top  = $this.find('.common-group-container').scrollTop();
				// 因为响应的是里面的a标签，必须再做一次与父元素点击时一样的事情
				$this.find('.ztree').css('backgroundPosition', '0 '+(self.position().top+top)+'px');
				selectedGroup = {
					id:treeNode.id,
					name:treeNode.name
				};
				if(!multiSelect){
					$selectedGroup.attr('data-id',selectedGroup.id).text(selectedGroup.name);
					initFlag= false;
					if(!initFlag){
						closeGroupContainer();
					}
				}
				return false;
			}

			function getSelectedGroups(){
				var checkedGroups = [];
				GetCheckedNodes(zTree,0,checkedGroups);
				return checkedGroups;
			}

			function getSelectedGroup(){
				return selectedGroup;
			}

			function GetCheckedNodes(ztree,pid,arr){
				var node = ztree.getNodesByParam("id",pid,null);
				var pstaus = null;
			    if(node.length != 0){
			       pstaus = node[0].getCheckStatus();
			    }
				if(pstaus && !pstaus.half && pstaus.checked){
					arr.push({
						id:node[0].id,
						name:node[0].name
					})
				}else if(pstaus && pstaus.half && pstaus.checked){
					var children = node[0].children;
					for(var i=0,j=children.length;i<j;i++){
						GetCheckedNodes(ztree,children[i].id,arr)
					}
				}
			}

			function oncheck(event, treeId, treeNode, clickFlag){
				var selectedArray = [];
				var gnameArray = [];
				var gidArray = [];
				var selected = $this.find('>span').attr('data-id') || '';
				GetCheckedNodes(zTree,0,selectedArray)
				for(var index in selectedArray){
					gnameArray.push(selectedArray[index].name);
					gidArray.push(selectedArray[index].id);
				}
				$this.find('>span').attr('data-id',gidArray.join('，')).text(gnameArray.join('，'));
			}

			function initSelectNode(nodeId){
				initNodeId = nodeId;
				if(!multiSelect){
					var node = zTree.getNodesByParam('id',nodeId,null)[0];
					if(node){
						$this.find('.selectedGroup').text(node.name).attr('data-id', node.id);;
						if($this.find('#'+node.tId).length===0){
							var pnode = zTree.getNodesByParam('id',node.pId,null)[0];
							zTree.expandNode(pnode);
						}
					}
				}else{
					var text = [];
					var title = [];
					for(var i=0, j=nodeId.length; i<j;i++){
						var node = zTree.getNodesByParam('id',nodeId[i],null)[0];
						if(node){
							text.push(node.name);
							title.push(node.id);
							zTree.checkNode(node, true, true);
						}
					}
					$this.find('.selectedGroup').attr('data-id',title.join(',')).text(text.join(','));
				}
			}

			function getGroups(URL){
				return $.getJson(URL, {}, true).then(function(res){
					return res.data.list;
				});
			}

			function isParent(list, node){
				$(list).each(function(index, el) {
					if (el.pid == node.id) return true;
				});
				return false;
			}

			function initEvent(){
				$this.on('click', function(event) {
					event.stopPropagation();
					if ($this.data('tree') == 2) {
						zTree = $.fn.zTree.init($this.find('.common-group-container .selectable-group ul'), setting, groups);
						zTree.expandAll(true);
					}
					if ($this.hasClass('disable') || $this.prop('checked') || $(this).attr("disabled")) {return;}
					$(this).find('.common-group-container').show();
					$(document).on('click', closeGroupContainer);
					if(!multiSelect && initFlag  && initNodeId !== null){
						initSelectNode(initNodeId);
					}
				});
				if (multiSelect == false) {
					$this.delegates({
						'.ztree li': {
							click: function(event){
								event.stopPropagation();
								var top  = $this.find('.common-group-container').scrollTop();
								$this.find('.ztree').css('backgroundPosition', '0 '+($(this).position().top+top)+'px');
								return initFlag = false;
							},
							mouseenter: function(event) {
								event.stopPropagation();
								var top = $this.find('.common-group-container').scrollTop();
								$this.find('.selectable-group').css('backgroundPosition', '0 '+($(this).position().top+top)+'px');
							},
							mouseleave: function(event) {
								event.stopPropagation();
								$this.find('.selectable-group').css('backgroundPosition', '0 -999px');
							}
						}
					});
				}
			}

			function closeGroupContainer(){
				$('.group-dropdown .common-group-container').hide();
				$(document).unbind('click', arguments.callee);
			}

			
		}
	})(jQuery);
});
