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

// fis.match('./res/js/*.js', {
//   optimizer: fis.plugin('uglify-js')
// });

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

fis.media('prod')
.match('*.js', {
    isMod: true,
    optimizer: fis.plugin('uglify-js'),
    skipBuiltinModules : true
})
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
