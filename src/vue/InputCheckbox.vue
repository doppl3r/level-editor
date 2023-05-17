<script setup>
	var props = defineProps(['data'])
</script>

<template>
	<input :id="data.name" :checked="data.checked" v-model="data.value" type="checkbox" >
	<label :for="data.name">{{ data.name }}</label>
</template>