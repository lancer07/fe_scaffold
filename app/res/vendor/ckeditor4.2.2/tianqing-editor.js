$(function(){

$.fn.addCkEditor = function() {
    var $enode = $(this);
    var id = $enode.attr('id');

    // CKEDITOR.config.contentCss = '/res/module/ckeditor4.2.2/tianqing/css/message_ckeditor.css';
    var ckres = CKEDITOR.replace(id, {
        'contentsCss': '/res/module/ckeditor4.2.2/tianqing/css/message_ckeditor.css',
        'allowedContent': 'p b i; a[!href]',
        'resize_enabled': false,
        'toolbar': [],
        'toolbarCanCollapse': false,
        'forcePasteAsPlainText': true,
        'removePlugins':'elementspath',
        'height': 100,
        on: {'key': function(event) {
            var kc = event.data.keyCode;
            var len = Editor.getEditorContentLength();
            var controlKeyString = ' 37 38 39 40 8 46 36 35 1114177 1114179 2228261 2228262 2228263 2228264 2228260 2228259 ';
            var stop = function() {
                event.cancel();
                event.stop();
            }
            if(kc == 13 || kc == 2228237) {
                stop();
            } else {
                if(len >= Editor.MAXLENGTH) {
                    // 1114129: ctrl key
                    // 1114177: ctrl + a
                    // 1114179: ctrl + c
                    if(controlKeyString.indexOf(' ' + kc + ' ') == -1) {
                        stop();
                    }
                }
            }
        }} 
    });

    var Editor = {
        MAXLENGTH: 280,
        instances: ckres,
        init: function() {
            this.MAXLENGTH = $enode.attr('maxlength') || 280;
        },
        insertHtml: function(value) {
            // var oEditor = CKEDITOR.instances.messageContent;
            this.instances.insertHtml(value);
        },
        getEditorContentLength: function() {
            try {
                return (this.instances.document.getBody().getText().length);
            } catch(e) {
                return 0;
            }
        },
        _bind: function() {
            $(document.body).delegates({

            })
        }
    };
    window.tqEditor = Editor;

    return Editor;
};

}());