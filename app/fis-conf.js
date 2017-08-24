var requirejs = require('./r.js');
fis.match('::package', {
  spriter: fis.plugin('csssprites'),
  postpackager: fis.plugin('loader', {
      resourceType: 'amd',
      useInlineMap: true
  })
});

fis.match('*', {
  useHash: false
});

fis.match('{components,pages}/*.less', {
  parser: fis.plugin('less'),
  rExt: '.css'
});

fis.match('*.css', {
  useSprite: true,
  optimizer: fis.plugin('clean-css')
});

fis.match('res/images/*.png', {
  optimizer: fis.plugin('png-compressor')
});

fis.match('*.{html,tpl}', {
  optimizer: fis.plugin('html-minifier',{
    processConditionalComments : true
  }),
  useMap: true
});

fis.media('prod').match('pages/**.js', {
  postprocessor: function (content, file, settings) {
      requirejs.optimize({
          baseUrl: './',
          name: file.subpathNoExt.slice(1),
          out: '../dist/' + file.subpath,
          //optimize: 'none'
      }, function (resultText) {
          console.log('requirejs.optimize:\n===================\n' + resultText);
      });
  }
});

fis.media('prod')
.match('*.{html,tpl}', {
    optimizer: fis.plugin('html-minifier',{
      processConditionalComments : true,
      minifyJS : true,
      trimCustomFragments : true
    })
})

fis.set('project.ignore', [
  'node_modules/**',
  'res/less/**',
  'res/vendor/**', // 打包时，忽略
  'res/vue/**',
  //'tests/**',
  '.git/**'
  //'fis-conf.js',
  //'package.json'
]);
