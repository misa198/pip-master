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

function clearYoutubeCaption() {
  if (window.youtubeCaption && window.youtubeCaptionParent) {
    window.youtubeCaption = undefined;
    window.youtubeCaptionParent = undefined;
  }
}

const getYoutubeCaption = (pipWindow: Window) => {
  const caption = document.getElementById('ytp-caption-window-container');
  const youtubeCaptionParent = caption?.parentElement;
  if (caption && youtubeCaptionParent) {
    window.youtubeCaption = caption;
    window.youtubeCaptionParent = youtubeCaptionParent;
    pipWindow.document.body.append(caption);
    setVideoType(pipWindow, 'youtube');

    onPipHide(pipWindow, () => {
      clearYoutubeCaption();
      youtubeCaptionParent.append(caption);
      console.debug('remove youtube caption');
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

const getCaption = (pipWindow: Window) => {
  getYoutubeCaption(pipWindow);
  getVideoJsCaption(pipWindow);
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
  await new Promise((res) => {
    script.addEventListener('load', () => res(true));
  });

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
  clearYoutubeCaption();
};

function isPipVideo(video: HTMLVideoElement) {
  return video.hasAttribute(PIP_TAG);
}

const checkAndPushYoutubeVideoLiveStatus = () => {
  const liveBadge = window.document.querySelector(
    '.ytp-live-badge',
  ) as HTMLDivElement;
  const isLive =
    liveBadge &&
    liveBadge.hasAttribute('disabled') &&
    liveBadge.style.display !== 'none';
  if (!window.pipWindow) return;
  window.pipWindow.postMessage(
    isLive ? 'YOUTUBE_LIVE' : 'YOUTUBE_UPLOADED',
    '*',
  );
  getYoutubeCaption(window.pipWindow);
};

function checkWindowUrlChange() {
  window.navigation.addEventListener(
    'navigate',
    () => {
      if (!window.pipWindow) {
        return;
      }
      const video = window.pipWindow.document.querySelector('video');
      if (!video) {
        return;
      }
      if (window.youtubeCaption && window.youtubeCaptionParent) {
        window.youtubeCaptionParent.append(window.youtubeCaption);
        clearYoutubeCaption();
      }

      video.addEventListener('canplay', checkAndPushYoutubeVideoLiveStatus);
    },
    {
      once: true,
    },
  );
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
    checkAndPushYoutubeVideoLiveStatus();
    return;
  }

  if (isInIframe) {
    await requestPipByVideo(video);
    checkAndPushYoutubeVideoLiveStatus();
    return;
  }

  await requestPipPopup(video);
  checkAndPushYoutubeVideoLiveStatus();
  checkWindowUrlChange();
}

togglePip().then();
