<template>
    <transition name="popup-fade">
        <div class="popup" v-if="visible">
            <div class="popup-content">
                <div class="popup-header">
                    <a class="popup-close" @click="close"><i class="fa fa-close"></i></a>
                    <h5 :title="title">{{title}}</h5>
                    <!--<a class="popup-close"><i class="fa fa-close"></i></a>-->
                </div>
                <div class="popup-body vue-popup-body" v-if="popupType == ''">
                    <slot></slot>
                </div>
                <div class="popup-body vue-popup-body" v-if="popupType == 'confirm'">
                    <p class="confirm-tip">
                        <span class="popup_icon confirm_icon"></span>确定要继续操作吗？
                    </p>
                </div>
                <div class="popup-footer">
                    <button href="javascript:;" class="popup-footer-confirm" v-if="showConfirm" @click="confirm">确认</button>
                    <button href="javascript:;" class="popup-footer-cancel" @click="close">取消</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "VuePopup",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ""
            },
            popupType: {
                type: String,
                default: "" // 空：显示传入的内容；confirm：显示确认提示框
            },
            showConfirm: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            close() {
                // this.visible = false;
                // this.isShow = false;
                this.$emit("close")
            },
            confirm() {
                this.$emit("confirm")
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .vue-popup-body {
        color: #666;
        font-size: 12px;
        padding: 5px 15px;
        overflow-y: auto !important;
        max-height: 600px;
    }
    .popup-footer>button  {
        line-height: initial;
    }

    .popup-fade-enter-active, .popup-fade-leave-active {
        transition: opacity .2s
    }
    
    .popup-fade-enter, .popup-fade-leave-active {
        opacity: 0
    }
</style>