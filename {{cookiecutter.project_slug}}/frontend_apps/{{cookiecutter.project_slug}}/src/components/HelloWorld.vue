{% raw %}
<template>
    <div>
        <h1>{{ thisState.title }}</h1>
        <ul>
            <li v-for="d in thisState.data">{{d}}</li>
        </ul>
        <button v-on:click="genericFunction">click me</button>
    </div>
</template>

<script>
import store from '../store.js';

export default {
    name: 'HelloWorld',
    data(){
        return {
            thisState: store.state,
        }
    },    

    methods: {
        genericFunction: function(){
            store.genericAction();
        },
    },
}
        
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
{% endraw %}
