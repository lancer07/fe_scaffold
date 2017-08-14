<template>
    <div class="about">
        i am {{name}}
        <button id="btn" type="button" class="btn btn-success" @click="pushList()">push</button>
        <ul>
            <li v-for="item in list">
                {{item.age}}
            </li>
        </ul>

    </div>
</template>

<script>
export default {
    name: 'app2',
    data () {
        return {
            name : 'lancer',
            state: 'online',
            list : [
                {
                    age : 10
                },
                {
                    age : 20
                },
                {
                    age : 30
                }
            ]
        }
    },
    methods: {
        pushList () {
            this.list.push({
                age : 40
            });
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less">
    .about{
        color:#f00;
    }
</style>