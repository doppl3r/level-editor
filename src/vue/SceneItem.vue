<script setup>
	// Used to refresh list
	var props = defineProps(['children']);
    var emit = defineEmits(['deleteObject', 'selectObject']);

    // Toggle 3D object visibility
    function toggleObjectVisible(child) {
        child.visible = !child.visible;
    }
</script>

<template>
    <li v-for="(child, index) of children">
        <div class="row" :class="{ selected: child.isSelected }">
            <label @click="emit('selectObject', child, $event.shiftKey)">
                <span class="icon icon-object-rectangle"></span>
                <input v-model="child.name" @keyup.enter="$event.target.blur()">
            </label>
            <button @dblclick="emit('deleteObject', child)" title="Double click to delete"><span class="icon icon-trash"></span></button>
            <button @click="toggleObjectVisible(child)" title="Hide/show 3D object"><span class="icon" :class="[child.visible ? 'icon-eye' : 'icon-eye-closed']"></span></button>
        </div>
    </li>
</template>