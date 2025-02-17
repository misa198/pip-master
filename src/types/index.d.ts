export {}; // Ensures this file is treated as a module

declare global {
  interface Window {
    documentPictureInPicture?: {
      requestWindow(options: {
        width: number;
        height: number;
      }): Promise<Window>;
    };

    pipWindow?: Window;

    navigation: {
      addEventListener(
        event: 'navigate',
        cb: (event: Event) => void,
        options?: { once: boolean },
      ): void;
      removeEventListener(event: 'navigate', cb: (event: Event) => void): void;
    };

    youtubeCaption?: HTMLElement;
    youtubeCaptionParent?: HTMLElement;
  }

  const documentPictureInPicture: {
    requestWindow(options?: { width: number; height: number }): Promise<Window>;
  };
}

// declare module '*.vue';
