<script setup lang="ts">
import CheckIcon from './icons/CheckIcon.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const SPEED_OPTIONS = [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25];
const video = ref<HTMLVideoElement>();
const selectedSpeed = ref(1);

const emit = defineEmits(['selected']);

const onSelectSpeed = (speed: number) => {
  if (!video.value) return;
  video.value.playbackRate = speed;
  selectedSpeed.value = speed;
  emit('selected', speed);
};

const updateSpeed = () => {
  if (!video.value) return;
  selectedSpeed.value = Number(video.value.playbackRate);
};

onMounted(() => {
  video.value = document.querySelector('video') as HTMLVideoElement;
  video.value.addEventListener('ratechange', updateSpeed);
  selectedSpeed.value = Number(video.value.playbackRate);
});

onBeforeUnmount(() => {
  if (!video.value) return;
  video.value.removeEventListener('ratechange', updateSpeed);
});
</script>

<template>
  <div class="speed-options">
    <button
      v-for="speed in SPEED_OPTIONS"
      :key="speed"
      class="speed-options__item"
      @click="() => onSelectSpeed(speed)"
    >
      <CheckIcon
        :class="[
          'speed-options__item__icon',
          {
            'speed-options__item__icon--show': speed === selectedSpeed,
          },
        ]"
      />
      <span>{{ speed }}</span>
    </button>
  </div>
</template>

<style lang="scss">
.speed-options {
  position: fixed;
  bottom: 55px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  max-height: calc(100vh - 60px);
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }

  &__item {
    width: 80px;
    padding: 2px 10px;
    text-align: left;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-bottom);
    cursor: pointer;
    transition: background 0.2s ease-in-out;
    display: flex;
    align-items: center;

    &__icon {
      width: 12px;
      height: 12px;
      margin-right: 8px;
      opacity: 0;

      &--show {
        opacity: 1;
      }
    }

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
