<template>
    <div class="vue-tabs">
        <ul class="vue-tabs-header">
            <li v-for="(tab, index) in tabsData" @click='handleTabClick(index)' :class="tab.active?'active':''" :key="index">
                {{tab.name}}
            </li>
        </ul>
        <div class="vue-tabs-content">
            <VueTabsPanel 
                v-for="(tab, index) in tabsData" 
                v-if="tabsData[index] && tabsData[index].active" 
                :policyData="policyData"
                :tabsData="tabsData[index]"
                :key="index"
            />
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VueTabsPanel from "./VueTabsPanel";

    export default {
        name: "VueTabs",
        components: {
            VueTabsPanel
        },
        props: {
            "tabsData": Array,
            "policyData": Object,
            "initData": Object,
        },
        data() {
            return {
                selectTab: 0
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
                    
                    // 用户单点策略的弹框中不需要在hash中记录选择的tab
                    if(this.initData.policyType && this.initData.policyType === "1") {
                        this.$emit('tabClick', this.tabsData[index].key);
                    }
                }
            }
        },
        created(){

        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .vue-tabs {
        /*border: 1px solid #d6d6d6;*/
        flex: 1;
    }

    .vue-tabs-header {
        list-style: none;
        font-family: 'Microsoft Yahei', Arial, sans-serif;
        margin: 0;
        padding: 0;

        height: 41px;
        background: #f1f4f7;
        border-bottom: solid 1px #ccc;

        & > li {
            font-size: 14px;
            list-style-type: none;
            display: inline-block;
            line-height: 40px;
            height: 40px;
            min-width: 90px;
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

</style>