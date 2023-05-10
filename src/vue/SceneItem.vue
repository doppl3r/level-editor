<script setup>
	// Used to refresh list
	var props = defineProps(['children']);
    var emit = defineEmits(['updateScene', 'deleteObject', 'selectObject', 'toggleVisible']);
</script>

<template>
    <li v-for="(child, index) of children">
        <div class="row" :class="[child.isSelected ? 'selected' : '']">
            <label @click="emit('selectObject', child, $event.shiftKey)">
                <span class="icon icon-object-rectangle"></span>
                <input v-model="child.name" @keyup.enter="$event.target.blur(); emit('updateScene')">
            </label>
            <button @dblclick="emit('deleteObject', child)" title="Double click to delete"><span class="icon icon-trash"></span></button>
            <button @click="emit('toggleVisible', child)" title="Hide/show 3D object"><span class="icon" :class="[child.visible ? 'icon-eye' : 'icon-eye-closed']"></span></button>
        </div>
    </li>
</template>