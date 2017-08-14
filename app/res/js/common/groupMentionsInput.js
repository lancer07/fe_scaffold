define("js/common/groupMentionsInput", ['js/common/treeUtil'], function(treeUtil){
    var treeDataMapUrl = {};
    var onSelect = null;
    $.fn.mentionsInput = function(fn){
        var self = this;
        if (fn){
            onSelect = fn;
        }
        $(self).each(function(index, item){
            var $item        = $(item);
            var url          = $item.attr('data-url') || "/client/group/usergrouptree";
            var cacheKey     = $item.attr('data-cacheKey') || GROUP_CACHE;
            var wholeNetName = $item.attr('data-wholeNetName');
            
            // 已经请求的过url忽略
            if (treeDataMapUrl[url]){
                 // 初始化选中的节点
                 initSelectGroup(item, treeDataMapUrl[url].idNodeMap);
                 return;
            } 

            treeUtil.fetchGroup(url, cacheKey).then(function(groups){
                 treeDataMapUrl[url] = treeUtil.getTreeData(groups, wholeNetName);
                 // 初始化选中的节点
                 initSelectGroup(item, treeDataMapUrl[url].idNodeMap);
            })
        })    
    }


    // 事件监听
    $(document.body).delegates({
        ".groupMentionsInput": {
            input: function(e){
                var groupUrl = $(this).parent().data("url") || "/client/group/usergrouptree"
                var treeData = treeDataMapUrl[groupUrl];
                var key = $.trim(e.target.value);
                var box = $(this).next('.mentions-box');
                if ( !key ) return box.addClass("none").empty(); 
                var subTree = [];
                treeData.preOrderIdList.forEach( function(id, index) {
                    if (treeData.idNodeMap[id].name.toString().toLowerCase().indexOf(key) > -1){
                        subTree.push(id);
                    }
                });
                if ( 0 == subTree.length ) return box.addClass("none").empty(); 
                var group = [];
                subTree.forEach(function(item){
                    var path = treeUtil.getPath(treeData.idNodeMap[item], treeData.idNodeMap, []);
                    path.push(item);
                    group.push(path)
                });
                showMention(box, group, treeData.idNodeMap);
            }
        },

        ".mentions-ul li" : function(){
            var selectedLi = $(this);

            var id = selectedLi.attr('data-id');
            var val = selectedLi.text().toString().split('—').pop();
            var box = selectedLi.parents('.mentions-box');
            var input = box.prev('input');
            // 加个选择回调函数，如果返回false，则不选中该节点
            if ('function' === typeof onSelect && !onSelect(val,id,input)){ 
                return;
            }
            input.val(val).attr('title', selectedLi.text());
            input.prev('input[type=hidden]').val(id).change();
            box.addClass("none").empty();
        }
    });

    function showMention(box, group, idNodeMap){
            
        box.empty();

        var ul = "<ul class = 'mentions-ul'>";        
        group.forEach(function(item){
            // 取最后一个元素
            var id = item[item.length -1].toString().split("-").pop();
            var li = "<li data-id =" + id + " >";

            item.forEach( function(id, index) {
                // if ("gid-0" === id) return true;
                li += idNodeMap[id].name + ( index === item.length - 1 ? '' : '—'); 
            });
            li += '</li>';
            ul += li;
        })
        ul += "</ul>"
        
        box.html(ul).removeClass("none")
    }



    function initSelectGroup(item, idNodeMap){
        var $item = $(item);
        var gid = $.trim($item.find("input[type=hidden]").val()) ? $.trim($item.find("input[type=hidden]").val()) : 0;
        var initId = "gid-" + gid;
        if (idNodeMap[initId]){
            $item.find('.groupMentionsInput').val(idNodeMap[initId].name);        
        }else{
            $item.find('.groupMentionsInput').val('该分组已删除或无权限');
        }


    }
});