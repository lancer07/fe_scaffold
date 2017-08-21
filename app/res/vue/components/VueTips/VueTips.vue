<template>
    <transition name="tips-fade">  
        <div v-show="visible" class="tips clearfix" v-bind:class="type">
            <i class="tips-icon"></i>
            <span class="tips-txt">
                <slot></slot>
            </span>
        </div>
    </transition>
</template>

<script>
    import Popup from "vue-popup"

    export default {
        name: 'VueTips',
        mixins: [Popup],
        props: {
            type : {
                type: String,
                default: "warning"
            },
            delay: {
                type: String,
                default: "4000"
            }
        },
        data () {
            return { 
                visible: false 
            }
        },
        methods: {
            closeTips() {
                this.value = false;
            }
        },
        watch: {
            value(val) { 
                this.visible = val; 
            }, 
            visible(val) {
                if (val) { 
                    setTimeout(() => {
                        this.close();
                    }, this.delay)
                    this.$emit('open'); 
                } else {
                    this.$emit('close');
                }
            }
        }
    }
</script>

<style>
    .tips-fade-enter-active, .tips-fade-leave-active { 
        transition: opacity .7s 
    } 
    
    .tips-fade-enter, .tips-fade-leave-active{ 
        opacity: 0 
    }
</style>