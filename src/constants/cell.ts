import { Coordinate } from 'helper/types';

export type GridCell = {
    id: number;
    cellId: number;
    position: Coordinate;
    active: boolean;
};
