<template>
    <div class="tpl-list-content">
        <h2 class="tpl-header">策略模板</h2>
        <ul class="tpl-list">
            <li v-for="(tpl, index) in tplList" class="tpl-item" :class="tpl.active?'active':''" :key="tpl.id" @click="handleChoice(tpl.id)">
                <span class="text-ellipsis tpl-title" :title="tpl.name">{{tpl.name}}</span>
                <span v-if="showStatusIcon == '1' && tpl.status==0" class="tpl-status-icon tpl-unpublished"></span>
                <span v-if="showStatusIcon == '1' && tpl.status==1" class="tpl-status-icon tpl-published" title="已发布"></span>
                <span v-if="showStatusIcon == '1' && tpl.status==2" class="tpl-status-icon tpl-overdue" title="已过期"></span>
                <i class="fa fa-trash" @click.stop="showConfirm(tpl.id, 'delete', tpl.status)"></i>
            </li>
        </ul>
        <div class="tpl-btns">
            <a href="javascript:;" class="tpl-new" @click="showConfirm('', 'add')">
                <i class="fa fa-plus-square"></i>&nbsp;新建模板
            </a>
        </div>
        
        <VuePopup 
            title="新建模板"
            :popupType="popupType"
            :visible="showModal" 
            @close="closePopup" 
            @confirm="popupEvent">
            
            <div class="tpl-new-popup">
                <p>
                    <span>名称：</span><input type="text" maxlength="40" class="toolong" v-model.trim="tplName">
                </p>
            </div>
        </VuePopup>
        <VueTips v-model="isShowTips" delay="2000">
            {{tipsMessage}}
        </VueTips>
    </div>
</template>

<script>
    import VuePopup from "../VuePopup"
    import VueTips from "../VueTips"
    import { EVENT_TPL_LIST_UPDATA_STATUS, EVENT_TPL_LIST_ADD_CONFIRM } from "common/common-const"

    export default {
        components:{
            VuePopup,
            VueTips  
        },
        props: {
            initSelectedId: {
                type: Number,
                default: 0
            },
            tplList: {
                type:Array,
                required: true
            },
            showStatusIcon: {
                type: String,
                default: "0"
            }
        },
        data() {
            return {
                showModal: false,
                tplName: "",
                popupType: "",
                popupEvent: ()=>{},
                isShowTips: false,
                tipsMessage: "已发布的策略模板不允许删除"
            }
        },
        mounted () {
            if(0 === this.initSelectedId) {
                this.handleChoice(0)
            } else {
                this.handleChoice(this.initSelectedId)
            }
            this.initEvents();
        },
        watch: {
            // initSelectedId(val) {
            //     debugger;
            //     this.handleChoice(val);
            // }
        },
        methods: {
            findItem(id) {
                for(let index in this.tplList) {
                    if(this.tplList[index].id === id) {
                        return this.tplList[index];
                    }
                }

                return undefined;
            },
            selectItemById(id) {
                // let selectItem = this.tplList.find(item => {
                //     return item.id === id;
                // });

                let selectItem = this.findItem(id);
                
                if(selectItem) {
                    return selectItem;
                } else {
                    return this.tplList.length > 0 ? this.tplList[0] : undefined;
                }
            },
            handleChoice(id) {
                if(this.tplList.length === 0) {
                    this.$emit("tplSelected", id);
                    return;
                }

                for(let key in this.tplList) {
                    this.tplList[key].active = false;
                }
                
                let selectItem = this.selectItemById(id);
                selectItem.active = true
                this.$emit("tplSelected", selectItem.id);
            },
            handleDelete(id) {
                this.closePopup();
                this.$emit("tplDelete", id);
            },
            handleAdd() {
                this.closePopup();
                this.$emit("tplAdd", {name: this.tplName});
            },
            closePopup() {
                this.showModal = false;
            },
            initEvents() {
                // 更新模板列表的状态
                this.$eventBus && this.$eventBus.$on(EVENT_TPL_LIST_UPDATA_STATUS, res => {
                    let selectItem = this.findItem(res.tplId);

                    selectItem && (selectItem.status = res.status);
                })
                // 新建模板逻辑
                this.$eventBus && this.$eventBus.$on(EVENT_TPL_LIST_ADD_CONFIRM, res => {
                    this.showConfirm('', 'add');
                })
            },
            showConfirm(tplId, type, status) {
                if("delete" === type) {
                    if("1" == status) {
                        this.isShowTips = true;
                    } else {
                        this.popupType = "confirm";
                        this.popupEvent = this.handleDelete.bind(this, tplId);
                        this.showModal = true;
                    }
                } else if("add" === type) {
                    this.showModal = true;
                    this.popupType = "";
                    this.tplName = "";
                    this.popupEvent = this.handleAdd.bind();
                }
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .tpl-list-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        .tpl-header {
            font-size: 14px;
            font-weight: 400;
            text-align: center;
            background: #f1f4f7;
            height: 41px;
            line-height: 41px;
            margin: 0;
        }

        .tpl-list{
            list-style: none;
            margin: 0;
            padding: 0;
            overflow-y: auto;
            flex: 1;
        }
        .tpl-item {
            cursor: pointer;
            height: 42px;
            line-height: 42px;
            font-size: 12px;
            border-top: 1px solid #e5e5e5;
            border-bottom: 1px solid #e5e5e5;
            margin-top: -1px;
            text-align: left;
            padding-left: 18px;
            display: flex;
            justify-content: flex-end;
            &>i {
                visibility: hidden;
                flex: 0 0 11px;
                height: 42px;
                line-height: 42px;
                padding-right: 5px;
            }
        }
        .tpl-item:hover {
            &>i {
                visibility: visible;
            }
        }
        .tpl-title {
            display: inline-block;
            max-width: 140px;
            flex: 1 1 auto;
        }
        .tpl-item.active {
            color: #333;
            // font-size: 14px;
            border-left-style: inset;
            border-left: 2px solid #82bd3e;
            border-right: none;
        }
        .tpl-btns {
            /*position: absolute;
            left:0;
            right: 0;
            bottom: 0;*/
        }
        .tpl-new {
            text-align: center;
            height: 30px;
            line-height: 30px;
            color: #fff;
            display: block;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            background: #82bd3e;
            font-size: 14px;
            margin: 10px 10px;
        }
    }
    .tpl-new-popup {
        margin: 20px 40px;
        font-size: 12px;
    }

    .tpl-status-icon {
        margin-top: 6px;
    }
</style>