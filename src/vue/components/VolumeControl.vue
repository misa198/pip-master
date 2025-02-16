<script setup lang="ts">
import SpeakerIcon from './icons/SpeakerIcon.vue';
import Slider from './Slider.vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import SpeakerMuteIcon from './icons/SpeakerMuteIcon.vue';

const VOLUME_STEP = 0.1;

const value = ref(0);
const preValue = ref(0);
const video = ref<HTMLVideoElement>();

const isMuted = computed(() => value.value === 0);

const setVolume = () => {
  if (!video.value) return;
  video.value.volume = value.value / 100;
};

const onSetVideoVolume = (v: number) => {
  if (!video.value) return;
  video.value.volume = v / 100;
};

const onMute = () => {
  if (!video.value) return;
  preValue.value = video.value.volume;
  video.value.volume = 0;
  value.value = 0;
};

const onUnmute = () => {
  if (!video.value) return;
  const v = preValue.value ? preValue.value : 1;
  video.value.volume = v;
  value.value = v * 100;
};

const roundVolume = (v: number) => {
  return Math.round(10 * v) / 10;
};

const onKeyboardControls = (e: KeyboardEvent) => {
  if (!video.value) return;
  if (e.key === 'm') {
    isMuted.value ? onUnmute() : onMute();
  }
  if (e.key === 'ArrowUp' && value.value < 100) {
    const newValue = roundVolume(video.value.volume + VOLUME_STEP);
    video.value.volume = newValue;
    value.value = newValue * 100;
  } else if (e.key === 'ArrowDown' && value.value > 0) {
    const newValue = roundVolume(video.value.volume - VOLUME_STEP);
    video.value.volume = newValue;
    value.value = newValue * 100;
  }
};

onMounted(() => {
  video.value = document.querySelector('video') as HTMLVideoElement;
  value.value = (video.value.volume * 100) as number;
  video.value.addEventListener('volumechange', setVolume);

  window.addEventListener('keydown', onKeyboardControls);
});

onBeforeUnmount(() => {
  if (!video.value) return;
  video.value.removeEventListener('volumechange', setVolume);

  window.removeEventListener('keydown', onKeyboardControls);
});
</script>

<template>
  <div class="volume-control">
    <button
      v-if="!isMuted"
      class="volume-control__button functions__button"
      @click="onMute"
    >
      <SpeakerIcon class="functions__button__icon" />
    </button>
    <button
      v-else
      class="volume-control__button functions__button"
      @click="onUnmute"
    >
      <SpeakerMuteIcon class="functions__button__icon" />
    </button>
    <div class="volume-control__slider">
      <div class="volume-control__slider__inner">
        <div class="volume-control__slider__toggle">
          <Slider
            v-model="value"
            color="var(--text-bottom)"
            @update:model-value="onSetVideoVolume"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.volume-control {
  display: flex;
  align-items: center;
  gap: 3px;

  &:hover {
    .volume-control__slider__inner {
      width: 60px;
    }

    .volume-control__slider {
      opacity: 1;
    }

    .volume-control__slider__inner {
      opacity: 1;
    }

    .slider * {
      opacity: 1;
    }
  }

  &__button {
    width: 22px;
    height: 22px;
  }

  &__slider {
    width: 60px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    .slider * {
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }

    &__inner {
      width: 0;
      opacity: 0;
      padding-right: 5px;
      padding-left: 5px;
      height: 20px;
      overflow: hidden;
      display: flex;
      align-items: center;
      transition:
        width 0.2s ease-in-out,
        opacity 0.2s ease-in-out;
    }

    &__toggle {
      width: 50px;
    }
  }
}
</style>
