const updateFunction = {} as { [key: string]: (tickerName: string) => void };

let keyCount = 0;
export function addTicker(callback: (tickerName?: string) => void, staticKey?: string) {
    if (staticKey) {
        removeTicker(staticKey);
    }
    if (!staticKey) {
        keyCount++;
        staticKey = `ticker_${keyCount}`;
    }
    updateFunction[staticKey] = callback;
    return staticKey;
}

let lastTime = 0;
let deltaTime = 0;
let now = performance.now();

export function globalTicker() {
    window.requestAnimationFrame(globalTicker);

    now = performance.now();

    deltaTime = (now - lastTime) / 1000;
    lastTime = now;
    Object.keys(updateFunction).forEach((keyFn) => {
        if (updateFunction[keyFn]) {
            updateFunction[keyFn](keyFn);
        }
    });
}

export function removeTicker(key: string | undefined) {
    if (key) {
        delete updateFunction[key];
    }
}

export function getDeltaTime() {
    return deltaTime;
}

export function getNow() {
    return now;
}

export const Time = {
    deltaTime: getDeltaTime,
    now: getNow,
};
