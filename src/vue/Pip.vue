<script lang="ts" setup>
import Controller from './components/Controller.vue';
import './styles/global.scss';
import './styles/youtube-caption.scss';
import { onMounted } from 'vue';
import { useVideoStore } from './store/video-store';

const videoStore = useVideoStore();

onMounted(() => {
  window.addEventListener('message', (e) => {
    videoStore.setIsLive(e.data === 'YOUTUBE_LIVE');
  });
});
</script>

<template>
  <Controller />
</template>
