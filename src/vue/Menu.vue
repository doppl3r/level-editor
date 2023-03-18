<script setup lang="ts">
  import { ref } from 'vue'
  defineProps<{ msg: string }>()
  const count = ref(0)
</script>

<template>
  <div class="menu">
    {{ msg }}
  </div>
</template>
