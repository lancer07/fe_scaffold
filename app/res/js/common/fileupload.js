define('res/js/common/fileupload',['res/js/common/jquery-tools','vendor/webuploader/webuploader'],function(){


    var FileUpload = {
        upLoadPath:  null,
        SUPPORT_EXT: '',
        FORMAT_ERROR_TIPS:'',
        init: function(data) {
            var obj = data.ext || data;
            obj = obj.split(',');
            this.SUPPORT_EXT = obj || '*';     //设置允许接收的文件格式
            this.FORMAT_ERROR_TIPS = obj === '*' ? '' : '请选择.' + obj + '格式的文件;';
			if (data.server) {
				this._bind(data.server);
			}else{
				this._bind();
			}
            if (data.previewData && typeof(data.previewData) == 'function'){
                 this.showCSV = data.previewData;
            }
        },
        showDoing: function(){
            $('.groupUploading').show();
        },
        hideDoing: function(){
            $('.groupUploading').hide();
        },
        showCSV: function(data) {
            var tbody = $('.import-table').find('table tbody');
            var data_string = '';
            this.upLoadPath = data.path;
            $.each(data.groups,function(i,val){
               data_string += '<tr><td>'+val.name+'</td><td>'+val.description+'</td><td>'+val.parent_name+'</td>';

               if(val.ip_rules && val.ip_rules.length != 0){
                    data_string += '<td width="25%" title="'+val.ip_rules.join(',')+'">';
                    $.each(val.ip_rules,function(j,ip){
                        data_string += ip+',';
                    })
                    data_string += '</td>';
               }

               data_string+='</tr>';

            })
            tbody.append($(data_string));
        },
        _bind: function(server,filtertype) {
            var self = this;
            var uploader = WebUploader.create({
                // 选完文件后，是否自动上传。
                auto: true,

                name:'file_data',

                fileVal:'file_data',
                // swf文件路径
                swf: '/res/moudle/webuploader/Uploader.swf',

                // 文件接收服务端。
                server: server || '/client/group/import',

                pick:{
                    id:'#file_select',
                    multiple:false
                },

                formData:{
                    act:'upload',
                    filter_type:filtertype,
                    file_data:'file_data',
                    YII_CSRF_TOKEN:SYS_CONF.csrf_token
                },


                accept: {
                    extensions: self.SUPPORT_EXT.join(','),
                }
            });
            uploader.on('beforeFileQueued',function(file){
                if (self.SUPPORT_EXT === '*' || file.ext === self.SUPPORT_EXT) return true;
                //增加一个支持的类型csv
                if(self.SUPPORT_EXT.length) {
                    for(var i = 0 ; i < self.SUPPORT_EXT.length;i++) {
                        if(self.SUPPORT_EXT[i] === file.ext || self.SUPPORT_EXT[i] === '*') {
                            return true;
                        }
                    }
                }

                // if (self.SUPPORT_EXT === '*' || file.ext === self.SUPPORT_EXT) return true;


                // 文件格式不符合；
                return $.tips(self.FORMAT_ERROR_TIPS);
            })
            uploader.on('fileQueued',function(file){

                 $('#files_name').val(file.name).attr('fid',file.id);
            })

            uploader.on( 'uploadBeforeSend', function( block, data ) {
                //console.log(data);
            });


            uploader.on('uploadProgress', function(file, percentage) {
               self.showDoing();
            });

            uploader.on('uploadSuccess', function(file, response) {
                self.hideDoing();
                uploader.trigger('reset');
                if(response.result){
                    $.tips(response.reason);
                    return;
                }
                
                $.tips('上传成功',true);
                $('.import-table').find('table tbody').empty();
                self.showCSV(response.data);
                $('.importOption, .import-table').stop().slideDown();
            });

            uploader.on('uploadError', function() {
                self.hideDoing();
                uploader.trigger('reset');
            });


        }
    };
    return FileUpload;
});
