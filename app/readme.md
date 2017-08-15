# 脚手架使用概要 （基于fis3的前端工程构建）

### 1. “?__inline” 语法 作为组件化基础
`` 
    <link href="/pages/include/html_head.tpl?__inline" rel="import" />
`` 
    
### 2. Require JS 例子
``      
    //一个页面，require一个JS页面逻辑处理文件
     <script>
            require(['pages/home/index']);
     </script>
``
   
### 3. 模版引擎
``         
    var res = {
        name : 'lancer'
        list : [
            {
                id : 1
            },
            {
                id : 2
            },
            {
                id : 3
            },
            {
                id : 4
            }
        ]
    }
    var tplAutoApproval = template($('#tplAutoApproval').html(),res);
    $("#message").html(tplAutoApproval);

    
    <div id="message"></div>
    <script type="text/html" id="tplAutoApproval">
        i am  <%- name %>
        <% for (var i = 0; i < list.length; i++) { %>
            <%if (list[i].id != 3) { %>
                    <li><%- list[i].id %>
            <% } %>    
        <% } %>
    </script>
`` 

### 4.Vue的目录结构 例子
`` 
    // 先建一个html的page，id选择器，引入build后的js文件
    <div id="about">
    <script type="text/javascript" src="/res/build/about/IndexTpl.js">

    // vue的入口文件存放在 /res/vue/entrys/about/IndexTpl.js
    // vue的主文件在 /res/vue/pages/about/tpl/About.vue
``  
### 5. Less
`` 
        工具类存放在 /res/less
        less文件保存后，会自动在同级生成对应css文件
`` 
### 6. 建立开发环境与发布 package.json
`` 
        "build:vue": "npm run build:vue:dll && npm run build:base:vue -- --prod",
        "dev:vue": "npm run build:base:vue -- --dev --watch",
        "build:fis": "fis3 release prod -d ../dist",
        "dev:fis" : "fis3 server start && fis3 release -wL"

        发布后会自动压缩html,js,css文件，png图片会合并。
``     