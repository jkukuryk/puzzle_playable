import { noop } from 'lodash';
import { SoundFile, SoundManager } from 'root/sound/soundManager';
import { getScreenSize, refreshScreenSize } from './screen';

export enum ProtocolTypes {
    NONE = 'none',
    MRAID = 'mraid',
    DAPI = 'dapi',
}

let adProtocol = ProtocolTypes.NONE;

export function isMraid() {
    return adProtocol === ProtocolTypes.MRAID;
}
export function isDapi() {
    return adProtocol === ProtocolTypes.DAPI;
}

export function isDesktop() {
    return adProtocol === ProtocolTypes.NONE;
}

let isStarted = false;
let isInitialized = false;

let initialCallback = noop;

let androidLink = '';
let iosLink = '';
let soundList = [] as SoundFile[];
let config = {
    onVisible: noop,
    onHidden: noop,
};
export function addSoundList(files: SoundFile[]) {
    soundList = files;
}
export function init(callback: () => void, appConfig?: { onVisible: () => void; onHidden: () => void }) {
    setProtocol();
    config = { ...config, ...appConfig };

    initialCallback = () => {
        isInitialized = true;
        SoundManager.init(soundList);
        callback();
    };

    const onReadyCallback = () => {
        removeOnReady(onReadyCallback);
        onDocumentVisible();
        createVisibleListeners();
        createResizeListener();
    };
    onReady(onReadyCallback);
}

function setProtocol() {
    try {
        mraid.getState();
        adProtocol = ProtocolTypes.MRAID;
        return;
        // eslint-disable-next-line no-empty
    } catch (error) {}

    try {
        dapi.isReady();
        adProtocol = ProtocolTypes.DAPI;
        return;
        // eslint-disable-next-line no-empty
    } catch (error) {}
    adProtocol = ProtocolTypes.NONE;
}

export function getAppLink() {
    if (androidLink === '' || iosLink === '') {
        console.error('no links');
    } else {
        return isAndroid() ? androidLink : iosLink;
    }
}
function createVisibleListeners() {
    switch (adProtocol) {
        case ProtocolTypes.DAPI:
            dapi.addEventListener('viewableChange', onDocumentVisible);
            break;
        case ProtocolTypes.MRAID:
            mraid.addEventListener('viewableChange', onDocumentVisible);
            break;
        default:
            document.addEventListener('visibilitychange', onDocumentVisible);
            break;
    }
}

const resizeFunction = {} as { [key: string]: (width: number, height: number) => void };
export function resizeEvent(callback: (width: number, height: number) => void) {
    setTimeout(
        (callback) => {
            const { width, height } = getScreenSize();
            callback(width, height);
        },
        120,
        callback
    );
}

export function addResizeListener(callback: (width: number, height: number) => void, key: string) {
    if (!resizeFunction[key]) {
        resizeEvent(callback);
    }
    resizeFunction[key] = callback;
}

export function removeResizeListener(key: string) {
    delete resizeFunction[key];
}

let resizeTimeout: NodeJS.Timeout;

function resizeView() {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeGame();
}
const resizeGame = () => {
    const { width, height } = refreshScreenSize();
    if (width * height === 0) {
        resizeView();
    } else {
        Object.keys(resizeFunction).forEach((fnKey) => resizeFunction[fnKey](width, height));
    }
};
function createResizeListener() {
    resizeView();
    switch (adProtocol) {
        case ProtocolTypes.DAPI:
            dapi.addEventListener('adResized', resizeView);
            break;
        case ProtocolTypes.MRAID:
            mraid.addEventListener('sizeChange', resizeView);
            break;
        default:
            window.onresize = resizeView;
            break;
    }
}

export function openStoreLink() {
    const appLink = getAppLink();
    switch (adProtocol) {
        case ProtocolTypes.DAPI:
            dapi.openStoreUrl();
            break;
        case ProtocolTypes.MRAID:
            if (appLink) {
                mraid.open(appLink);
            }
            break;
        default:
            window.open(appLink);
            break;
    }
}

export function isAndroid() {
    return window.navigator.userAgent.toLowerCase().includes('android');
}
export function isIOS() {
    const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
    const ios = /iphone|ipod|ipad/.test(platform);
    return ios;
}
export function getOS() {
    if (isAndroid()) {
        return 'android';
    }
    if (isIOS()) {
        return 'ios';
    }
    return 'desktop';
}

function onDocumentVisible() {
    if (isVisible()) {
        if (!isInitialized) {
            initialCallback();
        }
        SoundManager.mute(false);
        config.onVisible();
    } else {
        SoundManager.mute(true);
        config.onHidden();
    }
}
function isVisible() {
    if (isStarted) {
        switch (adProtocol) {
            case ProtocolTypes.DAPI:
                return dapi.isViewable();
            case ProtocolTypes.MRAID:
                return mraid.isViewable() && mraid.getState() === 'default';
        }
        return document.visibilityState === 'visible';
    }
    return false;
}

function onReady(callback: () => void) {
    switch (adProtocol) {
        case ProtocolTypes.DAPI:
            if (dapi.isReady()) {
                onProtocolStart(callback);
            } else {
                dapi.addEventListener('ready', () => onProtocolStart(callback));
            }
            break;
        case ProtocolTypes.MRAID:
            if (mraid.getState() === 'default') {
                onProtocolStart(callback);
            } else {
                mraid.addEventListener('ready', () => onProtocolStart(callback));
            }
            break;
        default:
            onProtocolStart(callback);
            break;
    }
}
function removeOnReady(callback: () => void) {
    switch (adProtocol) {
        case ProtocolTypes.DAPI:
            dapi.removeEventListener('ready', () => callback());
            break;
        case ProtocolTypes.MRAID:
            mraid.removeEventListener('ready', () => callback());
            break;
    }
}
export function setLinks(links: { ios: string; android: string }) {
    androidLink = links.android;
    iosLink = links.ios;
}
export function addDebug(label: string, value: string | number | boolean) {
    value = value.toString();
    let debugContainer = document.getElementById('debug');
    if (!debugContainer) {
        debugContainer = document.createElement('div');

        //Set its unique ID.
        debugContainer.id = 'debug';
        debugContainer.setAttribute(
            'style',
            'color: white; background: #000; position: absolute; top: 0; left:0; z-index:9999999; width: calc(100% - 40px); opacity: 0.8; padding: 20px'
        );
        debugContainer.innerHTML = '';
        document.body.appendChild(debugContainer);
    }

    const debugParameter = document.createElement('p');
    debugParameter.innerHTML = `${label}:${value}`;
    debugContainer.appendChild(debugParameter);
}

function onProtocolStart(callback: () => void) {
    isStarted = true;
    callback();
}
