<script setup>
	import '../scss/style.scss';
	import MenuMain from './MenuMain.vue';
	import MenuView from './MenuView.vue';
	import ViewControls from './ViewControls.vue';
	import SceneObjects from './SceneObjects.vue';
	import Properties from './Properties.vue';
	import { App } from '../js/App.js';
	import { ref, onMounted } from 'vue';

	// Initialize app
	var canvas = ref();
	var app;

	onMounted(function() {
		window.app = app = new App(canvas.value);
		console.log(ViewControls);
	});
</script>

<template>
	<div class="layout">
		<div class="top">
			<MenuMain />
		</div>
		<div class="view">
			<div class="menu">
				<MenuView />
			</div>
			<div class="content">
				<canvas ref="canvas"></canvas>
				<ViewControls />
			</div>
		</div>
		<div class="side-top">
			<SceneObjects />
		</div>
		<div class="side-bottom">
			<Properties />
		</div>
	</div>
</template>