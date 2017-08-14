define('res/js/common/treeUtil', [], function(){
    var GROUP_URL = "/client/group/usergrouptree";
    /**
     * [cacheTreeData 将数据缓存到localStorage]
     * @param  {[Object]} data [要缓存的数据对象]
     * @return {[null]}      [null]
     */
    function cacheTreeData(key, data){
        try {
            clearTreeCache();
            // 将终端树数据缓存起来
            localStorage.setItem(key, JSON.stringify(data));

        } catch(e) {
            console.log(e, "Your Browser can not support LocalStroage");
        }
    }

    /**
     * [ClearTreeCache 清除缓存数据]
     * @return {[null]} [null]
     */
    function clearTreeCache(){
        try {
            var treeKeyReg = /^(tree)/g;
            var length = localStorage.length;
            for ( var i = 0; i < length; i++ ){
                var key = localStorage.key(i);
                if (treeKeyReg.test(key)){
                    localStorage.removeItem(key)
                }
            }
            
        } catch(e) {
            console.log(e, "Your Browser can not support LocalStroage");
        }
    }

    function getGroupCache(cacheKey){
        var def = $.Deferred();
        try {
            var cache = localStorage.getItem(cacheKey)
            def.resolve(cache)
        } catch(e) {
            // statements
            console.log(e);
        }
        return def.promise();
    }
    
    function fetchGroup(url, cacheKey){
        url = url || GROUP_URL;
        cacheKey = cacheKey || GROUP_CACHE;
        return getGroupCache(cacheKey)
            .then(function(groups){
                if (groups) return JSON.parse(groups)
                return $.getJson(url, null, true)
            })
            .then(function(res){
                if ( Array.isArray(res) ){
                    return res;
                }
                cacheTreeData(cacheKey, res.data.list)
                return res.data.list;
            })
    }

    /**
     * [getNodeMap 将数据转换为以ID为键值的map结构，方便快速查找到节点]
     * @param  {[Array]}    rawData     [初始化的数组this]
     * @return {[HashMap]}  idNodeMap   [Map对象]
     */
    function getNodeMap(rawData, wholeNetName){
        var idNodeMap = {
            "gid-0": {
                id: "gid-0",
                level:0,
                name: wholeNetName || "全网计算机",
                children:[]
            }
        }
        rawData.forEach(function(item){
            var metaData = item.split(/\x04/);
            var node = {
                id:       "gid-" + metaData[0],
                pid:      "gid-" + metaData[1],
                name:     metaData[2],
                children:[]
            }
            idNodeMap[node.id] = node;
            return node;
        })      
        return idNodeMap;
    }


    /**
     * [getNodeLevel 根据父节点的Level确定节点的level层级]
     * @param  {[HashMap]}     idNodeMap  [树节点哈希表，方便快速查找]
     * @param  {[Object]}      parentNode [父节点对象]
     * @return {[number]}      level     [ 节点Level]
     */
    function getNodeLevel(idNodeMap, parentNode){
        if ( "undefined" === typeof parentNode.level ){
            parentNode.level = getNodeLevel(idNodeMap, idNodeMap[parentNode.pid]);
        }
        return parentNode.level + 1;
    }

        
    /**
     * [convertListToTree 将列表转化为树型结构，返回树的根结点]
     * @param {[HashMap]} idNodeMap [节点HASH表]
     * @return {[type]}             [树的根结点Root]
     */
    function convertListToTree(idNodeMap){
        var root          = null;

        for (var id in idNodeMap){
            if (idNodeMap.hasOwnProperty(id)){
                var datum      = idNodeMap[id];
                var parentNode = idNodeMap[datum.pid];
                if( "undefined" === typeof datum.pid) { // 没有PID时，表示该节点是根节点；
                    root = datum;        
                } else if (parentNode) {
                    parentNode.children.push(datum.id);
                    datum.level         = getNodeLevel(idNodeMap, parentNode);
                    parentNode.isParent = true;
                }
            }
        }
        
        return root;
    }


    /**
     * [preOrderTranverse 先序遍历树节点，转化为数组, 方便后面通过循环去遍历数组]
     * @param  {[Object]}   root      [根节点]
     * @param  {[HashMap]}  idNodeMap   [节点HASH表]
     * @param  {[Array]}    list      [存放的数据]
     * @return {[null]}     null
     */
    function preOrderTranverse(root, idNodeMap, list){
        if ( root ){
            list.push(root.id);
            if (root.children){
                root.children.forEach( function(id){
                    preOrderTranverse(idNodeMap[id], idNodeMap, list);
                    return id;
                })
            }
        }
    }


    /**
     * [getTreeData 对原始列表数据进行处理]
     * @param  {[Array]} rawDataList [原始数据列表]
     * @return {[Object]}             [返回树的根节点，Hash表，先序列表]
     */
    function getTreeData(rawDataList, wholeNetName){
        var idNodeMap      = getNodeMap(rawDataList, wholeNetName);
        var root           = convertListToTree(idNodeMap);
        var preOrderIdList = []
        preOrderTranverse(root, idNodeMap, preOrderIdList);
        return {
            root: root,
            idNodeMap: idNodeMap,
            preOrderIdList:preOrderIdList  
        }
    }

    function getGroups(rawDataList){
        var groups = [];
        rawDataList.forEach(function(item){
            var metaData = item.split(/\x04/);
            var node = {
                id:   metaData[0],
                gid:  metaData[0],
                pid:  metaData[1],
                name: metaData[2],
                display_name: metaData[2]
            }
            groups.push(node);
        })  
        return groups;
    }


    /**
     * [getPath 递归获取当前节点的继承关系数组]
     * @param  {[Object]}       node   [需要计算继承关系数组的节点]
     * @param  {[HashMap]}  idNodeMap       [节点HASH表]
     * @param  {Array}          path  [继承关系数组]
     * @return {[Array]}              [关系数组]
     */
    function getPath(node, idNodeMap, path){
        if ( undefined !== node && undefined !== node.pid ) {
            path.unshift(node.pid);
            return getPath(idNodeMap[node.pid], idNodeMap, path)
        }
        return  path;
    }

    return {
        fetchGroup:     fetchGroup,
        getPath:        getPath,
        getTreeData:    getTreeData,
        getGroups:      getGroups,
        cacheTreeData:  cacheTreeData,
        clearTreeCache: clearTreeCache
    }
})