export type Position = { x: number; y: number };
export type Vector2D = { x: number; y: number };
export type Dimensions = { width: number; height: number };
export type Coordinate = [number, number];
export type BoundingRect = { x: number; y: number; width: number; height: number };
export type Rect = { top: number; left: number; bottom: number; right: number };

export function setCoordinate(x: number, y: number) {
    return [x, y] as Coordinate;
}
