define('res/js/common/pager',['res/js/common/jquery-tools'],function(){
    $.pager = $.Class(function() {
        return {
            jump: function() {
                // var value = this.el.find('.pagination-num').val();
                // location.href = getUrl(value);
            },
            init: function(el, totalPage, currentPage, callback, totalNum) {
                this.el = el;
                this.totalPage = Math.ceil(totalPage);
                if (typeof currentPage == 'function') {
                    currentPage = '';
                    callback = currentPage;
                };
                this.currentPage = currentPage;
                this.callback = callback;
                this.totalNum = totalNum;
            },
            getHtml: function() {
                var page = 1;
                if (this.currentPage) {
                    page = this.currentPage;
                } else {
                    page = $.changeHash().page || 1;
                }
                page = parseInt(page, 10);
                if (this.totalPage <= 1) {
                    this.el.html('');
                    return false;
                };
                if (page > this.totalPage) {
                    page = this.totalPage;
                };
                var html = [];
                if (typeof this.totalNum == 'undefined') {
                    html.push("<span class='total-record' >共" + totalNum + "条记录</span>");
                } else {
                    html.push("<span class='total-record' >共" + this.totalNum + "条记录</span>");
                }
                if (page > 1) {
                    html.push('<a data-page="' + (page - 1) + '" href="javascript:;" class="prev">上一页</a>');
                };
                var num = 2;
                if (page >= 1000) {
                    num = 2;
                };
                var pageIndex = [];
                for (var i = page - num; i <= page + num; i++) {
                    if (i >= 1 && i <= this.totalPage) {
                        pageIndex.push(i);
                    };
                }
                if (pageIndex[0] > 1) {
                    html.push('<a data-page="1" href="javascript:;">1</a>')
                };
                if (pageIndex[0] > 2) {
                    html.push('<span>…</span>');
                };
                for (var i = 0, length = pageIndex.length; i < length; i++) {
                    var p = pageIndex[i];
                    if (p == page) {
                        html.push('<a data-page="' + p + '" href="javascript:;" class="active">' + p + '</a>');
                    } else {
                        html.push('<a data-page="' + p + '" href="javascript:;">' + p + '</a>');
                    }
                }
                if (pageIndex.length > 1) {
                    var last = pageIndex[pageIndex.length - 1];
                    if (last < (this.totalPage - 1)) {
                        html.push('<span>…</span>');
                    };
                    if (last < this.totalPage) {
                        html.push('<a data-page="' + (this.totalPage) + '" href="javascript:;">' + this.totalPage + '</a>')
                    };
                };
                if (page < this.totalPage) {
                    html.push('<a data-page="' + (page + 1) + '" href="javascript:;" class="next">下一页</a>')
                };

                if (this.totalPage > 4) {
                    html.push('<input type="text" class="pagination-num" />');
                    html.push('<a target="" class="jump" href="javascript:;" data-total="' + this.totalPage + '">跳转</a>');
                }



                html = html.join(' ');
                return html;
            },
            run: function() {
                this.bindEvent();
                var html = this.getHtml();
                this.el.html(html || "");
                if (html) {
                    this.el.show();
                };
            },


            bindEvent: function() {
                var self = this;
                self.el.undelegate();    
                self.el.find(".pagination-num").attr('data-total', self.totalPage);
                self.el.delegates({
                    '.pagination-num': {
                        'keypress': function(e) {
                            var keyCode = e.keyCode;
                            var typeVal = String.fromCharCode(keyCode); // 根据event.keyCode获取字符
                            var val     = e.target.value;

                            // 设置页码的输入框的字符长度
                            $(this).attr('maxlength', self.totalPage.toString().length);
                            
                            if (keyCode > 47 && keyCode < 58){  // only Int
                                val += typeVal;         

                                if (val > self.totalPage) val = self.totalPage;
                                e.target.value = parseInt(val);

                            }else if (keyCode == 13) {  //回车

                                setTimeout(function() {
                                    self.el.find('a.jump').trigger("click");
                                }, 50)
                            }

                            return false;

                        }
                    },
                    'a.jump': function(event) {
                        event.preventDefault();
                        var value = parseInt(self.el.find(".pagination-num").val(), 10);
                        if (!value) {
                            self.el.find(".pagination-num").val('').focus();
                            return;
                        };
                        var totalPage = ($(this).attr('data-total') || self.totalPage) - 0;
                        value = Math.max(Math.min(value, totalPage), 1);
                        self.callback && self.callback({page:value});
                    },
                    'a': function(event) {
                        event.preventDefault();
                        if ($(this).hasClass('active') || $(this).hasClass('jump')) {
                            return true;
                        };
                        self.el.find('a.active').removeClass('active');
                        $(this).addClass('active');
                        self.callback && self.callback({page: $(this).data('page') | 0});
                    }
                })
            }
        }
    });
})