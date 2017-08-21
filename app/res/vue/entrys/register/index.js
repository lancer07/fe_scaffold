import Vue from 'vue'

import Register from 'pages/register/tpl/Register.vue'

var about = new Vue({
    el: '#register',
    template: '<Register />',
    components: { 
        Register
    }
})