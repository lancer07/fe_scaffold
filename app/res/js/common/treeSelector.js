define("js/common/treeSelector",[],function(){
	function triggerRender(container, treeUrl, cacheKey){
			$(document).trigger("renderTreeSelector",{
						container: container,
						treeUrl: treeUrl,
						cacheKey: cacheKey
					})
	};
	return {
		triggerRender
	}
})