define('res/js/common/highcharts',['vendor/highcharts-4.1.4/highcharts'],function(HighCharts){
	var charts = {
		config :{},
		drawCharts:function(config){
			var self = this;
			if(!config){
				return;
			}
			var chartsArray = [];
			 Highcharts.setOptions({
		        colors: ['#ff8b5d','#5691d3','#dd4a4a','#EBC941', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
		        lang : {
		        	drillUpText: '返回上一级'
		        },
		        legend: {
		        	itemStyle: {
		        		color: '#666',
	        			fontWeight: 'normal',
	        			fontFamily: '微软雅黑'
		        	}
		        },
		        yAxis:{
		        	min : 0
		        },
		        credits : {
		        	enabled: false,
					href:'http://b.360.cn/',
					text:'360',
					style:{
						"font-size": '12px',
						"color":'#A0A0A0'
					}
				}
		    });
			for(var i=config.length-1; i>=0;i--){
				config[i] = $.extend({highchartsTable:false},config[i]);
				chartsArray[config[i].container] = $(config[i].container).highcharts(config[i].chartsConfig);
				if(config[i].highchartsTable){
					self.highchartTable({
						data:config[i].data,
						container:config[i].container
					});
				}
			}
			return chartsArray;

		},
		highchartTable:function(options){
			var table = $('<table class="charts_table"><thead></thead><tbody></tbody></table>');
			var thead_string = '<tr>';
			var tbody_string = '';
			for(var i=0; i<options.data.length;i++){
				if(i%2===0){
					tbody_string+='<tr>';
				}else{
					tbody_string+='<tr class="odd">';
				}

				for(index in options.data[i]){
					if(i==0){
						thead_string+='<th>'+index+'</th>';
					}
					tbody_string+='<td>'+ options.data[i][index]+'</td>'
				}
				tbody_string+='</tr>';
			}

			thead_string+='</tr>';
			tbody_string+='</tr>'
			$(thead_string).appendTo(table.find('thead'))
			$(tbody_string).appendTo(table.find('tbody'))
			table.appendTo($(options.container))
		}
	}
	return charts;
});
