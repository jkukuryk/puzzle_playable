import { isDapi, isMraid } from './adProtocols';
let uiWidth = 0;
let uiHeight = 0;
let screenWidth = 0;
let screenHeight = 0;
export function setUIWidth(size: number) {
    uiWidth = size;
}
export function setUIHeight(size: number) {
    uiHeight = size;
}
export function getUIWidth() {
    return uiWidth;
}
export function getUIHeight() {
    return uiHeight;
}

export function getUIDimensions() {
    return [uiWidth, uiHeight];
}
export function getScreenSize() {
    if (screenWidth * screenHeight === 0) {
        return refreshScreenSize();
    }
    return {
        width: screenWidth,
        height: screenHeight,
    };
}
export function refreshScreenSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const documentWidth = document.body.clientWidth;
    const documentHeight = document.body.clientHeight;

    const maxHeight = Math.max(windowHeight, documentHeight);
    const maxWidth = Math.max(windowWidth, documentWidth);

    const longEdge = Math.max(maxHeight, maxWidth);
    const shortEdge = Math.min(maxHeight, maxWidth);

    if (isMraid()) {
        const mraidSize = mraid.getMaxSize();

        if (mraidSize.width >= mraidSize.height) {
            //issue when mraid return screen in rectangle in horizontal view.
            //horizontal
            screenWidth = Math.max(mraidSize.width, longEdge);
            screenHeight = Math.min(mraidSize.height, shortEdge);
        } else {
            //vertical
            screenWidth = Math.min(mraidSize.width, shortEdge);
            screenHeight = Math.max(mraidSize.height, longEdge);
        }
    } else if (isDapi()) {
        const dapiScreen = dapi.getScreenSize();
        screenWidth = dapiScreen.width;
        screenHeight = dapiScreen.height;
    } else {
        screenWidth = windowWidth;
        screenHeight = windowHeight;
    }
    return { width: screenWidth, height: screenHeight };
}
export enum CanvasOrientation {
    HORIZONTAL = 'Horizontal',
    VERTICAL = 'Vertical',
}
export function getOrientation() {
    const { width, height } = getScreenSize();
    return width > height ? CanvasOrientation.HORIZONTAL : CanvasOrientation.VERTICAL;
}

export function getSizeByScreenWidth(value: number) {
    const valuePrc = value / 100;
    const edge = uiWidth;
    return valuePrc * edge;
}
export function getSizeByScreenHeight(value: number) {
    const valuePrc = value / 100;
    const edge = uiHeight;
    return valuePrc * edge;
}
