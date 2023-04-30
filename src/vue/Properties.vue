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
                <ul>
                    <li>
                        <label>Position (XYZ)</label>
                        <div class="row">
                            <div class="col"><input class="number" name="positionX" value="0"></div>
                            <div class="col"><input class="number" name="positionY" value="0"></div>
                            <div class="col"><input class="number" name="positionZ" value="0"></div>
                        </div>
                    </li>
                    <li>
                        <label>Rotation (XYZ)</label>
                        <div class="row">
                            <div class="col"><input class="number" name="rotationX" value="0"></div>
                            <div class="col"><input class="number" name="rotationY" value="0"></div>
                            <div class="col"><input class="number" name="rotationZ" value="0"></div>
                        </div>
                    </li>
                    <li>
                        <label>Scale (XYZ)</label>
                        <div class="row">
                            <div class="col"><input class="number" name="scaleX" value="0"></div>
                            <div class="col"><input class="number" name="scaleY" value="0"></div>
                            <div class="col"><input class="number" name="scaleZ" value="0"></div>
                        </div>
                    </li>
                    <li>
                        <label>User Data</label>
                        <div class="row">
                            <div class="col"><textarea class="number left" name="userData" value="{}">{}</textarea></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>