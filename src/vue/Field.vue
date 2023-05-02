<script setup>
	import { ref } from 'vue'
	defineProps(['data']);

	function increment(data, direction = 1) {
		var step = data.step || 1;
		data.value = +(data.value + (step * direction)).toFixed(2);
		checkLimit(data);
	}

	function checkLimit(data) {
		// Conditional limits
		if (data.value > data.max) data.value = data.max;
		if (data.value < data.min) data.value = data.min;
	}
</script>

<template>
	<!-- Label element type -->
	<label v-if="data.element == 'label'" :title="data.title">{{ data.name }}</label>
	
	<!-- Input element type -->
	<div class="input-number" v-if="data.type == 'number'">
		<button class="arrow left" @click="increment(data, -1)"><span class="icon icon-left"></span></button>
		<input v-if="data.element == 'input'" :id="data.name" :type="data.type" v-model="data.value" :max="data.max" :min="data.min" :step="data.step" @change="checkLimit(data)" @focus="$event.target.select()">
		<button class="arrow right" @click="increment(data, 1)"><span class="icon icon-right"></span></button>
	</div>
	<input v-else-if="data.element == 'input'" :id="data.name" :type="data.type" v-model="data.value">
	
	<!-- Append label to checkbox type inputs -->
	<label v-if="data.type == 'checkbox'" :for="data.name">{{ data.name }}</label>
	
	<!-- Textarea element type-->
	<textarea v-if="data.element == 'textarea'" v-model="data.value"></textarea>
</template>