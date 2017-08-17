<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>fe_scaffold</title>
    <script>
        var isLogin = sessionStorage.getItem("login"); 
        if(isLogin != 'true'){
           location.href = "/pages/login";
        }
    </script>
    <script src="/res/vendor/jquery/jquery-1.11.1.min.js"></script>
    <script src="/res/vendor/requirejs/requirejs.js"></script>
    <script>
        var buildNum = '0.1.0';
        require.config({
            baseUrl: '/',
            urlArgs: "v=" + buildNum
        })
    </script>
</head>