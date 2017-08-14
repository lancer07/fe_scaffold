define('js/common/group-range', [], function(){
    (function($){
        $.fn.groupRange = function(groupList){
            
            var _this = this;
            var groupPlugin = {
                container: _this,
                groupList: groupList,
                
                init: function(){
                    var isRootFull = this.groupList[0] ? this.groupList[0].full : 1; // 根节点是否有完全权限
                    var subList    = getSubGroups(this.groupList, 0);

                    this.container.append(renderSubGroups(0, subList, isRootFull));
                    
                    return this;
                },

                /**
                 * 获取当前选中的分组id
                 * @return {Number} 当前选中的分组id
                 */
                getGroupId: function(){
                    var selects   = this.container.children('select');
                    var lastChild = $(selects[selects.length-1]);
                    var value     = lastChild.val();

                    if (value == -2) { // 本级全部
                        top.$.changeHash({only: 1});
                    } else {
                        top.$.changeHash({only: 0});
                    }

                    if (value == -1 || value == -2) {
                        value = lastChild.prevAll('select').val();
                    }

                    return parseInt(value);
                },

                /**
                 * 根据给定的分组id，还原用户选择的下拉框的状态
                 * @param {Number} id 分组id
                 */
                setGroup: function(id){
                    if (id == 0) {
                        this.container.find('select').first().val(id);
                    } else {
                        var pList   = [];
                        var _this   = this;
                        var selects = this.container.children('select');

                        getParentGroups(id, this.groupList, pList);

                        for (var i = 0, l = pList.length; i < l; i++) {
                            selects.eq(i).val(pList[i]).change();
                        };

                        if (top.$.changeHash().only == 1) {
                            this.container.find('select:last').val(-2);
                        }

                        if (id != 0 && pList.length == 0) { // 此分组已不存在
                            top.$.changeHash({gid: 0});
                        }
                    }
                }
            };

            _this.delegate('select', 'change', function(event) {
                var self   = $(this);
                var gid     = self.val();
                var full    = self.find('option:selected').attr('data-full');
                var subList = null;
                var html    = null;

                while(self.next().length > 0) { // 清空后面的下拉框
                    self.next().remove();
                }

                if (gid != -1 && gid != -2 && gid != 0) { // 排除特殊选项
                    subList = getSubGroups(groupList, gid);
                    html    = renderSubGroups(gid, subList, full);
                    _this.append(html);
                }
            });

            /**
             * 获取某一个分组的子分组列表
             * @param  {Array}   data 分组列表数据
             * @param  {Number}  pid  父分组gid
             * @return {Array}        子分组列表
             */
            function getSubGroups(data, pid) {
                var list = [];

                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].pid == pid) {
                        list.push(data[i]);
                    }
                };

                return list;
            }

            /**
             * 生成下一级的下拉框
             * @param  {Number}  pid   父分组gid
             * @param  {Array}   list  子分组列表
             * @param  {Number}  full  是否拥有父分组的完全权限：1是0否
             * @return {String}        拼装好的HTML片段
             */
            function renderSubGroups(pid, list, full) {
                if (list.length > 0) { // 存在子分组
                    var html = pid == 0 ?
                                        ['<select>'] :
                                        ['<i class="fa fa-chevron-right"></i>', '<select>'];

                    html.push(pid == 0 ? '<option value="0" data-full="' + (full || '') + '">全部</option>' : '<option value="-1">全部</option>');
                    html.push((full == 1 && pid != 0) ? '<option value="-2">本级全部</option>' : '');

                    for (var i = 0, l = list.length; i < l; i++) {
                        html.push('<option value="' + list[i].id + '" data-full="' + (list[i].full || '') + '">' + list[i].display_name + '</option>');
                    };

                    html.push('</select>');

                    return html.join('')
                }
                return '';
            }

            /**
             * 递归找到某一分组的所有父分组
             * @param  {Number}  id     分组id
             * @param  {Array}   list   所有分组列表
             * @param  {Array}   pList  按照根到叶的顺序存储的父分组列表
             */
            function getParentGroups(id, list, pList){
                $(list).each(function(index, el) {
                    if(el.id == id) {
                        pList.unshift(id);
                        if (el.pid == 0) return;
                        getParentGroups(el.pid, list, pList);
                    }
                });
            }

            return groupPlugin.init();
        }
    })(jQuery);
});
