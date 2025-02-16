<script lang="ts" setup>
import FitIcon from './icons/FitIcon.vue';
import { onBeforeUnmount, onMounted } from 'vue';

const onFitWindow = () => {
  const video = document.querySelector('video') as HTMLVideoElement;
  if (!video) return;
  const { clientWidth, clientHeight } = video;
  const { innerWidth, innerHeight } = window;

  // resize by width
  window.resizeBy(0, (clientHeight * innerWidth) / clientWidth - innerHeight);
};

const onKeyboardControls = (event: KeyboardEvent) => {
  if (event.key === 'f') {
    onFitWindow();
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeyboardControls);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyboardControls);
});
</script>

<template>
  <button class="functions__button" @click="onFitWindow">
    <FitIcon class="functions__button__icon" />
  </button>
</template>

<style scoped lang="scss"></style>
