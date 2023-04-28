<script setup>
  import { ref } from 'vue'
</script>

<style lang="scss">
  @import "../scss/properties";
</style>

<template>
    <div class="properties">
        <div class="tabs">
            <ul>
                <li>
                    <button class="selected"><span class="icon icon-properties"></span></button>
                </li>
                <li>
                    <button><span class="icon icon-physics"></span></button>
                </li>
                <li>
                    <button><span class="icon icon-texture"></span></button>
                </li>
            </ul>
        </div>
        <div class="tabs-content">
            <div class="group">
                <button><span class="icon icon-opened"></span>Object Properties</button>
            </div>
        </div>
    </div>
</template>