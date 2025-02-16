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
  }

  var documentPictureInPicture: {
    requestWindow(options?: { width: number; height: number }): Promise<Window>;
  };
}

// declare module '*.vue';
