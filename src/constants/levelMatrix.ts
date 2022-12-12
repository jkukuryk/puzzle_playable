import { shuffle } from 'lodash';

export enum CellTypes {
    TRIANGLE = 'triangle',
    RHOMBUS = 'rhombus',
    HEART = 'heart',
    CIRCLE = 'circle',
    START = 'star',
    DIAMOND = 'diamond',
}
export const shapesList = [
    CellTypes.TRIANGLE, //0 -triangle
    CellTypes.RHOMBUS, //1 -rhombus
    CellTypes.HEART, //2 -heart
    CellTypes.CIRCLE, //3 -circle
    CellTypes.START, //4 -star
    CellTypes.DIAMOND, //5 -diamond
];
export let levelMatrixGrid = [
    [1, 0, 2, 3],
    [2, 4, 1, 4],
    [4, 3, 0, 1],
    [5, 2, 5, 4],
];

export const particleColors = [
    ['#ffffff', '#bbe27c', '#aadb5c', '#80be1f', '#99cb4b', '#6da615', '#a3d356', '#8cc92c'], //0 -triangle
    ['#ffffff', '#1c82ad', '#62d0ff', '#2db5ee', '#1ea7e1'], //1 -rhombus
    ['#ffffff', '#f9c', '#ffaad4', '#f080b8'], //2 -heart
    ['#ffffff', '#ecbd00', '#ffd52e', '#ffdd57', '#efca33', '#ffd633', '#fc0'], //3 -circle
    ['#ffffff', '#ff9d5e', '#f07625', '#f1863f', '#c95b12', '#e86a17', '#ea7c33'], //4 -star
    ['#ffffff', '#d75a5a', '#d44c4c', '#ef7676', '#b04040', '#c83e3e', '#cc4d4d', '#aa3030'], //5 -diamond
];
export function shuffleLevel() {
    const rows = levelMatrixGrid.length;
    const cols = levelMatrixGrid[0].length;
    let allCells = [] as number[];
    levelMatrixGrid.forEach((row) => {
        allCells = allCells.concat(row);
    });
    allCells = shuffle(allCells);
    const newLevelGrid = [] as number[][];
    let i = 0;
    for (let row = 0; row < rows; row++) {
        const newRow = [] as number[];
        for (let col = 0; col < cols; col++) {
            newRow.push(allCells[i]);
            i++;
        }
        newLevelGrid.push(newRow);
    }
    levelMatrixGrid = newLevelGrid;
}
