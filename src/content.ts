const DEFAULT_WIDTH = 350;
const PIP_TAG = '__pip__';

function findLargestVideo(): HTMLVideoElement | null {
  /*
   *  https://github.com/GoogleChromeLabs/picture-in-picture-chrome-extension/blob/master/src/script.js
   * */
  const videos = Array.from(document.querySelectorAll('video'))
    .filter((video) => video.readyState != 0)
    .filter((video) => !video.disablePictureInPicture)
    .sort((v1, v2) => {
      const v1Rect = v1.getClientRects()[0] || { width: 0, height: 0 };
      const v2Rect = v2.getClientRects()[0] || { width: 0, height: 0 };
      return v2Rect.width * v2Rect.height - v1Rect.width * v1Rect.height;
    });

  if (videos.length === 0) {
    return null;
  }

  return videos[0];
}

function setVideoType(pipWindow: Window, type: string) {
  pipWindow.document.querySelector('video')?.setAttribute('video_type', type);
}

function getVideoType(video: HTMLVideoElement) {
  return video.getAttribute('video_type');
}

function onPipHide(pipWindow: Window, cb: () => void) {
  pipWindow.addEventListener('pagehide', () => cb(), {
    once: true,
  });
}

const getYoutubeCaption = (pipWindow: Window) => {
  const caption = document.getElementById('ytp-caption-window-container');
  const youtubeCaptionParent = caption?.parentElement;
  if (caption && youtubeCaptionParent) {
    pipWindow.document.body.append(caption);
    setVideoType(pipWindow, 'youtube');

    onPipHide(pipWindow, () => {
      youtubeCaptionParent.append(caption);
    });
  }
};

const getVideoJsCaption = (pipWindow: Window) => {
  const caption = document.querySelector(
    '.vjs-text-track-display',
  ) as HTMLDivElement;
  const videoJsCaptionParent = caption?.parentElement;
  if (caption && videoJsCaptionParent) {
    setVideoType(pipWindow, 'videojs');
    pipWindow.document.body.append(caption);

    onPipHide(pipWindow, () => {
      videoJsCaptionParent.append(caption);
    });
  }
};

// function getJwPlayerCaption(pipWindow: Window) {
//   const caption = document.querySelector('.jw-captions') as HTMLDivElement;
//   console.log(caption);
//   const jwPlayerCaptionParent = caption?.parentElement;
//   if (caption && jwPlayerCaptionParent) {
//     pipWindow.document.body.append(caption);
//     setVideoType(pipWindow, 'jwplayer');
//
//     onPipHide(pipWindow, () => {
//       jwPlayerCaptionParent.append(caption);
//     });
//   }
// }

const getCaption = (pipWindow: Window) => {
  getYoutubeCaption(pipWindow);
  getVideoJsCaption(pipWindow);
  // getJwPlayerCaption(pipWindow);
};

function putVideoBack(video: HTMLVideoElement, videoParent: HTMLElement) {
  if (!videoParent) return;
  const videoType = getVideoType(video);
  switch (videoType) {
    case 'videojs':
      videoParent.insertBefore(video, videoParent.firstChild);
      break;
    default:
      videoParent.append(video);
  }
}

async function requestPipByVideo(video: HTMLVideoElement) {
  await video.requestPictureInPicture();
  video.setAttribute(PIP_TAG, 'true');
  video.addEventListener(
    'leavepictureinpicture',
    (_) => {
      video.removeAttribute(PIP_TAG);
    },
    { once: true },
  );
}

async function requestPipPopup(video: HTMLVideoElement) {
  const videoParent = video?.parentElement;
  if (!videoParent) return;
  const pipSize = {
    width: DEFAULT_WIDTH,
    height: (DEFAULT_WIDTH * video.videoHeight) / video.videoWidth,
  };
  const pipWindow = await documentPictureInPicture.requestWindow(pipSize);

  window.pipWindow = pipWindow;
  video.setAttribute(PIP_TAG, 'true');
  pipWindow.document.body.append(video);

  const mainUrl = chrome.runtime.getURL('main.js');
  const script = document.createElement('script');
  script.src = mainUrl;
  pipWindow.document.body.append(script);

  getCaption(pipWindow);

  pipWindow.addEventListener('pagehide', () => {
    video.removeAttribute(PIP_TAG);
    putVideoBack(video, videoParent);
    window.pipWindow = undefined;
  });
}

const exitPipPopup = () => {
  window.pipWindow?.close();
  window.pipWindow = undefined;
};

function isPipVideo(video: HTMLVideoElement) {
  return video.hasAttribute(PIP_TAG);
}

async function togglePip() {
  if (window.pipWindow) {
    exitPipPopup();
    return;
  }
  const video = findLargestVideo();
  if (!video) {
    return;
  }

  const isInIframe = window.top != window;

  if (isPipVideo(video) && isInIframe) {
    await document.exitPictureInPicture();
    return;
  }

  if (isInIframe) {
    await requestPipByVideo(video);
    return;
  }

  await requestPipPopup(video);
}

togglePip().then();
