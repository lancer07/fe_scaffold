<template>
    <div class="sdf">
        <div id="filePicker">选择文件</div>
        <VueTips v-model="isShowTips" delay="4000">
            {{tipsMessage}}
        </VueTips>
    </div>
</template>

<script>
    import VueTips from "../VueTips"

    export default {
        components:{
            VueTips  
        },
        data() {
            return {
                isShowTips: false,
                tipsMessage: "",
                filePickerId: `filePicker_${new Date().getTime()}`,
                fileUpload: {}
            }
        },
        props: {
            extensions: String
        },
        mounted() {
            this.fileUpload = this.initFileUpload()
        },
        methods: {
            initFileUpload() {
                let vm = this;
                let objUpload = WebUploader.create({
                    auto: true,
                    server: "/dlp/chanlprotecttpl/watermarkbgimgupload",
                    pick: {
                        id: "#filePicker",
                        multiple: false
                    },
                    formData: {
                        YII_CSRF_TOKEN: SYS_CONF.csrf_token
                    },
                    accept: {
                        title: 'test',
                        extensions: vm.extensions
                    }
                }).on('beforeFileQueued', (file) => {
                    // var currentFile = objUpload.getFiles()[0];
                    // if (file.ext !== 'jpg') {
                    //     // $.tips('文件必须为jpg结尾的压缩包！', false);
                    //     return false;
                    // }
                    // if (currentFile) {
                    //     objUpload.removeFile(currentFile);
                    // }
                    // return true;
                }).on('fileQueued', (file) => {
                    // $(".file-name").text(file.name);
                    // fileName = file.name;
                    // $(".js-upload-progress").css({width: "0%"})
                }).on('uploadProgress', (file, percentage) => {
                    // var progress = (percentage * 100) + "%"
                    // $(".js-upload-progress").css({width: progress})
                }).on('uploadSuccess', (file, res) => {
                    this.$emit("uploadSuccess", res)
                }).on('uploadError', (file, reason) => {
                    this.tipsMessage = reason,
                    this.isShowTips = true;
                }).on('error', (type) => {
                    switch(type){
                        case 'F_EXCEED_SIZE':
                            var fileSize = objUpload.option('fileSingleSizeLimit') / 1024 / 1024;
                            // $.tips('文件大小不能超过' + fileSize + 'M');
                            break;
                        case 'Q_TYPE_DENIED':
                            var fileType = objUpload.option('accept')[0].extensions;
                            console.log(fileType)
                            this.tipsMessage = `请选择正确的文件类型（ ${fileType} ）`,
                            this.isShowTips = true;
                            break;
                    }
                });

                return objUpload;
            }
        }
    }
</script>

<style lang="less">
    .webuploader-pick {
        height: 28px;
        line-height: 28px;
        color: #666;
        padding: 0 1em;
        border: 1px solid #ccc;
        background: #eff2f4;
        border-radius: 2px;
    }
</style>