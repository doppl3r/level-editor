<script setup>
	import '../scss/style.scss';
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
	<div class="layout">
		<div class="top">
			<Menu msg="UI created using src/vue/App.vue" />
		</div>
		<div class="view">
			<div class="container">
				<canvas ref="canvas"></canvas>
			</div>
		</div>
		<div class="side">

		</div>
	</div>
</template>