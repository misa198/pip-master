import { defineStore } from 'pinia';

type State = {
  currentTime: number;
  duration: number;
  isLive: boolean;
};

export const useVideoStore = defineStore('video', {
  state: (): State => {
    return {
      currentTime: 0,
      duration: 0,
      isLive: false,
    };
  },
  actions: {
    setCurrentTime(time: number) {
      this.currentTime = time;
    },
    setTotalTime(time: number) {
      this.duration = time;
    },
    setIsLive(isLive: boolean) {
      this.isLive = isLive;
    },
  },
});
