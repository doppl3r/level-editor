<script setup>
	// Used to refresh list
	var props = defineProps(['data']);
    var emit = defineEmits(['updateScene', 'deleteObject', 'selectObject', 'toggleVisible']);
</script>

<template>
    <li>
        <div class="row" :class="[data.isSelected ? 'selected' : '']">
            <label @click="emit('selectObject', data, $event.shiftKey)">
                <span class="icon" :class="'icon-' + data.type.toLowerCase()"></span>
                <input v-model="data.name" @keyup.enter="$event.target.blur(); emit('updateScene')">
            </label>
            <button @dblclick="emit('deleteObject', data)" title="Double click to delete"><span class="icon icon-trash"></span></button>
            <button @click="emit('toggleVisible', data)" title="Hide/show 3D object"><span class="icon" :class="[data.visible ? 'icon-eye' : 'icon-eye-closed']"></span></button>
        </div>
    </li>
</template>