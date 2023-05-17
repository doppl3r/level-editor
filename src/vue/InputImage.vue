<script setup>
	var props = defineProps(['data']);

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
	<div class="input-image">
		<input :id="data.name" :value="data.value" @change="changeImage(data, $event)" accept="image/png, image/jpeg" type="file">
		<label :for="data.name" :style="{ 'background-image': data.image != undefined ? 'url(' + data.image + ')' : '' }"></label>
		<button @click="data.image = null"><span class="icon icon-delete"></span></button>
	</div>
</template>