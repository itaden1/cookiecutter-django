<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld  />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import store from './store.js'

export default {
    name: 'app',
    components: {
        HelloWorld
    },
    data(){
        return {
            thisState: store.state
        }
    },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
