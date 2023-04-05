<script setup>
  import { ref } from 'vue'
  defineProps({ msg: String })
  const count = ref(0)
</script>

<template>
  <div class="menu">
    {{ msg }}
  </div>
</template>
