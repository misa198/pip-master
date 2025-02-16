export async function play(video: HTMLVideoElement) {
  if (video.paused) {
    await video.play();
  }
}

export function pause(video: HTMLVideoElement) {
  if (!video.paused) {
    video.pause();
  }
}
