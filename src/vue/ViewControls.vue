<script setup>
  import { ref, onMounted } from 'vue'

  var selectedControls = ref('translate');
  
  // Set controls mode
  function setControlsMode(mode) {
    selectedControls.value = mode;
  }
</script>

<style lang="scss">
  @import "../scss/view-controls";
</style>

<template>
  <div class="view-controls">
    <ul>
      <li>
        <button :class="{ selected: selectedControls == 'translate' }" @click="setControlsMode('translate')"><span class="icon icon-translate"></span></button>
      </li>
      <li>
        <button :class="{ selected: selectedControls == 'rotate' }" @click="setControlsMode('rotate')"><span class="icon icon-rotate"></span></button>
      </li>
      <li>
        <button :class="{ selected: selectedControls == 'scale' }" @click="setControlsMode('scale')"><span class="icon icon-scale"></span></button>
      </li>
    </ul>
  </div>
</template>