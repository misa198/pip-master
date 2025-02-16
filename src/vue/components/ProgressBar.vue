<script setup lang="ts">
import Slider from './Slider.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { pause, play } from '../utils/video-control';
import { useVideoStore } from '../store/video-store';

const value = ref(0);
const temporaryValue = ref(0);
const video = ref<HTMLVideoElement>();
const videoStore = useVideoStore();

const updateTime = (v: number) => {
  if (!video.value) return;
  pause(video.value);
  temporaryValue.value = v;
  videoStore.setCurrentTime(
    (temporaryValue.value / 100) * video.value.duration,
  );
};

const completedMouseMove = () => {
  if (!video.value) return;
  video.value.currentTime = (temporaryValue.value / 100) * video.value.duration;
  play(video.value);
};

const clickedToUpdate = () => {
  if (!video.value) return;
  video.value.currentTime = (temporaryValue.value / 100) * video.value.duration;
};

const setTime = () => {
  if (!video.value) return;
  value.value = (video.value.currentTime / video.value.duration) * 100;
  temporaryValue.value = value.value;
  videoStore.setCurrentTime(video.value.currentTime);
  videoStore.setTotalTime(video.value.duration);
};

const onKeyboardControls = (e: KeyboardEvent) => {
  if (!video.value) return;
  if (e.key >= '0' && e.key <= '9') {
    const v = parseInt(e.key, 10);
    video.value.currentTime = (v / 10) * video.value.duration;
    videoStore.setCurrentTime(video.value.currentTime);
    value.value = v * 10;
    temporaryValue.value = v * 10;
  }
};

onMounted(() => {
  video.value = document.querySelector('video') as HTMLVideoElement;
  video.value.addEventListener('timeupdate', setTime);
  video.value.addEventListener('loadedmetadata', setTime);
  window.addEventListener('keydown', onKeyboardControls);
});

onBeforeUnmount(() => {
  if (!video.value) return;
  video.value.removeEventListener('timeupdate', setTime);
  video.value.removeEventListener('loadedmetadata', setTime);
  window.removeEventListener('keydown', onKeyboardControls);
});
</script>

<template>
  <div class="progress-bar">
    <Slider
      v-model="value"
      @update:model-value="updateTime"
      @completed-mouse-move="completedMouseMove"
      @clicked-to-update="clickedToUpdate"
    />
  </div>
</template>

<style scoped lang="scss">
.progress-bar {
  width: 100%;
}
</style>
