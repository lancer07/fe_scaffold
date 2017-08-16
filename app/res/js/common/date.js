define('res/js/common/date',['vendor/My97DatePicker/WdatePicker'],function(){
	var date = {
		init:function(){
			$(document).on('click','.Wdate',function(){
				var maxDate = $(this).attr('data-max') || '2037-01-01';
				var options = {
				    isShowClear: false,
				    readOnly: true,
				    maxDate: maxDate
				};
				$(this).attr('data-min') && (options['minDate'] = $(this).attr('data-min'));
				WdatePicker(options);
			})
			
		}
	}
	date.init();
	return date;
});
