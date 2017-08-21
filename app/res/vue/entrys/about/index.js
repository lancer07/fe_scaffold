import Vue from 'vue'

import About from 'pages/about/tpl/About.vue'
import EventBus from 'plugins/EventBus.js'

Vue.use(EventBus);

var about = new Vue({
    el: '#about',
    template: '<About />',
    components: { 
        About
    }
})