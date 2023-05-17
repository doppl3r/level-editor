<script setup>
	var props = defineProps(['data']);
</script>

<template>
	<textarea v-model="data.value"></textarea>
</template>