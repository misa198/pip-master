<script setup lang="ts">
import Timestamp from './Timestamp.vue';
import FitWindow from './FitWindow.vue';
import SpeedControl from './SpeedControl.vue';
import VolumeControl from './VolumeControl.vue';
import LiveBadge from './LiveBadge.vue';
import { storeToRefs } from 'pinia';
import { useVideoStore } from '../store/video-store';

const { isLive } = storeToRefs(useVideoStore());
</script>

<template>
  <div class="functions">
    <div class="functions__section functions__left">
      <LiveBadge v-if="isLive" />
      <Timestamp v-else class="functions__timestamp" />
      <VolumeControl />
    </div>
    <div class="functions__section functions__right">
      <SpeedControl />
      <FitWindow />
    </div>
  </div>
</template>

<style lang="scss">
.functions {
  color: var(--text-bottom);
  padding: 12px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;

  &__section {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__button {
    cursor: pointer;
    background: transparent;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    border: none;
    width: 22px;
    height: 22px;
    padding: 4px;
    border-radius: 50%;
    transition: background 0.2s ease-in-out;

    &:hover {
      background: var(--button-background-hover);
    }

    & svg {
      width: 18px;
      height: 18px;
    }
  }
}

@media screen and (max-width: 260px) {
  .functions {
    &__timestamp {
      position: absolute;
      bottom: 60px;
      left: 12px;
    }
  }
}
</style>
