define('js/common/csvfileupload',['js/common/jquery-tools','module/webuploader/webuploader'],function(){
	var CSVFileUpload = {
        upLoadPath: null,
        init: function() {
            this._bind();
        },
        showDoing: function(){
            $('.groupimport .note .doing').show();
        },
        hideDoing: function(){
            $('.groupimport .note .doing').hide();
        },
        showCSV: function(data) {
            var tbody = $('.import-table').find('table tbody');
            var data_string = '';
            this.upLoadPath = data.path;
            $.each(data.groups,function(i,val){
               data_string += '<tr><td>'+val.name+'</td><td>'+val.description+'</td><td>'+val.parent_name+'</td>';

               if(val.ip_rules && val.ip_rules.length != 0){
                    data_string += '<td title="'+val.ip_rules.join(',')+'">';
                    $.each(val.ip_rules,function(j,ip){
                        data_string += ip+',';
                    })
                    data_string += '</td>';
               }

               data_string+='</tr>';

            })
            tbody.append($(data_string));
        },
        _bind: function() {
            var self = this;
            var uploader = WebUploader.create({
                // 选完文件后，是否自动上传。
                auto: true,
                
                name:'file_data',
                fileVal:'file_data',
                // swf文件路径
                swf: '/res/moudle/webuploader/Uploader.swf',

                // 文件接收服务端。
                server: '/host/clientfilter/import',

                pick:{
                    id:'#file_select',
                    multiple:false
                },

                formData:{
                    act:'upload',
                    filter_type:$('input[name=filter]').val(),
                    file_data:name,
                    YII_CSRF_TOKEN:SYS_CONF.csrf_token
                },

                // 只允许选择csv文件。
                accept: {
                    title: 'excel',
                    extensions: 'csv'
                }
            });
            
            uploader.on('fileQueued',function(file){
                 $('#files_name').val(file.name).attr('fid',file.id);
                 //ip = $('input[type="radio"]:checked').val();
            })

            uploader.on( 'uploadBeforeSend', function( block, data ) {
              data.filter_type  = $('input[name=filter]:checked').attr('value');
              data.file_data    = $('#files_name').val();
            });


            uploader.on('uploadProgress', function(file, percentage) {
               //self.showDoing();
            });

            uploader.on('uploadSuccess', function(file, response) {
                if(response.result==0)
                    $.tips('上传成功',true);
                else
                    $.alert('提示',response.reason);
                //self.hideDoing();
                //self.showCSV(response.data);
                uploader.trigger('reset')
                $('.importOption, .import-table').stop().slideDown();
            });

            uploader.on('uploadError', function() {
                uploader.trigger('reset')
            });
                        

        }
    };
    return CSVFileUpload;
});