/**
 * 自定义列的table组件
 * dom上面需要绑定的额外的属性：
 * 1. contentTable 元素上面增加属性data-default-col-url: 代表存储选择的自定义列的接口url。
 * 2. 用户初次打开页面，显示的列，是直接从后台打过来的变量，没有接口。将来可以更新下这个地方。
 */
define([
	"res/js/common/table_new",
	"res/js/common/jquery-tools"], function(base_table){
		var $ = window.jQuery,
			table_custom = $.extend(true, {}, base_table),
			initFunc = base_table.init;

		// 自定义table的init函数
		table_custom.init = function(container, listenHashChange, autoInit, config) {
			var self = this;
			// 处理授权
			this.allColumns = updateCertInfo(config.allColumns || []);
			this.defaultColNames = updateDefaultColCert(config.defaultColNames || [], this.allColumns);
			this.selectedCols = getSelectedCols(this.defaultColNames, this.allColumns);
			//将allColumns, selectedCols变量广播出去
			this.dispatchDataChange();
			//table的init函数
			initFunc.apply(this, arguments);

			//增加选取自定义列确认按钮的监听函数
			$(document).on("custom-column", function(e, data) {
				self.listenToDataChange(data.selectedCols);
			});
		};

        /**
         * 将selectedCols绑定到this.data上面，方便tpl文件做编译
         */
		table_custom.afterRequest = function() {
			this.data.selectedCols = this.selectedCols;
		};

		//自定义列表头
		table_custom._buildThead = function(theadSelector) {
			this.thead.html($.tpl($("#" + theadSelector).html(), this.selectedCols));

		};
		table_custom.listenToDataChange = function(selectedCols) {
			this.selectedCols = selectedCols;
			this.data.selectedCols = selectedCols;
			//将新的数据广播出去
			this.dispatchDataChange();
			//更新页面
			this.reRender(this);

		}
		table_custom.dispatchDataChange = function() {
			$(document).trigger("custom-column-init-value",
				{
					allColumns: this.allColumns,
					selectedCols: this.selectedCols
				});
		}
		table_custom.reRender = function() {
			if (isColumnChange(this.selectedCols, this.allColumns)) {            //用户选择了不同的列
				//抽离所有被选中的列的id
				var self = this;
				this.defaultColNames = [];
				this.selectedCols.forEach(function(item) {
					self.defaultColNames.push(item.id);
				});

				//重新渲染
				this._buildTableStruct(this.tplTheadSelector);
				this._renderData(this.data);

				//发送请求存储自定义列
				var url = this.contentTable.data("default-col-url");
				$.postData(url, { select_column: this.defaultColNames.join(",") }, true).then(function(res) {
				}, function(res) {
					$.tips(res.reason);
				})
			}
		}
		table_custom._handleExport = function() {
			var pars = $.changeHash();
			pars["export"] = true;
			var columns = {};
			this.selectedCols.map(function(d){
				return columns[d.id] = d.label;
			})
			pars["columns"] = columns;
			$.postData(this.url, pars, true).then(function() {
				$.tips('操作成功，完成后您将从通知中心收到消息提醒！', true);
			})
		}

		/**
		 * 对所有列，根据当前平台信息和授权信息，去掉没有授权的列。
		 * @param  {[Array]} allColumns  [从静态配置文件中读取的所有列的信息]
		 * @return {[Array]}             [新的所有列]
		 */
		function updateCertInfo(allColumns) {
			return allColumns.filter(function(item, i) {
				if (item.cert) {
					var certInfo = item.cert.filter(function(d) {
						return typeof CERT_INFO.modules[d] != "undefined";
					})
					return (certInfo.length == 0 ? null : item);
				}
				else {
					return item;
				}
			});
		}

		/**
		 * 对默认列做授权过滤
		 * @param  {[Array]} defaultColNames [默认显示列的ID]
		 * @param  {[Array]} allColumns      [所有列]
		 * @return {[Array]}                 [过滤授权之后的新的默认列数组]
		 */
		function updateDefaultColCert(defaultColNames, allColumns) {
			var tempColNames = [];
			for (var p = 0; p < defaultColNames.length; p++) {
				var tempCol = allColumns.filter(function(col) {
					return col.id == defaultColNames[p];
				});
				if (tempCol.length) {
					tempColNames.push(tempCol[0].id);
				}
			}
			return tempColNames;
		}
		/**
		 * 根据默认列和所有列信息，得到所选列的新的数组，包括ID，name等等
		 */
		function getSelectedCols(defaultColNames, allColumns) {
			var selectedCols = [];
			for (var i = 0; i < defaultColNames.length; i++) {
				var colId = defaultColNames[i];
				allColumns.forEach(function(item) {
					if (item.id == colId) {
						var element = {};
						for (var i in item) {
							element[i] = item[i];
						};
						selectedCols.push(element);
					};
				});
			}
			return selectedCols;
		}

		/**
		 * 判断所选的列是否发生了变化
		 */
		function isColumnChange(selectedCols, defaultColNames) {
			if (selectedCols.length === defaultColNames.length) {
				for (var i = 0; i < selectedCols.length; i++) {
					if (selectedCols[i].id !== defaultColNames[i]) {
						return true;
					}
				}
				return false;
			}
			return true;
		}

		/**
		 * 初始化自定义表格
		 */
		$.table_custom = $.Class(table_custom);

		return table_custom;
	})