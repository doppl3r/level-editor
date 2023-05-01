<script setup>
	import { ref } from 'vue'
	import json from '../json/editor-tabs.json';

	var selectedTab = ref('Object Properties');
	var properties = ref(json);
</script>

<style lang="scss">
	@import "../scss/properties";
</style>

<template>
	<div class="properties">
		<div class="tabs">
			<ul>
				<li v-for="tab of properties.children">
					<button :class="{ selected: selectedTab == tab.name }" @click="selectedTab = tab.name"><span class="icon" :class="tab.icon"></span></button>
				</li>
			</ul>
		</div>
		<div class="tab-content">
			<div v-for="pane of properties.children">
				<div class="tab-pane" v-if="selectedTab == pane.name">
					<div class="group" v-for="group of pane.children">
						<button @click="group.selected = !group.selected" :class="{ 'closed': group.selected }"><span class="icon icon-opened"></span>{{ group.name }}</button>
						<ul v-if="!group.selected">
							<li v-for="row of group.children">
								<label v-if="!!row.name">{{ row.name }}</label>
								<div class="row">
									<div class="col" v-for="col of row.children">
										<label v-if="col.element == 'label'" v-bind:title="col.title">{{ col.name }}</label>
										<input v-if="col.element == 'input'" v-bind:id="col.name" v-bind:type="col.type" v-model="col.value">
										<label v-if="col.type == 'checkbox'" v-bind:for="col.name">{{ col.name }}</label>
										<textarea v-if="col.element == 'textarea'" v-model="col.value"></textarea>
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