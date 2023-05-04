<script setup>
	defineProps(['scene']);
</script>

<style lang="scss">
	@import "../scss/scene-objects";
</style>

<template>
	<div class="scene">
		<ul>
			<li>
				<label>Scene Objects</label>
			</li>
			<li v-for="(child, index) of scene.children">
				<label><span class="icon icon-object-rectangle"></span>{{ 'Object_' + (index + 1) }}</label>
				<button><span class="icon icon-trash"></span></button>
				<button><span class="icon icon-eye"></span></button>
			</li>
		</ul>
	</div>
</template>