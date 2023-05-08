<script setup>
  import { ref } from 'vue'

  var editor = ref({ controlsTransform: { mode: 'translate' } });
  var selectedKey = ref(0);
  
  // Set controls mode
  function setControlsMode(mode) {
    editor.value.setTransformMode(mode);
  }

  // Refresh UI when game object dispatches custom events
	window.addEventListener('updateControls', function(e) {
		editor.value = e.detail;
		selectedKey.value++; // Refresh Vue list
	});
</script>

<style lang="scss">
  @import "../scss/view-controls";
</style>

<template>
  <div class="view-controls">
    <ul :key="selectedKey">
      <li>
        <button :class="{ selected: editor.controlsTransform.mode == 'translate' }" @click="setControlsMode('translate')"><span class="icon icon-translate"></span></button>
      </li>
      <li>
        <button :class="{ selected: editor.controlsTransform.mode == 'rotate' }" @click="setControlsMode('rotate')"><span class="icon icon-rotate"></span></button>
      </li>
      <li>
        <button :class="{ selected: editor.controlsTransform.mode == 'scale' }" @click="setControlsMode('scale')"><span class="icon icon-scale"></span></button>
      </li>
    </ul>
  </div>
</template>