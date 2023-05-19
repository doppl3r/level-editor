<script setup>
	import { ref } from 'vue'
	import json from '../json/properties.json';
	import Field from './Field.vue';

	var selectedTab = ref('Object Properties');
	var selectedObject = ref({});
	var propertiesList = ref(json);
	var propertiesKey = ref(0);
	var editor = ref({});

	// Refresh UI when game object dispatches custom events
	window.addEventListener('updateEditor', function(e) {
		editor.value = e.detail;
		updateSelectedObject();
	});
	
	function updateSelectedObject() {
		// Update input fields from selectedObject
		selectedObject.value = editor.value.selector.selectedObjects;
		propertiesKey.value++;
	}
</script>

<style lang="scss">
	@import "../scss/properties";
</style>

<template>
	<div class="properties">
		<div class="tabs">
			<ul>
				<li v-for="tab of propertiesList.children">
					<button :class="{ selected: selectedTab == tab.name }" @click="selectedTab = tab.name"><span class="icon" :class="tab.icon"></span></button>
				</li>
			</ul>
		</div>
		<div class="tab-content">
			<div v-for="pane of propertiesList.children">
				<div class="tab-pane" v-if="selectedTab == pane.name" :key="propertiesKey">
					<div class="group" v-for="group of pane.children">
						<button @click="group.selected = !group.selected" :class="{ 'closed': group.selected }"><span class="icon icon-opened"></span>{{ group.name }}</button>
						<ul v-if="!group.selected">
							<li v-for="row of group.children">
								<label v-if="!!row.name">{{ row.name }}</label>
								<div class="row">
									<div class="col" v-for="field of row.children">
										<Field :data="field" :object="selectedObject" />
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>