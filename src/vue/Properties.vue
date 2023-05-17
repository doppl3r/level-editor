<script setup>
	import { ref } from 'vue'
	import json from '../json/editor-tabs.json';
	import Field from './Field.vue';
	import InputNumber from './InputNumber.vue';

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
		//selectedObject.value = editor.value.selector.collection[0];
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
				<li>
					<button :class="{ selected: selectedTab == 'object-properties' }" @click="selectedTab = 'object-properties'"><span class="icon icon-properties"></span></button>
				</li>
				<li>
					<button :class="{ selected: selectedTab == 'object-physics' }" @click="selectedTab = 'object-physics'"><span class="icon icon-physics"></span></button>
				</li>
				<li>
					<button :class="{ selected: selectedTab == 'object-texture' }" @click="selectedTab = 'object-texture'"><span class="icon icon-texture"></span></button>
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
			<div>
				<div class="tab-pane" v-if="selectedTab == 'object-properties'" :key="propertiesKey">
					<div class="group">
						<button @click="$event.target.classList.toggle('closed')"><span class="icon icon-opened"></span>Object Properties</button>
						<ul>
							<li v-if="selectedObject">
								<label>Position (XYZ)</label>
								<div class="row">
									<div class="col"><InputNumber :data="{ value: selectedObject.position.x, target: selectedObject.position, key: 'x', step: 1 }" /></div>
									<div class="col"><InputNumber :data="{ value: selectedObject.position.y, target: selectedObject.position, key: 'y', step: 1 }" /></div>
									<div class="col"><InputNumber :data="{ value: selectedObject.position.z, target: selectedObject.position, key: 'z', step: 1 }" /></div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>