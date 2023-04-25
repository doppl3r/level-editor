<script setup>
  import Menu from './Menu.vue';
  import { App } from '../js/App.js';
  import { ref, onMounted } from 'vue';

  // Initialize app
  var canvas = ref();
  var app;

  onMounted(function() {
    window.app = app = new App(canvas.value);
  });

</script>

<template>
  <canvas ref="canvas"></canvas>
  <Menu msg="UI created using src/vue/App.vue" />
</template>
