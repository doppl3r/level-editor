<script setup>
	import { ref } from 'vue'
	var props = defineProps(['data', 'object']);

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

	function changeImage(data, event) {
		// Update data.image to base64 format
		var file = event.target.files[0];
		if (file) {
			var reader = new FileReader();
			var rawImage;
			reader.onloadend = function() {
				rawImage = reader.result;
				data.image = rawImage;
			}
			reader.readAsDataURL(file);
		}
	}
</script>

<template>
	<!-- Label element type -->
	<label v-if="data.element == 'label'" :title="data.title">{{ data.name }}</label>
	
	<!-- Input number type -->
	<div class="input-number" v-if="data.type == 'number'">
		<button class="arrow left" @click="increment(data, -1)"><span class="icon icon-left"></span></button>
		<input v-if="data.element == 'input'" :id="data.name" :name="data.name" :type="data.type" v-model="data.value" :max="data.max" :min="data.min" :step="data.step" @change="checkLimit(data)" @focus="$event.target.select()">
		<button class="arrow right" @click="increment(data, 1)"><span class="icon icon-right"></span></button>
	</div>

	<!-- Input file image type -->
	<div class="input-image" v-else-if="data.type == 'file'">
		<input :id="data.name" :type="data.type" :value="data.value" @change="changeImage(data, $event)" accept="image/png, image/jpeg">
		<label :for="data.name" :style="{ 'background-image': data.image != undefined ? 'url(' + data.image + ')' : '' }"></label>
		<button @click="data.image = null"><span class="icon icon-delete"></span></button>
	</div>

	<!-- Input default -->
	<input v-else-if="data.element == 'input'" :id="data.name" :type="data.type" :checked="data.checked" v-model="data.value">
	
	<!-- Append label to checkbox type inputs -->
	<label v-if="data.type == 'checkbox'" :for="data.name">{{ data.name }}</label>
	
	<!-- Textarea element type-->
	<textarea v-if="data.element == 'textarea'" v-model="data.value"></textarea>
</template>