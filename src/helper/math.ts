import { setCoordinate } from 'helper/types';

export function degreesToRadians(degrees: number) {
    if (degrees) {
        return (degrees * Math.PI) / 180;
    }
    return 0;
}
export function calcAngleDegrees(x: number, y: number) {
    return radiansToDegrees(calcAngle(x, y));
}
export function calcAngle(x: number, y: number) {
    return Math.atan2(y, x);
}
export function radiansToDegrees(radian: number) {
    if (radian) {
        return (radian * 180) / Math.PI;
    }
    return 0;
}

export function lerp(min: number, max: number, value: number) {
    let returnValue = 0;
    const MARGIN = 0.00000001 * (min > max ? -1 : 1);
    if (value <= 0) {
        return min + MARGIN;
    }
    if (value >= 1) {
        return max - MARGIN;
    }

    if (max > min) {
        const range = max - min;
        const addedValue = range * value;
        returnValue = min + addedValue;
    } else {
        const invertMin = min * -1;
        const invertMax = max * -1;
        const invertRange = invertMax - invertMin;
        const addedInvertValue = invertRange * value;
        returnValue = (invertMin + addedInvertValue) * -1;
    }
    return returnValue;
}

export function easeInBackOut(prc: number) {
    return (1 - Math.cos(prc * Math.PI * 2)) / 2;
}
export function easeInOut(prc: number) {
    return (1 - Math.cos(prc * Math.PI)) / 2;
}
export const getVectorEndPoint = (xCoord: number, yCoord: number, angle: number, length: number) => {
    const radiansAngle = degreesToRadians(angle);
    return setCoordinate(length * Math.cos(radiansAngle) + xCoord, length * Math.sin(radiansAngle) + yCoord);
};
