<script setup>
	import { onMounted, ref } from 'vue'
	var props = defineProps(['data', 'object']);
	var target = ref({});
	var key = ref('');

	onMounted(function() {
		if (props['object']) {
			assignTargetFromData();
			updateFieldFromTarget();
		}
	});

	function assignTargetFromData(targetData, targetObject) {
		// Initialize variables from props if none are provided for recursion
		if (targetData == null) targetData = props['data']['target'];
		if (targetObject == null) targetObject = props['object'];

		// Assign target to object by predefined targetData keys
		if (typeof targetData == 'object') {
			var targetDataKey = Object.keys(targetData)[0];

			if (Object.keys(targetData[targetDataKey]).length > 0) {
				if (targetObject[targetDataKey]) {
					assignTargetFromData(targetData[targetDataKey], targetObject[targetDataKey]);
				}
			}
			else {
				target.value = targetObject;
				key.value = targetDataKey;
			}
		}

	}

	function updateTargetFromField(data) {
		// Update object values from field data
		target.value[key.value] = data.value;
	}

	function updateFieldFromTarget() {
		// Update field value from target object
		var data = props['data'];
		if (target.value) {
			data.value = target.value[key.value];
			if (typeof data.value == 'object') data.value = JSON.stringify(data.value);
		}
	}

	function increment(data, direction = 1) {
		var step = data.step || 1;
		data.value = +(data.value + (step * direction)).toFixed(2);
		updateNumber(data);
	}

	function checkLimit(data) {
		// Conditional limits
		if (data.value > data.max) data.value = data.max;
		if (data.value < data.min) data.value = data.min;
	}

	function updateNumber(data) {
		checkLimit(data);
		updateTargetFromField(data);
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
		<input v-if="data.element == 'input'" :id="data.name" :name="data.name" :type="data.type" v-model="data.value" :max="data.max" :min="data.min" :step="data.step" @change="updateNumber(data)" @focus="$event.target.select()" @keyup.enter="$event.target.blur();">
		<button class="arrow right" @click="increment(data, 1)"><span class="icon icon-right"></span></button>
	</div>

	<!-- Input file image type -->
	<div class="input-image" v-else-if="data.type == 'file'">
		<input :id="data.name" :type="data.type" :value="data.value" @change="changeImage(data, $event)" accept="image/png, image/jpeg">
		<label :for="data.name" :style="{ 'background-image': data.image != undefined ? 'url(' + data.image + ')' : '' }"></label>
		<button @click="data.image = null"><span class="icon icon-delete"></span></button>
	</div>

	<!-- Input default -->
	<input v-else-if="data.element == 'input'" :id="data.name" :type="data.type" :checked="data.checked" v-model="data.value" @change="updateTargetFromField(data)">
	
	<!-- Append label to checkbox type inputs -->
	<label v-if="data.type == 'checkbox'" :for="data.name">{{ data.name }}</label>
	
	<!-- Textarea element type-->
	<textarea v-if="data.element == 'textarea'" v-model="data.value" @change="updateTargetFromField(data)"></textarea>
</template>