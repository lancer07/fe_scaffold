<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>login</title>
    <script src="/router-conf.js"></script>
    <script src="/res/vendor/jquery/jquery-1.11.1.min.js"></script>
    <script src="/res/js/common/jquery-tools.js"></script>
    <script src="/res/vendor/requirejs/requirejs.js"></script>
    <script>
        var buildNum = '0.1.0';
        require.config({
            baseUrl: '/',
            urlArgs: "v=" + buildNum
        })
        require(['res/js/common/common']);
    </script>
</head>