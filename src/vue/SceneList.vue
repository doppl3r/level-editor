<script setup>
	import { ref } from 'vue';
	import SceneItem from './SceneItem.vue';

	// Used to refresh list
	var sceneKey = ref(0);
	var editor = ref({});
	var scene = ref({ children: [] });

	// Refresh UI when game object dispatches custom events
	window.addEventListener('updateScene', function(e) {
		editor.value = e.detail;
		updateScene();
	});

	function updateScene() {
		scene.value.children = editor.value.getSceneChildren();
		sceneKey.value++; // Refresh Vue list
	}
</script>

<style lang="scss">
	@import "../scss/scene-list";
</style>

<template>
	<div class="scene">
		<label>Scene Objects</label>
		<ul :key="sceneKey">
			<SceneItem :children="scene.children" @updateScene="updateScene" />
		</ul>
	</div>
</template>