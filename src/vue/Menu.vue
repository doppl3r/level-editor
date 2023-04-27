<script setup>
  import { ref } from 'vue'

  function newFile() {
    console.log('Menu.vue: newFile()');
  }
</script>

<style lang="scss">
  @import "../scss/menu";
</style>

<template>
  <div class="menu">
    <ul>
      <li>
        <button>File</button>
        <ul class="">
          <li><button @click="newFile"><span class="icon icon-new"></span>New</button></li>
          <li><button><span class="icon icon-open"></span>Open</button></li>
          <li><button><span class="icon icon-save"></span>Save</button></li>
        </ul>
      </li>
      <li>
        <button>Edit</button>
      </li>
    </ul>
  </div>
</template>
