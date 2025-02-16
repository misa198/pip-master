<script setup lang="ts">
import { formatTime } from '../utils/time';
import { storeToRefs } from 'pinia';
import { useVideoStore } from '../store/video-store';

const { currentTime, duration } = storeToRefs(useVideoStore());
</script>

<template>
  <div class="timestamp">
    {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
  </div>
</template>

<style scoped lang="scss">
.timestamp {
  font-size: 12px;
  color: var(--text-bottom);
}
</style>
