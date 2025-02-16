<script setup lang="ts">
import RewindIcon from './icons/RewindIcon.vue';
import PlayIcon from './icons/PlayIcon.vue';
import PausedIcon from './icons/PausedIcon.vue';
import ForwardIcon from './icons/ForwardIcon.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { play } from '../utils/video-control';

const SEEK_TIME = 10;

const video = ref<HTMLVideoElement>();
const isPlaying = ref(false);

const onPlay = () => {
  if (!video.value) return;
  play(video.value);
};

const onPause = () => {
  if (!video.value) return;
  video.value.pause();
};

const onRewind = () => {
  if (!video.value) return;
  video.value.currentTime -= SEEK_TIME;
};

const onForward = () => {
  if (!video.value) return;
  video.value.currentTime += SEEK_TIME;
};

const setIsPlaying = () => {
  if (!video.value) return;
  isPlaying.value = true;
};

const setIsPaused = () => {
  if (!video.value) return;
  isPlaying.value = false;
};

const onKeyboardControls = (e: KeyboardEvent) => {
  if (!video.value) return;
  if (e.key === ' ' || e.key === 'k') {
    video.value.paused ? play(video.value) : video.value.pause();
  } else if (e.key === 'ArrowRight' || e.key === 'l') {
    video.value.currentTime += SEEK_TIME;
  } else if (e.key === 'ArrowLeft' || e.key === 'j') {
    video.value.currentTime -= SEEK_TIME;
  }
};

onMounted(() => {
  video.value = document.querySelector('video') as HTMLVideoElement;

  isPlaying.value = !video.value.paused;
  video.value.addEventListener('play', setIsPlaying);
  video.value.addEventListener('pause', setIsPaused);
  document.addEventListener('keydown', onKeyboardControls);
});

onBeforeUnmount(() => {
  if (!video.value) return;
  video.value.removeEventListener('play', setIsPlaying);
  video.value.removeEventListener('pause', setIsPaused);
  document.removeEventListener('keydown', onKeyboardControls);
});
</script>

<template>
  <div class="control-buttons">
    <button
      class="control-buttons__button control-buttons__button--seek"
      @click="onRewind"
    >
      <RewindIcon class="control-buttons__button__icon" />
    </button>
    <button
      :class="[
        'control-buttons__button',
        {
          'control-buttons__button--hide': isPlaying,
        },
      ]"
      @click="onPlay"
    >
      <PlayIcon class="control-buttons__button__icon" />
    </button>
    <button
      :class="[
        'control-buttons__button',
        {
          'control-buttons__button--hide': !isPlaying,
        },
      ]"
      @click="onPause"
    >
      <PausedIcon class="control-buttons__button__icon" />
    </button>
    <button
      class="control-buttons__button control-buttons__button--seek"
      @click="onForward"
    >
      <ForwardIcon class="control-buttons__button__icon" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.control-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;

  &__button {
    cursor: pointer;
    background: var(--button-background);
    border-radius: 50%;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    border: none;
    transition: background 0.2s ease-in-out;

    &:hover {
      background: var(--button-background-hover);
    }

    &__icon {
      width: 20px;
      height: 20px;
    }

    &--seek {
      width: 20px;
      height: 20px;
      padding: 4px;

      &__icon {
        width: 8px;
        height: 8px;
      }
    }

    &--hide {
      display: none;
    }
  }
}
</style>
