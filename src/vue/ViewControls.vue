<script setup>
  import { ref } from 'vue'

  var selectedControls = ref('translate');;
</script>

<style lang="scss">
  @import "../scss/view-controls";
</style>

<template>
  <div class="view-controls">
    <ul>
      <li>
        <button :class="{ selected: selectedControls == 'translate' }" @click="selectedControls = 'translate'"><span class="icon icon-translate"></span></button>
      </li>
      <li>
        <button :class="{ selected: selectedControls == 'rotate' }" @click="selectedControls = 'rotate'"><span class="icon icon-rotate"></span></button>
      </li>
      <li>
        <button :class="{ selected: selectedControls == 'scale' }" @click="selectedControls = 'scale'"><span class="icon icon-scale"></span></button>
      </li>
    </ul>
  </div>
</template>