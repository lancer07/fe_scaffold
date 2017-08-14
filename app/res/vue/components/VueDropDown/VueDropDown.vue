<template>
    <div class="vue-drop-down" v-if="isShow">
        <a href="javascript:void(0)">{{selectMenu}}</a>
        <i class="dropdown-icon"></i>
        <ul>
            <li 
                v-for="(menu, index) in menuList" 
                :class="[menu.active?'active':'']" 
                @click="handleSelected(menu.keyCode)" 
                :key="menu.keyCode">

                <a href="javascript:void(0)">{{menu.name}}</a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "VueDropDown",
        props: {
            menuList: Array, 
            initData: Object,
            initSelectedCode: String
        },
        data() {
            return {
                selectMenu: "",
                isShow: true
            }
        },
        mounted() {
            this.handleSelected(this.initSelectedCode);
        },
        methods: {
            findItem(keyCode) {
                for(let index in this.menuList) {
                    if(this.menuList[index].keyCode !== undefined && this.menuList[index].keyCode === keyCode) {
                        return this.menuList[index];
                    }
                }

                return undefined;
            },
            selectItemById(keyCode) {
                let selectItem = this.findItem(keyCode);
                
                if(selectItem) {
                    return selectItem;
                } else {
                    return this.menuList.length > 0 ? this.menuList[0] : undefined;
                }
            },
            handleSelected(keyCode) {
                if(this.menuList.length === 0) {
                    // this.$emit("selected", keyCode);
                    return;
                }

                this.menuList.forEach((val) => {
                    val.active = false
                })
                
                let selectItem = this.selectItemById(keyCode);
                selectItem.active = true;
                this.selectMenu = selectItem.name;
                this.$emit("selected", selectItem.keyCode);
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @drop-down-width:127px;

    .vue-drop-down {
        height: 41px;
        width: @drop-down-width;
        text-align: center;
        line-height: 41px;
        background: #f1f4f7;
        & a {
            color: inherit;
            font-weight: normal;
            text-decoration: none
        }

        .dropdown-icon {
            display: inline-block;
            width: 7px;
            height: 7px;
            background: url(/res/img/common/search-drop.png);
        }
        &>ul {
            display: none;
            list-style: none;
            background: #fff;
            border: 1px solid #ccc;
            padding: 0;
            margin: 0;
            width: @drop-down-width - 1;
            -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            -moz-box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            -webkit-transition: all 0.7s linear;
            -moz-transition: all 0.7s linear;
            -ms-transition: all 0.7s linear;
            -o-transition: all 0.7s linear;
            transition: all 0.7s linear;
            
            &>li{
                outline: none;
                cursor: pointer;
            }
            & li.active{
                background: #f1f4f7;
            }
            & li:hover{
                color: #82bd3e;
                
            }
        }

        &:hover ul {
            display: block;
            position: absolute;
            top: 40px;
            z-index: 1;
        }
    }

</style>