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

			// Recursively assign child object or set "target" object and "key"
			if (Object.keys(targetData[targetDataKey]).length > 0 && typeof targetData[targetDataKey] == 'object') {
				if (targetData[targetDataKey]) {
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
		if (data.condition) {
			// Update target value from field condition
			target.value[key.value] = data.condition[data.value];
			target.value.needsUpdate = true;
		}
		else {
			// Update object values from raw field data
			target.value[key.value] = data.value;
		}

	}

	function updateFieldFromTarget() {
		// Update field value from target object
		var data = props['data'];
		if (target.value) {
			// Reverse target from conditional value
			if (data.condition) {
				data.value = Object.keys(data.condition).find(function(k) {
					return data.condition[k] == target.value[key.value];
				});
			}
			else {
				// Update field from target value
				if (data.type == 'color') {
					data.value = '#' + target.value[key.value].getHexString();
				}
				else {
					data.value = target.value[key.value];
					if (typeof data.value == 'object') data.value = JSON.stringify(data.value);
				}
			}
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
		// Update data.value to base64 format
		if (props['object']) {
			var file = event.target.files[0];
			if (file) {
				var reader = new FileReader();
				var rawImage;
				reader.onloadend = function() {
					rawImage = reader.result;
					data.value = rawImage;
					props['object'].setTextureSource(data.value);
				}
				reader.readAsDataURL(file);
			}
		}
	}

	function removeImage(data) {
		if (props['object']) {
			data.value = null;
			props['object'].removeTexture();
		}
	}

	function changeColor(data, event) {
		if (props['object']) target.value[key.value].set(event.target.value);
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
		<input :id="data.name" :type="data.type" @change="changeImage(data, $event)" accept="image/png, image/jpeg">
		<label :for="data.name" :style="{ 'background-image': data.value != undefined ? 'url(' + data.value + ')' : '' }"></label>
		<button @click="removeImage(data)"><span class="icon icon-delete"></span></button>
	</div>

	<!-- Input Color type -->
	<input v-else-if="data.type == 'color'" :type="data.type" v-model="data.value" @input="changeColor(data, $event)">

	<!-- Input default -->
	<input v-else-if="data.element == 'input'" :id="data.name" :type="data.type" :checked="data.checked" v-model="data.value" @change="updateTargetFromField(data)">
	
	<!-- Append label to checkbox type inputs -->
	<label v-if="data.type == 'checkbox'" :for="data.name">{{ data.name }}</label>
	
	<!-- Textarea element type-->
	<textarea v-if="data.element == 'textarea'" v-model="data.value" @change="updateTargetFromField(data)"></textarea>
</template>