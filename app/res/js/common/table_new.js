define([
    "res/js/common/tab",
    "res/js/common/jquery-tools",
    "res/js/common/popup"
], function() {
    var $ = window.jQuery;

    var tableNew = {

        // 默认每页显示的数量
        LIMIT: 20,
        NO_DATA_MESSAGE: "查询数据为空",

        /**
         * 初始化
         * @param {String|$DOM} container 创建表格的容器
         * @param {Boolean} listenHashChange 是否自动响应hash的change，默认false
         * @param {Boolean} autoInit 是否自动初始化表格，默认true
         */
        init: function(container, listenHashChange, autoInit) {
            this.listenHashChange = listenHashChange;

            this.container = $(container);
            this.contentTable = this.container.find(".common-content-table");

            this.tableSwitch = this.container.find(".table-switch"); // 用于切换表格用
            this.activeSwitch = null;
            this.switchKey = this.tableSwitch.data("key") || "type";

            this.checkboxSelector = this.container.data("checkbox") || "tbody input[type=checkbox]";
            this.param = $.extend({ gid: 0 }, $.changeHash());
            this.limit = this.LIMIT;
            this.total = 0;
            this.url = "";
            this.noDataMessage = this.NO_DATA_MESSAGE;
            this.tplTheadSelector = "";
            this.tplTbodySelector = "";

            this.data = {};
            this.checked = [];
            this.dischecked = [];
            this.allChecked = false;

            this._mountTable();
            this._bindEvent();

            if (autoInit !== false) {
                this.request();
            }
        },

        /**
         * 表格请求前后事件、替换表格时候的自定义回调。
         */
        beforeRequest: null,
        afterRequest: null,
        afterReplaceContent: null,

        /**
         * 获取选中的行
         * @param {Boolean} useStr true 返回逗号连接的id字符串； false 返回id组成的数组
         * @return {String|Array} 选中的id们
         */
        getSelectedRows: function(useStr) {
            return this.allChecked ? {
                ids: useStr ? "ALL" : ["ALL"],
                except: useStr ? this.dischecked.join(",") : this.dischecked
            } : {
                ids: useStr ? this.checked.join(",") : this.checked,
                except: useStr ? "" : []
            }
        },

        /**
         * 发送数据请求
         * @param {String|Object} key 参数key或者参数object
         * @param {String} value 参数value，如果第一个参数为参数object，则忽略该参数
         * @return {Boolean} 不明所以，不知道返回这个true是做啥
         */
        request: function(key, value) {
            var _this = this;
            var param = this.param = $.changeHash();

            if ("string" === typeof key && key) {
                this.param[key] = value;
            } else if ("object" === typeof key) {
                $.extend(this.param, key);
            }

            param["limit"] = this.limit;

            // 加载更多时不需要重新count总数，加快接口返回
            if (this.limit !== this.LIMIT) {
                param["counting"] = false;
            }

            // 触发请求前的event
            if ("function" === typeof this.beforeRequest) {
                this.beforeRequest();
            }

            // 取消工具栏中的按钮的状态
            this.container.find(".common-content-tools a[data-request=true]").removeClass("available");
            this.container.find(".common-content-tools a[data-request=true]").removeClass("freeze");

            // 先取消上一次请求
            if (this._request && this._request.xhr && this._request.xhr.abort) {
                this._request.xhr.abort();
            }

            // 发起请求
            this._request = $.getJson(this.url, param, true)
                .done(function(res) {
                    _this.data = res.data;
                    _this.data.list = res.data.list || res.data.clients;
                    _this.total = _this.data.total || _this.total;
                })
                .fail(function() {
                    _this.data = { list: [], total: 0, "has_next": false };
                })
                .always(function() {
                    if ("function" === typeof _this.afterRequest) {
                        _this.afterRequest(_this.data);
                    }
                    _this._renderData(_this.data);
                });

            return this._request;
        },

        // 替换表格主体
        replaceContent: function(tpl) {
            this._buildTableStruct(tpl);
        },

        // 取消所有已绑定的事件
        destroy: function() {
            this.container.off();

            // 取消监听hashchange事件
            if (this.listenHashChange) {
                window.removeEventListener("hashchange", this._handleHashChange);
            }

            // 取消监听resize事件
            window.removeEventListener("resize", this._reflow);
        },

        // 初始化表格
        _mountTable: function() {
            var switchBtns;

            if (this.tableSwitch.size()) {
                // 如果存在多表格
                switchBtns = this.tableSwitch.find(".switch-btn");

                if (this.param[this.switchKey]) {
                    // 如果hash中指定了显示哪个tableSwitch
                    this.activeSwitch = switchBtns.filter("[data-value=" + this.param[this.switchKey] + "]");
                } else {
                    // 否则用第一个或者指定了active的那个
                    this.activeSwitch = switchBtns.filter(".active");
                    this.activeSwitch = this.activeSwitch.size() ? this.activeSwitch : switchBtns.eq(0);
                    this.param[this.switchKey] = this.activeSwitch.data("value");
                }

                switchBtns.removeClass("active");
                this.activeSwitch.addClass("active");
                // 从active的switch中取出参数、URL跟tpl的id
                this.url = this.activeSwitch.data("url");
                this.tplTheadSelector = this.activeSwitch.data("tpl");
                this.param = $.extend(this.param, $.queryUrl(this.activeSwitch.data("pars")));
                this.noDataMessage = this.activeSwitch.data("empty-message") || this.noDataMessage;
            } else {
                // 否则直接从.common-content-table中取URL、参数、跟tpl的id
                this.url = this.contentTable.data("url");
                this.tplTheadSelector = this.contentTable.data("tpl");
                this.param = $.extend(
                    this.param,
                    $.queryUrl(this.contentTable.data("pars")),
                    $.queryUrl(this.container.data("pars"))
                );
                this.noDataMessage = this.container.data("empty-message") ||
                    this.contentTable.data("empty-message") ||
                    this.noDataMessage;
            }

            $.changeHash(this.param);
            // 构建表格骨架
            this._buildTableStruct(this.tplTheadSelector);
        },

        // 构建表头
        _buildThead: function(theadSelector) {
            // 将表头跟表格架子添加到.common-content-table中
            this.thead.html($("#" + theadSelector).html());
        },

        // 构建表格骨架
        _buildTableStruct: function(selector) {
            var ths, tbodyHead;

            this.thead = $("<div class=\"common-table-head\"></div>");
            this.tbody = $([
                "<div class=\"common-table-body\">",
                "<table><thead><tr></tr></thead><tbody></tbody></table>",
                "</div>"
            ].join(""));

            this._buildThead(selector);
            ths = this.thead.find("th");
            tbodyHead = this.tbody.find("thead tr");
            // 添加“伸缩列宽的把手”跟“排序小按钮”
            ths.append("<b></b>").find("span.sort").append("<i></i>");
            // 添加模拟的表头用来决定下方表体列宽
            ths.each(function(el) {
                if (el.width) {
                    tbodyHead.append("<th width=\""+el.width+"\"></th>");
                } else {
                    tbodyHead.append("<th></th>");
                }
            })
            this.contentTable.html("").append(this.thead).append(this.tbody);
            // 获得表体的tpl选择器
            this.tplTbodySelector = this.thead.find("table").data("tpl");
            // 绑定滚动事件
            this.tbody.on("scroll", this._handleScroll.bind(this));
        },

        // 绑定事件
        _bindEvent: function() {
            var _this = this;

            // 绑定事件
            this.contentTable.on("click", ".btn-loadmore",
                _this._handleLoadMore.bind(_this));
            this.contentTable.on("click", "th[data-sort] span",
                _this._handleSort.bind(_this));
            this.contentTable.on("click", "#selectAllPage",
                _this._handleSelectAll.bind(_this));
            this.contentTable.on("mousedown", "thead th>b",
                _this._handleTheadResize.bind(_this));
            this.contentTable.on("change", this.checkboxSelector,
                _this._handleSelect.bind(_this));

            this.container.on("click", ".table-switch .switch-btn",
                _this._handleTableChange.bind(_this));
            this.container.on("click", ".common-content-tools a[data-request=true]",
                _this._handleToolbarAction.bind(_this));

            // 导出操作
            this.container.on("click", ".export",
                _this._handleExport.bind(_this));

            // 筛选相关的事件响应
            if (_this.container.find(".btn-filter").size()) {
                this.container.on("click", ".btn-filter",
                    _this._handleFilter.bind(_this));
                this.container.on("click", ".filter-empty",
                    _this._handleResetFilter.bind(_this));
                this.container.on("change", ".filter-choice input",
                    _this._handleFilterInputChange.bind(_this));
                this.container.on("change", ".filter-choice .subinput",
                    _this._handleFilterSubInputChange.bind(_this));
            }

            // 监听hashchange事件，以刷新表格
            if (this.listenHashChange) {
                // hack手段，changeHash是个异步的过程，强制延后添加响应函数
                this._handleHashChange = _this._handleHashChange.bind(_this);
                setTimeout(function() {
                    window.addEventListener("hashchange", _this._handleHashChange);
                });
            }

            // 监听resize事件，以重新reflow表格
            this._reflow = this._reflow.bind(this);
            window.addEventListener("resize", this._reflow);
        },

        // 重置排序
        _resetSort: function() {
            this.contentTable.find("th span.sort-top", "th span.sort-btm").attr("class", "sort");
            this.param.sort = null;
            this.param.asc = null;
        },

        // 重置勾选状态
        _resetCheck: function() {
            this.contentTable.find("#selectAllPage")
                .prop("checked", false)
                .prop("disabled", !this.data || !this.data.list || !this.data.list.length)
                .prop("indeterminate", false);
            this.allChecked = false;
            this.checked = [];
            this.dischecked = [];
            this._judgeToolBtnState();
        },

        // 渲染数据
        _renderData: function(data) {
            // 如果不是表格，则可以通过自定义事件afterRequest进行渲染
            var tbody = this.contentTable.find(".common-table-body tbody");
            // var table = this.contentTable.find("table");
            // var tbody = this.contentTable.find("tbody");
            var thCount, trTpl;

            if (!tbody.size()) {
                return;
            }

            // 表头的数量（不包含隐藏的表头）
            thCount = this.thead.find("thead th:not(.none)").size();

            // 渲染数据
            if (data.list && data.list.length) {
                // 如果有数据
                trTpl = $("#" + this.tplTbodySelector).html();
                tbody.html($.tpl(trTpl, data));
                // 如果还能加载更多
                if (data["has_next"]) {
                    tbody.append([
                        "<tr>",
                        "<td class=\"btn-loadmore\" colspan=\"" + thCount + "\">",
                        "("+ data.list.length +"/" + this.total + ") ",
                        "加载更多...",
                        "</td>",
                        "</tr>"
                    ].join(""));
                } else {
                    tbody.append([
                        "<tr>",
                        "<td class=\"no-more\" colspan=\"" + thCount + "\">",
                        "("+ data.list.length +"/" + this.total + ") ",
                        "已显示所有数据",
                        "</td>",
                        "</tr>"
                    ].join(""));
                }
            } else {
                // 如果没有数据
                tbody.html("<tr><td colspan=\"" + thCount + "\">" + this.noDataMessage + "</td></tr>");
                $("#selectCurrentPage, #selectAllPage").prop("disabled", true);
            }

            this._reflow();
            this._judgeToolBtnState();

            // 只有在加载更多的情况下才保持勾选状态，其它重新请求的情况都不保留
            if (this.limit === this.LIMIT) {
                this._resetCheck();
            } else {
                this._selectCheckbox();
            }

            if ("function" === typeof this.afterReplaceContent) {
                this.afterReplaceContent(this.data);
            }
        },

        // 根据表格的选中数据选中checkbox
        _selectCheckbox: function() {
            var _this = this;

            _this._judgeIndeterminate();
            // 如果有选中
            if (this.allChecked || !this.allChecked && this.checked.length) {
                this.contentTable.find("tbody tr").each(function(i, el) {
                    var id = $(el).data("id");
                    if (_this.allChecked && _this.dischecked.indexOf(id) < 0 ||
                        !_this.allChecked && _this.checked.indexOf(id) >= 0) {
                        $(el).find("input[type=checkbox]").prop("checked", true);
                    }
                });
            }
        },

        // 重新对齐表头跟表体
        _reflow: function() {
            var theadThs, tbodyThs;

            // 表头跟随表体是否出现滚动条
            if (this.tbody.find("table").height() > this.tbody.height()) {
                this.thead.css("overflow-y", "scroll");
            } else {
                this.thead.css("overflow-y", "hidden");
            }

            theadThs = this.thead.children("table").children("thead").find("th");
            tbodyThs = this.tbody.children("table").children("thead").find("th");

            tbodyThs.each(function(i, el) {
                var th = theadThs.get(i);
                var td = el;
                td.width = th.width = th.getBoundingClientRect().width;
            })
        },

        // 判断全选按钮的状态
        _judgeIndeterminate: function() {
            var checkboxAll = this.contentTable.find("#selectAllPage");

            // 以下是设置全选框状态的逻辑
            if (this.allChecked && this.dischecked.length === +this.data.total ||
                !this.allChecked && !this.checked.length) {
                // “全部反选”或者“全部没选”
                this.allChecked = false;
                this.dischecked = [];
                this.checked = [];
                checkboxAll.prop("checked", false).prop("indeterminate", false);
            } else if (!this.allChecked && this.checked.length === +this.data.total ||
                this.allChecked && !this.dischecked.length) {
                // “全部选中”或者“钩上全部反选”
                this.allChecked = true;
                this.dischecked = [];
                this.checked = [];
                checkboxAll.prop("checked", true).prop("indeterminate", false);
            } else if (this.allChecked && this.dischecked.length) {
                // 全选中，且有部分反选
                checkboxAll.prop("checked", true).prop("indeterminate", true);
            } else if (!this.allChecked && this.checked.length) {
                // 未全选，且有部分选中
                checkboxAll.prop("checked", false).prop("indeterminate", true);
            }
        },

        // 修改工具栏按钮状态
        _judgeToolBtnState() {
            var toolBtns = this.container.find(".common-content-tools a[data-request=true]");

            if (!this.allChecked && !this.checked.length) {
                toolBtns.toggleClass("freeze", true).toggleClass("available", false);
            } else {
                toolBtns.toggleClass("freeze", false).toggleClass("available", true);
            }
        },

        // handle表体左右滚动事件
        _handleScroll: function() {
            this.thead.get(0).scrollLeft = this.tbody.get(0).scrollLeft;
        },

        /**
         * hashchange事件：需要重置limit，sort，asc（应该不会有人用changeHash来实现排序吧，有的话弄死他）
         * @return {void}
         */
        _handleHashChange: function() {
            var hash = $.changeHash();
            this._resetCheck();
            if (!hash.sort) {
                this._resetSort();
            }
            this.param = $.extend(this.param, hash);
            this.limit = this.LIMIT;
            this.request();
        },

        /**
         * 加载更多数据事件
         * @return {void}
         */
        _handleLoadMore: function() {
            this.limit += this.LIMIT;
            this.request();
        },

        /**
         * 排序事件
         * @return {void}
         */
        _handleSort: function(e) {
            var $this = $(e.currentTarget);
            var $thead = $this.parents("tr");
            var sort = $this.parent("th").data("sort");
            var asc = !$this.hasClass("sort-top");

            $thead.find(".sort-top, .sort-btm").attr("class", "sort");
            $this.attr("class", asc ? "sort-top" : "sort-btm");

            this.limit = this.LIMIT;
            this._resetCheck();

            $.changeHash({
                sort: sort,
                asc: asc,
                limit: this.LIMIT
            });
        },

        // 全选事件
        _handleSelectAll: function(e) {
            var checked = e.currentTarget.checked;

            this.allChecked = checked;
            this.checked = [];
            this.dischecked = [];

            if (checked) {
                this.contentTable.find("tbody input[type=checkbox]").prop("checked", true);
                $.tips("已勾选所有共计" + this.total + "项", true);
            } else {
                this.contentTable.find("tbody input[type=checkbox]").prop("checked", false);
            }

            this._judgeToolBtnState();
        },

        // 单选事件
        _handleSelect: function(e) {
            var checkbox = $(e.currentTarget);
            var checked = e.currentTarget.checked;
            var tr = checkbox.parents("tr");
            var id = tr.data("id");

            switch (true) {
                case checked && !this.allChecked:
                    this.checked.push(id);
                    break;
                case !checked && this.allChecked:
                    this.dischecked.push(id);
                    break;
                case checked && this.allChecked:
                    this.dischecked = this.dischecked.filter(function(d) {
                        return d !== id;
                    })
                    break;
                case !checked && !this.allChecked:
                    this.checked = this.checked.filter(function(d) {
                        return d !== id;
                    })
                    break;
            }

            this._judgeIndeterminate();
            this._judgeToolBtnState();
        },

        // 表格切换事件
        _handleTableChange: function(e) {
            var $this = $(e.currentTarget);
            var param = $.queryUrl($this.data("pars"));

            this.tableSwitch.find(".switch-btn")
                .removeClass("active")
                .find(".triangle")
                .appendTo($this);
            $this.addClass("active");

            param[this.switchKey] = $this.data("value");
            param["t"] = Date.now();

            // 重置参数
            delete this.param.sort;
            delete this.param.asc;
            delete this.param.search_col;
            delete this.param.search_key;

            // 重置limit
            this.limit = this.LIMIT;

            $.extend(this.param, param);

            this.tplTheadSelector = $this.data("tpl") || this.tplTheadSelector;
            this.noDataMessage = $this.data("empty-message") || this.NO_DATA_MESSAGE;
            this.url = $this.data("url") || this.url;
            this._buildTableStruct(this.tplTheadSelector);

            param.sort = null;
            param.asc = null;
            param.search_col = null;
            param.search_key = null;

            $.changeHash(param);

            if (!this.listenHashChange) {
                this.request();
            }
        },

        // 表头拖动调整大小
        _handleTheadResize: function(e) {
            var $this = $(e.currentTarget);
            var $root = $(document.body);
            var xStart = e.clientX;
            var th, tbodyTh, index, width;

            th = $this.parent("th");
            index = th.index();
            width = +th.attr("width");

            tbodyTh = this.tbody.find("th").eq(index);

            function handleTheadResize(e) {
                var w = width +  e.clientX - xStart;
                w = w > 2 ? w : 2;
                th.attr("width", w);
                tbodyTh.attr("width", w);
            }

            $root.one("mouseup", function() {
                $root.off("mousemove", handleTheadResize);
            })
            $root.on("mousemove", handleTheadResize);
        },

        // 工具栏按钮点击事件
        _handleToolbarAction: function(e) {
            e.preventDefault();

            var _this = this;
            var def = new $.Deferred();
            var $this = $(e.currentTarget);
            var needRefresh = $this.data("refresh");
            var info, param, idKeyName, checkedLength;

            if (!this.allChecked && !this.checked.length) {
                info = $this.attr("nosel-info") || $.tmp && $.tmp["nosel-info"] || "请选择要操作的数据";
                $.tips(info)
                return false;
            }

            // 获取参数
            checkedLength = this.allChecked ? this.data.total - this.dischecked.length : this.checked.length;
            idKeyName = $this.data("key") || "mids";
            param = $.queryUrl($this.data("pars"));
            param[idKeyName] = this.allChecked ? "ALL" : this.checked.join(",");
            param["except"] = this.allChecked ? this.dischecked.join(",") : null;
            // 带上表格的一些筛选参数
            param = $.extend({}, this.param, param);

            function commitAction() {
                _this.commonBtnEvent($this, param, checkedLength, function() {
                    if (needRefresh) {
                        _this.request();
                    }
                })
            }

            // 如果工具栏按钮可点击，也即选中了数据
            if (!$this.hasClass("freeze")) {
                if ($this.data("setting")) {
                    $this.trigger("beforecommonBtnEvent", [def]);
                    def.done(function() {
                        commitAction();
                    });
                } else {
                    commitAction();
                }

            }
        },

        // 提交工具栏按钮点击请求
        commonBtnEvent: function($btn, param, length, callback) {
            var _this = this;
            var url = $btn.attr("href") || $btn.data("url");
            var result;

            if (!url) {
                return false;
            }

            // beforeSend事件
            result = $.event.trigger("beforeSend", param, $btn.get(0));

            $.getPromise(result, result).then(function(res) {
                var data = res || {};
                var pars = $.queryUrl($btn.data("pars"));
                var reload = $btn.data("reload");
                var confirm = $btn.data("confirm");
                var confirmMinNum = $btn.data("confirm-min") || 0;

                if (confirm && confirmMinNum && length <= confirmMinNum) {
                    confirm = false;
                }

                pars = $.extend({}, param, pars, data);

                function operate() {
                    $.postData(url, pars, true).then(function() {
                        $.tips("操作成功", true);
                        if ("function" === typeof callback) {
                            callback();
                        }
                        if (reload) {
                            setTimeout(function() {
                                _this.request();
                            });
                        }
                    })
                }

                if (confirm) {
                    $.confirm({
                        message: confirm
                    }).done(function() {
                        operate()
                    })
                } else {
                    operate();
                }
            })
        },

        // 导出按钮点击
        _handleExport: function(e) {
            var pars = $.changeHash();

            pars["export"] = true;
            pars["limit"] = this.LIMIT;

            $.postData(this.url, pars, true).then(function() {
                $.tips("操作成功，完成后您将从通知中心收到消息提醒！", true);
            })

        },

        // 点击筛选按钮
        _handleFilter: function(e) {
            var _this = this;
            var $this = $(e.currentTarget);
            var filterWrapper = _this.container.find(".filter-choice");
            var FILTER_URL = $this.data("filter_href") || "/client/client/filters";

            if ($this.hasClass("active")) {
                filterWrapper.hide().empty();
                $this.removeClass("active");
                _this.param["tags"] = null;
                _this.param["is_online"] = null;
                _this.param["believe"] = null;
                $.changeHash({
                    "tags": null,
                    "is_online": null,
                    "believe": null
                });
            } else {
                $this.addClass("active");
                $.getJson(FILTER_URL, {}, true).then(function(res) {
                    // 过滤掉平台中没有子项的数据
                    var filterData = res.data["操作系统"], osList = [];
                    var filterTplSelector = $this.attr("data-tpl");
                    var filterTpl = $("#" + filterTplSelector).html();

                    console.log(e);

                    if (!$this.hasClass("active")) {
                        return false;
                    }

                    if (filterData && filterData.length) {
                        filterData.forEach(function(d) {
                            if (d["sub_os"]) {
                                osList.push(d);
                            }
                        });
                        res.data["操作系统"] = osList;
                    }

                    filterWrapper.html($.tpl(filterTpl, res.data)).show();
                })
            }
        },

        // 筛选条件变更
        _handleFilterInputChange: function(e) {
            var _this = this;
            var $this = $(e.currentTarget);
            var filter = $this.attr("filter");
            var tags = [], hashMap = {}, input, osBox;

            switch (filter) {
                case "tags":
                    _this.container.find(".filter-choice input[filter=tags]").each(function(i, el) {
                        if ($(el).prop("checked")) {
                            tags.push($(el).val());
                        }
                    })
                    // 手动把param值null，不然changeHash无法从param中干掉tags
                    _this.param["tags"] = tags.length ? tags.join(",") : null;
                    $.changeHash({
                        tags: _this.param["tags"]
                    });
                    break;
                case "is_online":
                    input = [].slice.call($this.closest("div").find("input:checked")).map(function(el){
                        return el.value
                    });
                    _this.param["is_online"] = input.length ? input.join(',') : null;

                    $.changeHash({
                        "is_online": _this.param["is_online"]
                    });
                    break;
                case "type":
                    osBox = $this.next("label").find(".os_box");
                    if (osBox.size()) {
                        osBox.find("input").prop("checked", $this.prop("checked")).change();
                    }
                    break;
                default:
                    input = [].slice.call($this.closest("div").find("input:checked")).map(function(el){
                        return el.value
                    });
                    hashMap[filter] = _this.param[filter] = input.length ? input.join(',') : null;
                    $.changeHash(hashMap);
            }
        },

        // 筛选 - 操作系统子分类的勾选
        _handleFilterSubInputChange: function(e) {
            var $this = $(e.currentTarget);
            var $ul = $this.parents("ul");
            var inputs = $ul.find("input");
            var checkboxes = $ul.find("input:checked");
            var parentInput = $this.parents("label").prev("input");
            var osType = [];

            if (checkboxes.size() && checkboxes.size() === inputs.size()) {
                parentInput.removeClass("checkbox_true_part").prop("checked", true);
            } else if (checkboxes.size()) {
                parentInput.addClass("checkbox_true_part").prop("checked", false);
            } else {
                parentInput.removeClass("checkbox_true_part").prop("checked", false);
            }
            checkboxes.each(function(i, el) {
                osType.push($(el).val());
            })
            $this.parents("label").attr("os_type", osType.join(","));
        },

        // 重置筛选按钮点击
        _handleResetFilter: function() {
            this.container.find(".btn-filter").click();
        }
    }

    $.tableNew = $.Class(tableNew);

    return tableNew;
});
