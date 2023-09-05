<template>
  <div style="width: 100%; height: 100%">
<!--    <a href="https://vitejs.dev" target="_blank">-->
<!--      <img src="/vite.svg" class="logo" alt="Vite logo" />-->
<!--    </a>-->
<!--    <a href="https://vuejs.org/" target="_blank">-->
<!--      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />-->
<!--    </a>-->
  </div>
<!--  <HelloWorld msg="Vite + Vue" />-->
  <Chart class="chart"/>
  <Canvas />
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Chart from './components/Charts.vue'
import Canvas from "./components/Canvas.vue";
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.chart {
  height: 50vh;
  width: 100%;
}
</style>
