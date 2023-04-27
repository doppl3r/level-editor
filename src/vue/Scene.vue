<script setup>
  import { ref } from 'vue'
</script>

<style lang="scss">
  @import "../scss/scene";
</style>

<template>
  <div class="scene">
    <ul>
      <li>
        <label>Scene Objects</label>
      </li>
      <li>
        <label><span class="icon icon-object-rectangle"></span>Object_1</label>
        <button><span class="icon icon-trash"></span></button>
        <button><span class="icon icon-eye"></span></button>
      </li>
      <li>
        <label><span class="icon icon-object-rectangle"></span>Object_2</label>
        <button><span class="icon icon-trash"></span></button>
        <button><span class="icon icon-eye"></span></button>
      </li>
      <li>
        <label><span class="icon icon-object-rectangle"></span>Object_3</label>
        <button><span class="icon icon-trash"></span></button>
        <button><span class="icon icon-eye"></span></button>
      </li>
    </ul>
  </div>
</template>
