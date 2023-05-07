<script setup>
	import '../scss/style.scss';
	import MenuMain from './MenuMain.vue';
	import MenuView from './MenuView.vue';
	import ViewControls from './ViewControls.vue';
	import SceneList from './SceneList.vue';
	import Properties from './Properties.vue';
	import { Game } from '../js/Game.js';
	import { ref, onMounted } from 'vue';

	// Initialize app and expose to window scope
	var canvas = ref();
	var game = window.game = new Game();

	onMounted(function() {
		game.init(canvas.value);
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
			<SceneList />
		</div>
		<div class="side-bottom">
			<Properties />
		</div>
	</div>
</template>