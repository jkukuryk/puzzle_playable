import { atom, selector } from 'recoil';

export const viewSizeRectAtom = atom({
    key: 'viewSizeRectAtom',
    default: { top: 0, bottom: 0, left: 0, right: 0 },
});
export const viewSizeAtom = atom({
    key: 'viewSizeAtom',
    default: [0, 0],
});
export const centerViewAtom = atom({
    key: 'centerViewAtom',
    default: [0, 0],
});
export const viewOrientationAtom = atom({
    key: 'viewOrientationAtom',
    default: null as 'horizontal' | 'vertical' | null,
});
export const gameScaleAtom = atom({
    key: 'gameScaleAtom',
    default: 1,
});

export const isHorizontalSelector = selector({
    key: 'isHorizontalSelector',
    get: ({ get }) => {
        return get(viewOrientationAtom) === 'horizontal';
    },
});
