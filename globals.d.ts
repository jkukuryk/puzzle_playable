declare var mraid: {
    isReady: () => boolean;
    isViewable: () => boolean;
    getState: () => string;
    addEventListener: (event: 'viewableChange' | 'sizeChange' | 'ready', callback: () => void) => void;
    removeEventListener: (event: 'viewableChange' | 'sizeChange' | 'ready', callback: () => void) => void;
    getMaxSize: () => { x: number; y: number; width: number; height: number };
    getScreenSize: () => { x: number; y: number; width: number; height: number };
    openStoreUrl: () => void;
    open: (url: string) => void;
};
declare var dapi: {
    isReady: () => boolean;
    addEventListener: (
        event: 'viewableChange' | 'adResized' | 'ready' | 'audioVolumeChange',
        callback: (volume: number) => void
    ) => void;
    removeEventListener: (
        event: 'viewableChange' | 'adResized' | 'ready' | 'audioVolumeChange',
        callback: () => void
    ) => void;
    getScreenSize: () => { width: number; height: number };
    openStoreUrl: () => void;
    getAudioVolume: () => number;
    isViewable: () => boolean;

    isReady: () => boolean;
};
declare var FbPlayableAd: { onCTAClick: () => void };
declare var ExitApi: { exit: () => void };
