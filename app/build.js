(function(){
    var exclude = /(webpack.vue.base.config.js|package.json|node_modules|pages|components|less|vue|vendor|build|mock|tests|img|css)$/;
    var pages = [
        { 
            name: 'pages/home/index'
        },
        { 
            name: 'pages/demos/ui/index'
        }
    ]

    return {
        appDir: './', 
        baseUrl: './',
        dir: '../dist2',　
        modules: pages,
        fileExclusionRegExp: exclude,
        //optimizeCss: 'standard',
        removeCombined: true,
        paths: {},
        shim: {}
    }
})();