<script setup lang="ts">
import TurtleIcon from './icons/TurtleIcon.vue';
import SpeedOptions from './SpeedOptions.vue';
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const showMenu = ref(false);
const buttonRef = ref<HTMLButtonElement>();

onClickOutside(buttonRef, () => {
  showMenu.value = false;
});

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};
</script>

<template>
  <button ref="buttonRef" class="functions__button" @click="toggleMenu">
    <TurtleIcon class="functions__button__icon" />
  </button>
  <transition name="fade">
    <SpeedOptions v-if="showMenu" @selected="toggleMenu" />
  </transition>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
