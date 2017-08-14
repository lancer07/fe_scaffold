define("res/js/common/message",["res/js/common/jquery-tools", "res/js/common/popup"], function(){

    var messages      = MSGS||{};
    var messageCount  = $("#messageCount");
    var messageClear  = $("#messageClear");
    var messageList   = $("#messageList");
    var msgListOutter = $("#msgListOutter");
    var divNoMessage  = $("#noMessage");
    var strNoMessage  = $("#tpl-noMessage").html();
    var clearWrapper  = $(".clear-wrapper");


    $("#messageWrapper").delegates({
        ".message i.fa-close": {
            click: function(event){
                var message = $(this).parent();
                var id      = message.attr("data-id");
                $.when( delMessage(id) ).done(function(result){
                    message.slideUp("fast", function(){
                        delete messages[id];
                        message.remove();
                        messageCount.text( coutMessage(messages) );
                        if ( coutMessage(messages) == 0 ) noMessage();
                    });
                });

            }
        },
        "#messageClear": {
            click: function(event){
                var ids = [];
                $("#messageList .message").each(function(index, el) {
                    if ( $(this).attr("data-id") ) ids.push( $(this).attr("data-id") );
                });
                $.when( delMessage(ids.join(",")) ).done(function(result){
                    messageList.find(".message").slideUp("fast").remove();
                    messages = {};
                    noMessage();
                });
            }
        }
    });

    function noMessage(){
        // messageList.html(strNoMessage);
        msgListOutter.hide();
        divNoMessage.show();
        clearWrapper.hide();
        messageCount.text(0).hide();
    }

    function addMessage(obj){

        if (obj.id in messages) return;
        var html = $.tpl( $("#tpl-message").html(), obj );
        var tmp = html.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&#34;/g, '\"').replace(/&#39;/g, "'");
        //$('#noMessage').remove();
        divNoMessage.hide();
        $("#messageList").prepend(tmp);

        messages[obj.id] = obj.data;
        messageCount.text(coutMessage(messages)).show();
       // divNoMessage.hide();
        clearWrapper.show();
        msgListOutter.show();
    }

    function delMessage(ids){
        var deferred = $.Deferred();
        $.postData("/index/delmsg", {ids: ids}, true).done(function(response){
            if (response.reason == "success") {
                deferred.resolve(response);
            } else {
                deferred.reject(response);
            }
        }).fail(function(response){
            deferred.reject(response);
        });
        return deferred;
    }

    function coutMessage(msgs){
        var count = 0;
        for(var key in msgs){
            if (msgs.hasOwnProperty(key)) count++;
        }
        if (count > 99) {
            count = 99;
        }
        return count;
    }

    var Polling = function(){};
    Polling.prototype = {
        start: function(opts){
            this.opts   = opts       || {};
            this.url    = opts.url   || "";
            this.data   = opts.data  || {};
            this.type   = (opts.type || "GET").toUpperCase();
            this.done   = opts.done;
            this.fail   = opts.fail;
            this.always = opts.always;
            this.failures      = 0;
            this.maxTry        = 10;
            this.retryInterval = 1000;

            if (!this.url) {
                console && console.error("polling url request!");
                return false;
            } else {
                if (this.type == "POST") {
                    this.data.YII_CSRF_TOKEN = SYS_CONF.csrf_token;
                }
                this.keepPolling = true;
                this._polling();
            }
            return this;
        },
        stop: function(){
            this.keepPolling = false;
            if (this.xhr) this.xhr.abort();
        },
        _polling: function(){
            var _this = this;
            var arg   = arguments;
            _this.xhr = $.ajax({
                url:      _this.url,
                type:     _this.type,
                data:     _this.data,
                cache:    false,
                dataType: "JSON"
            })
            .done(function(data, textStatus, jqXHR) {
                if (!data) return;
                $(document.body).trigger("receiveMessage", [data]);
                if ( data.type == "page_reload" ){
                    $(document.body).trigger("pageReload");
                }
                if ( data.type == "msg" && _this.done) _this.done(data, textStatus, jqXHR);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                if (_this.fail) _this.fail(jqXHR, textStatus, errorThrown);
            })
            .always(function(jqXHR, textStatus) {
                if ("function" === typeof _this.always) {
                    _this.always(jqXHR, textStatus);
                }
                if (_this.keepPolling) {
                    if ("success" === textStatus || "timeout" === textStatus) {
                        // 正常超时或者有数据返回的情况
                        _this.failures = 0;
                        setTimeout(function() {
                            arg.callee.call(_this);
                        }, _this.retryInterval);
                    } else {
                        // 失败重试
                        _this.failures++;
                        if (_this.failures < _this.maxTry) {
                            setTimeout(function() {
                                arg.callee.call(_this);
                            }, _this.retryInterval * (1 + _this.failures)); // 逐渐拉长重试间隔，超过最大重试次数后放弃
                        }
                    }
                }
            });
        }
    }

    return (new Polling).start({
        url:        "/notice-pull?channels=work_queue_2front_end_" + SYS_CONF.uid,
        done:       function(data, textStatus, jqXHR){
            addMessage(data);
        }
    });
});