import { useEffect, useMemo, useRef, useState } from 'react';
import { Container } from '@inlet/react-pixi';
import { levelMatrixGrid } from 'constants/levelMatrix';
import { setCoordinate } from 'helper/types';
import { GridCell } from 'constants/cell';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { gridLevelAtom, startLevelTimerAtom } from './atoms/levelItemAtoms';
import { Cell, CELL_SIZE } from 'components/Cells/Cell';
import { GameState, gameStateAtom } from './atoms/gameStateAtom';
import gsap from 'gsap';
import { TotalScore } from 'components/TotalScore';
const GAP = CELL_SIZE / 18;
const SPACER = GAP * 2 + CELL_SIZE;

export const Level = () => {
    const [gameState, setGameState] = useRecoilState(gameStateAtom);
    const [levelGrid, setLevelGrid] = useState([] as GridCell[]);
    const setGridData = useSetRecoilState(gridLevelAtom);
    const startLevelTimer = useSetRecoilState(startLevelTimerAtom);
    const start = useMemo(() => {
        const rows = levelMatrixGrid.length;
        const cols = levelMatrixGrid[0].length;
        return getStartPosition(rows, cols);
    }, []);
    useEffect(() => {
        let id = 0;
        const rows = levelMatrixGrid.length;
        const cols = levelMatrixGrid[0].length;

        const levelCells = [] as GridCell[];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cellId = levelMatrixGrid[row][col];
                levelCells.push({
                    position: setCoordinate(start[0] + SPACER * col, start[1] + SPACER * row),
                    id,
                    cellId,
                    active: true,
                });
                id++;
            }
        }
        setLevelGrid(levelCells);
        setGridData(levelCells);
    }, [setGridData, start]);

    const levelRef = useRef(undefined);
    useEffect(() => {
        if (gameState === GameState.PLAY && levelRef.current) {
            gsap.to(levelRef.current, {
                alpha: 1,
                y: 0,
                duration: 1,
                delay: 0.2,
            }).then(() => {
                startLevelTimer(performance.now());
            });
        }
    }, [startLevelTimer, gameState]);

    if (gameState !== GameState.PLAY) {
        return null;
    } else {
        return (
            <Container sortableChildren={true} ref={levelRef} y={600} alpha={0}>
                <TotalScore position={start} />
                {levelGrid.map(({ position, id, cellId }) => (
                    <Cell position={position} id={id} key={id} cellId={cellId} />
                ))}
            </Container>
        );
    }
};

const getStartPosition = (gridRows: number, gridCols: number) => {
    const rows = gridRows / 2 - 0.5;
    const cols = gridCols / 2 - 0.5;
    const spaceX = -cols * SPACER;
    const spaceY = -rows * SPACER;
    return setCoordinate(spaceX, spaceY);
};
