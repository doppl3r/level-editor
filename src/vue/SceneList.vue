<script setup>
	import { ref } from 'vue';
	import SceneItem from './SceneItem.vue';

	// Used to refresh list
	var sceneKey = ref(0);
	var sceneList = ref({ children: [] });
	var editor = ref({});

	// Refresh UI when game object dispatches custom events
	window.addEventListener('updateScene', function(e) {
		editor.value = e.detail;
		updateScene();
	});

	// Refresh Vue list
	function updateScene() {
		sceneList.value.children = editor.value.getSceneChildren();
		sceneKey.value++;
	}

	// Select object
    function selectObject(child, shiftKey = false) {
		// Define empty child if null
		if (child == null) child = {
			uuid: '',
			isSelected: false
		};

		// Store isSelected state before sending event
		var isSelected = child.isSelected == true;

		// Send event to Game editor listener
		window.dispatchEvent(new CustomEvent('selectObject',
			{
				detail: {
					object: child,
					shiftKey: shiftKey
				}
			})
		);

		// Select/Deselect 3D controls
		editor.value.attachControls();

		// Refresh scene list if it selected an object or shiftKey is held
		if (isSelected == false || shiftKey == true) updateScene();
    }
	
    // Delete object
    function deleteObject(child) {
		child.removeFromParent();
		editor.value.attachControls(); // Hide controls
        updateScene();
    }

	// Toggle 3D object visibility
    function toggleVisible(child) {
        child.visible = !child.visible;
    }
</script>

<style lang="scss">
	@import "../scss/scene-list";
</style>

<template>
	<div class="scene-list">
		<label>Scene Objects</label>
		<ul :key="sceneKey">
			<SceneItem :children="sceneList.children" @update-scene="updateScene" @select-object="selectObject" @delete-object="deleteObject" @toggle-visible="toggleVisible"/>
		</ul>
		<div class="deselect" @click="selectObject(null, $event.shiftKey)"></div>
	</div>
</template>