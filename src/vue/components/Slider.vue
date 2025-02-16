<script lang="ts" setup>
import { computed, ref, toRefs } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
    required: true,
  },
  color: {
    type: String,
    default: 'var(--primary-color)',
  },
});

const { modelValue, color } = toRefs(props);
const emit = defineEmits([
  'update:modelValue',
  'completedMouseMove',
  'clickedToUpdate',
]);

const progressBarRef = ref<HTMLDivElement>();
const clickableRef = ref<HTMLDivElement>();

const updateValue = (value: number) => {
  if (!isNaN(value) && value >= 0 && value <= 100) {
    emit('update:modelValue', value);
  }
};

const getProgressSize = () => {
  if (!progressBarRef.value) return 0;
  return progressBarRef.value.clientWidth;
};

const getProgressBarLeftToWindow = () => {
  if (!clickableRef.value) return 0;
  return clickableRef.value.getBoundingClientRect().left;
};

const handleMouseMoveProgressBar = (
  e: MouseEvent,
  startX: number,
  startSize: number,
) => {
  const deltaX = e.screenX - startX;
  const progressSize = getProgressSize();
  const percentage = ((startSize + deltaX) / progressSize) * 100;
  updateValue(percentage);
};

const handleMouseMove = (firstEvent: MouseEvent, firstModelValue: number) => {
  const firstSize = (firstModelValue / 100) * getProgressSize();

  const onMouseMove = (mouseMoveEvent: MouseEvent) => {
    handleMouseMoveProgressBar(mouseMoveEvent, firstEvent.screenX, firstSize);
  };

  const onWindowMouseUp = () => {
    emit('completedMouseMove');
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onWindowMouseUp);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onWindowMouseUp);
};

const onMouseDownProgressBar = (e: MouseEvent) => {
  const progressSize = getProgressSize();
  const progressBarLeft = getProgressBarLeftToWindow();
  const percentage = ((e.clientX - progressBarLeft) / progressSize) * 100;
  updateValue(percentage);
  emit('clickedToUpdate');

  handleMouseMove(e, percentage);
};

const onMouseDownDot = (e: MouseEvent) => {
  handleMouseMove(e, modelValue.value);
};

const innerStyle = computed(() => ({
  background: color.value,
  width: `${modelValue.value}%`,
}));

const dotStyle = computed(() => ({
  background: color.value,
  left: `${modelValue.value}%`,
  top: '50%',
}));
</script>

<template>
  <div ref="progressBarRef" class="slider">
    <div class="slider__inner" :style="innerStyle" />
    <div class="slider__dot" :style="dotStyle" @mousedown="onMouseDownDot" />
    <div
      ref="clickableRef"
      class="slider__clickable"
      @mousedown="onMouseDownProgressBar"
    />
  </div>
</template>

<style lang="scss">
.slider {
  position: relative;
  background: var(--background-grey);
  cursor: pointer;
  width: 100%;
  height: 4px;
  border-radius: 2px;

  .slider__inner {
    height: 100%;
  }

  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  &__dot {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 100;
  }

  &__clickable {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 99;
    border-radius: 2px;
  }
}
</style>
