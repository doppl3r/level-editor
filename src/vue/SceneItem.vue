<script setup>
	// Used to refresh list
	var prop = defineProps(['children']);
    var emit = defineEmits(['updateScene']);

    // Select object
    function select(child) {
        
    }

    // Delete object
    function deleteObject(child) {
        child.removeFromParent();
        emit('updateScene');
    }

    // Toggle 3D object visibility
    function toggleObjectVisible(child) {
        child.visible = !child.visible;
    }
</script>

<template>
    <li v-for="(child, index) of children">
        <div class="row" :class="{ selected: child.isSelected }" :title="child.uuid" @click="select(child)">
            <label><span class="icon icon-object-rectangle"></span>
                <input v-model="child.name" @keyup.enter="$event.target.blur()">
            </label>
            <button @click="deleteObject(child)"><span class="icon icon-trash"></span></button>
            <button @click="toggleObjectVisible(child)"><span class="icon" :class="[child.visible ? 'icon-eye' : 'icon-eye-closed']"></span></button>
        </div>
        <!-- <ul v-if="child.children && child.children.length > 0">
            <SceneItem :children="child.children" />
        </ul> -->
    </li>
</template>