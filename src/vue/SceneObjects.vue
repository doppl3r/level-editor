<script setup>
	import { ref } from 'vue';

	// Used to refresh list
	var sceneKey = ref(0);
	var scene = ref({ children: [] });

	// Refresh UI when game object dispatches custom events
	window.addEventListener('sceneSelected', function(e) {
		scene.value.children = e.detail;
		sceneKey.value++; // Refresh Vue list
	});
</script>

<style lang="scss">
	@import "../scss/scene-objects";
</style>

<template>
	<div class="scene">
		<ul :key="sceneKey">
			<li>
				<label>Scene Objects</label>
			</li>
			<li v-for="(child, index) of scene.children">
				<label><span class="icon icon-object-rectangle"></span>{{ child.name }}</label>
				<button><span class="icon icon-trash"></span></button>
				<button><span class="icon icon-eye"></span></button>
			</li>
		</ul>
	</div>
</template>