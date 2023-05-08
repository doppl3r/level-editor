<script setup>
	// Used to refresh list
	defineProps(['children']);

    // Delete object by UUID
    function deleteObject(child) {
        child.removeFromParent();
    }

    function toggleObjectVisible(child) {
        child.visible = !child.visible;
    }
</script>

<template>
    <li v-for="(child, index) of children">
        <div class="row" :class="{ selected: child.isSelected }" :title="child.uuid">
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