import { atom } from 'recoil';
import { Coordinate } from 'helper/types';
export enum LevelShape {
    HEART = 'heart',
}
export type GradientCellData = {
    position: Coordinate;
    shape: LevelShape;
    id: number;
};
export const lastLevelUpdateAtom = atom({
    key: 'lastLevelUpdateAtom',
    default: 0,
});

export const gridLevelAtom = atom({
    key: 'gridLevelAtom',
    default: [] as GradientCellData[],
});
