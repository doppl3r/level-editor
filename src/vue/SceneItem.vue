<script setup>
	// Used to refresh list
	defineProps(['children']);
</script>

<template>
    <li v-for="(child, index) of children">
        <div class="row" :class="{ selected: child.isSelected }" :title="child.uuid">
            <label><span class="icon icon-object-rectangle"></span>{{ child.name }}</label>
            <button><span class="icon icon-trash"></span></button>
            <button><span class="icon icon-eye"></span></button>
        </div>
        <ul v-if="child.children && child.children.length > 0">
            <SceneItem :children="child.children" />
        </ul>
    </li>
</template>