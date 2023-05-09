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

	// Refresh Vue list
	function updateScene() {
		scene.value.children = editor.value.getSceneChildren();
		sceneKey.value++;
	}

	// Select object
    function selectObject(child, shiftKey = false) {
		window.dispatchEvent(new CustomEvent('selectObject', { detail: { object: child, shiftKey: shiftKey } }));
        editor.value.attachControls();
		updateScene();
    }
	
    // Delete object
    function deleteObject(child) {
		child.removeFromParent();
		editor.value.attachControls(); // Hide controls
        updateScene();
    }
</script>

<style lang="scss">
	@import "../scss/scene-list";
</style>

<template>
	<div class="scene">
		<label>Scene Objects</label>
		<ul :key="sceneKey">
			<SceneItem :children="scene.children" @select-object="selectObject" @delete-object="deleteObject" />
		</ul>
	</div>
</template>