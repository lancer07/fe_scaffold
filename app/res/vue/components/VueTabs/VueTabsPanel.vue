<script>
    import Vue from 'vue'

    export default {
        name: "VueTabsPanel",
        props: {
            "pageData": Object,
            "pageMapData": Object,
            "tabsData": Object
        },
        methods: {
            createComponents(h, name) {
                return h(Vue.component(name), {
                    props: {
                        pageData: this.pageData,
                        pageMapData: this.pageMapData
                    }
                });
            },
            createTabs(h) {
                console.log("createTabs")
                return h(Vue.component('VueTabs', require("./VueTabs.vue")), {
                    props: {
                        switchTab: this.tabsData.tabs,
                        policy: this.policy
                    }
                });
            }
        },
        created() {
            
        },
        render(h) {
            return (
                <div class="vue-tabs-panel">
                    {
                        this.tabsData.components && this.tabsData.components.map(component => {
                            return this.createComponents(h, component.name)
                        })
                    }

                    { this.tabsData.tabs && this.createTabs(h) }
                </div>
            )
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .vue-tabs-panel {
        flex: 1 0 0px;
        overflow-y: auto;
        /*height: 525px;*/
    }

</style>