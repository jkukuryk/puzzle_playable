import { atom } from 'recoil';
import { GridCell } from 'constants/cell';

export const gridLevelAtom = atom({
    key: 'gridLevelAtom',
    default: [] as GridCell[],
});

export const lastLevelUpdateAtom = atom({
    key: 'lastLevelUpdateAtom',
    default: 0,
});

export const startLevelTimerAtom = atom({
    key: 'startLevelTimerAtom',
    default: 0,
});
export const scoreAtom = atom({
    key: 'scoreAtom',
    default: 0,
});
