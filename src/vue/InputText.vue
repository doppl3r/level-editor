<script setup>
	var props = defineProps(['data']);
</script>

<template>
	<input :id="data.name" type="text" v-model="data.value">
</template>