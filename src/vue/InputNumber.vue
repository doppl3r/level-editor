<script setup>
	var props = defineProps(['data']);

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
		data.target[data.key] = data.value;
	}
</script>

<template>
	<div class="input-number">
		<button class="arrow left" @click="increment(data, -1)"><span class="icon icon-left"></span></button>
		<input v-model="data.value" type="number" :max="data.max" :min="data.min" :step="data.step" @change="updateNumber(data)" @focus="$event.target.select()" @keyup.enter="$event.target.blur();">
		<button class="arrow right" @click="increment(data, 1)"><span class="icon icon-right"></span></button>
	</div>
</template>