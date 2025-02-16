<script lang="ts" setup>
import ProgressBar from './ProgressBar.vue';
import { ref } from 'vue';
import ControlButtons from './ControlButtons.vue';
import Functions from './Functions.vue';
</script>

<template>
  <div class="controller">
    <div class="controller__body">
      <ControlButtons />
    </div>
    <div class="controller__bottom">
      <ProgressBar />
      <Functions />
    </div>
  </div>
</template>

<style lang="scss">
.controller {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  background: rgb(0, 0, 0);
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.05) 70%,
    rgba(255, 255, 255, 0) 100%
  );
  display: flex;
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  &__body {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  &__bottom {
    width: 100%;
    padding: 0 10px;
  }
}

body:hover {
  .controller {
    opacity: 1;
  }
}
</style>
