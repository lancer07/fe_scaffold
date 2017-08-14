<template>
    <div class="vue-tabs">
        <div class="vue-tabs-header-wrapper">
            <ul class="vue-tabs-header">
                <li v-for="(tab, index) in tabsData" @click='handleTabClick(index)' :class="tab.active?'active':''" :key="tab.key" v-if="tab.isShow">
                    {{tab.name}}
                </li>
            </ul>
        </div>
        <!--<div class="vue-tabs-content">-->
            <VueTabsPanel 
                v-for="(tab, index) in tabsData" 
                v-if="tabsData[index] && tabsData[index].active"
                :pageData="pageData"
                :pageMapData="pageMapData"
                :tabsData="tabsData[index]"
                :key="index"
            />
        <!--</div>-->
    </div>
</template>

<script>
    import Vue from 'vue'
    import VueTabsPanel from "./VueTabsPanel";

    import { createTabData, registerComponent } from "./utils"

    export default {
        name: "VueTabs",
        components: {
            VueTabsPanel
        },
        props: {
            "initData": Object,
            "pageMapData": Object,      // 生成tab页面和页面包含组件的配置信息
            "pageData": Object,         // 每个组件需要的数据
            "componentsPath": String,   // 动态加载组件的相对路径
            "selectTabKey": String      // 需要默认选择的tab页卡
        },
        data() {
            return {
                selectTab: 0,
                tabsData: []
            }
        },
        methods: {
            handleTabClick(index){
                if(this.tabsData[index]) {
                    for(let key in this.tabsData) {
                        this.tabsData[key].active = false;
                    }

                    this.tabsData[index].active = true;
                    this.selectTab = index;

                     this.$emit('tabClick', this.tabsData[index].key);
                    
                    // 用户单点策略的弹框中不需要在hash中记录选择的tab
                    // if(this.initData.policyType && this.initData.policyType === "1") {
                    //     this.$emit('tabClick', this.tabsData[index].key);
                    // }
                }
            },
            selectDefaultTab(key) {
                for(let index in this.tabsData) {
                    if(this.tabsData[index].key === key) {
                        this.handleTabClick(index)
                        break;
                    }
                }
            }
        },
        mounted() {
            this.tabsData = createTabData(this.pageMapData, 0);
            // 注册Vue组件，方面后面动态加载这个组件
            registerComponent(Object.assign({}, this.tabsData), this.componentsPath);

            this.selectDefaultTab(this.selectTabKey)
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .vue-tabs {
        /*border: 1px solid #d6d6d6;*/
        flex: 1;
        display: flex;
        flex-direction: column;
        // height: 100%;
    }

    .vue-tabs-header-wrapper {
        border-bottom: solid 1px #ccc;
        background: #f1f4f7;
    }

    .vue-tabs-header {
        list-style: none;
        font-family: 'Microsoft Yahei', Arial, sans-serif;
        margin: 0 0 0 10px;;
        padding: 0;
        height: 41px;
        & > li {
            font-size: 14px;
            list-style-type: none;
            display: inline-block;
            line-height: 40px;
            height: 40px;
            min-width: 70px;
            padding: 0 10px;
            text-align: center;
            cursor: pointer;
            border: 1px solid #f1f4f7;
            border-top: 2px solid #f1f4f7;
            border-bottom: none;
        }

        & > li.active {
            background: #fff;
            border-color: #d6d6d6;
            border-top-color: #82bd3e;
        }
    }

    .vue-tabs-content {
        flex: 1;
    }
</style>