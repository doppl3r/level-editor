<script setup>
	import '../scss/style.scss';
	import Menu from './Menu.vue';
	import Scene from './Scene.vue';
	import Properties from './Properties.vue';
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
	<div class="layout">
		<div class="top">
			<Menu />
		</div>
		<div class="view">
			<canvas ref="canvas"></canvas>
		</div>
		<div class="side-top">
			<Scene />
		</div>
		<div class="side-bottom">
			<Properties />
		</div>
	</div>
</template>