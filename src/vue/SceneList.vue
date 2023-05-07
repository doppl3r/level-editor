<script setup>
	import { ref } from 'vue';
	import SceneItem from './SceneItem.vue';

	// Used to refresh list
	var sceneKey = ref(0);
	var scene = ref({ children: [] });

	// Refresh UI when game object dispatches custom events
	window.addEventListener('updateScene', function(e) {
		scene.value.children = e.detail;
		sceneKey.value++; // Refresh Vue list
	});
</script>

<style lang="scss">
	@import "../scss/scene-list";
</style>

<template>
	<div class="scene">
		<label>Scene Objects</label>
		<ul :key="sceneKey">
			<SceneItem :children="scene.children"/>
		</ul>
	</div>
</template>