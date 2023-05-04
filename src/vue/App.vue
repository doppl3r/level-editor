<script setup>
	import '../scss/style.scss';
	import MenuMain from './MenuMain.vue';
	import MenuView from './MenuView.vue';
	import ViewControls from './ViewControls.vue';
	import SceneObjects from './SceneObjects.vue';
	import Properties from './Properties.vue';
	import { Game } from '../js/Game.js';
	import { ref, onMounted } from 'vue';

	// Initialize app and expose to window scope
	var canvas = ref();
	var game = window.game = new Game();
	var gameRef = ref(game);

	// Initialize keys for 2-way refresh (ex: game object to Vue list refresh)
	var keyScene = ref(0);
	var keyObject = ref(0);

	onMounted(function() {
		game.init(canvas.value);
	});

	// Refresh UI when game object dispatches custom events
	window.addEventListener('select', function(e) { keyScene.value++; });
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
			<SceneObjects :scene="gameRef.scene" :key="keyScene" />
		</div>
		<div class="side-bottom">
			<Properties :scene="gameRef.scene" :key="keyScene" />
		</div>
	</div>
</template>