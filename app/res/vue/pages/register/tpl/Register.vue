<template>
    <div class="main">
        <div class="register">
            <div class="box">
                <h1>用户注册</h1>
                <div class="item">
                    <input type="text" class="txt" maxlength="10" placeholder="用户名" v-model="username" />
                </div>
                <div class="item">
                    <input type="password" class="txt" maxlength="10" placeholder="密码" v-model="userpsw"/>
                </div>
                <div class="item">
                    <input type="password" class="txt" maxlength="10" placeholder="重复密码" v-model="userpsw2"/>
                </div>
                <div class="item">
                    <button @click="register()">注册</button>
                </div>
            </div>
        </div>
        <VueTips v-model="tips.isShow" delay="2000" v-bind:type="tips.type">
            {{tips.message}}
        </VueTips>
    </div>
</template>

<script>
import md5 from "blueimp-md5"
import VueTips from "../../../components/VueTips"

export default {
    components:{
        VueTips  
    },
    data () {
        return {
            username : '',
            userpsw : '',
            userpsw2 : '',
            tips : {
                isShow : false,
                type : 'warning',
                message : ''
            }
        }
    },
    methods: {
        register () {
            if(this.userpsw == "" || (this.userpsw != this.userpsw2)) {
                this.tips.message = '输入的密码不正确!';
                this.tips.type = 'warning';
                this.tips.isShow = true;
                return
            }

            if(localStorage.getItem(this.username)){
                this.tips.message = '此用户名已存在!';
                this.tips.type = 'warning';
                this.tips.isShow = true;
                return
            }

            localStorage.setItem(this.username, md5(this.userpsw)); 
            this.tips.message = '注册成功!';
            this.tips.type = 'success';
            this.tips.isShow = true;
            setTimeout(function(){
                window.location.href = "/pages/login/";
            },1000)
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../../css/common/common.less";
    body{
        background:#f0f0f0;
        padding:0px;
        margin:0px;
        .main{
            display: flex;
            //flex-direction: row;
            justify-content: center;
            align-content: center;
            display:flex;
            align-items:center;
            justify-content: center;
            width:100%;
            height:100%;
        }
    }
    .register{
        display: flex;
        //flex-direction: row;
        justify-content: center;
        align-content: center;
        display:flex;
        align-items:center;
        justify-content: center;
        width:100%;
        height:100%;
        .box{
            text-align: center;
            background: #fff;
            box-shadow: 5px 5px 5px #ccc;
            border-radius: 10px;
            padding:20px;
            width:400px;
            height: 400px;
            .item{
                margin:20px;
                input{
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    border:1px solid #bbb;
                    border-radius:5px;
                    font-size: 16px;
                }
                button{
                    float: left;
                    width:100%;
                    height: 40px;
                    color: #fff;
                    border:0;
                    background:#f0ad4e;
                }
            }
        }
    }
</style>