import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Container } from '@inlet/react-pixi';
import { levelMatrixGrid } from 'constants/levelMatrix';
import { setCoordinate } from 'helper/types';
import { GridCell } from 'constants/cell';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { gridLevelAtom, scoreAtom, startLevelTimerAtom, timerActiveAtom } from './atoms/levelItemAtoms';
import { Cell, CELL_SIZE } from 'components/Cells/Cell';
import { GameState, gameStateAtom } from './atoms/gameStateAtom';
import gsap from 'gsap';
import { TotalScore } from 'components/TotalScore';
import { Timer } from 'components/Timer';
import { SoundsType } from './sound/soundList';
import { SoundManager } from './sound/soundManager';
export const GAP = 23;
const SPACER = GAP + CELL_SIZE;

export const Level = () => {
    const [gameState, setGameState] = useRecoilState(gameStateAtom);
    const [levelGrid, setLevelGrid] = useState([] as GridCell[]);
    const setGridData = useSetRecoilState(gridLevelAtom);
    const [startLevelTimer, setStartLevelTimer] = useRecoilState(startLevelTimerAtom);
    const [timerActive, setTimerActive] = useRecoilState(timerActiveAtom);
    const [cellMerged, setScore] = useRecoilState(scoreAtom);
    const MAX_SCORE = 10;
    const levelRef = useRef(undefined);

    const start = useMemo(() => {
        const rows = levelMatrixGrid.length;
        const cols = levelMatrixGrid[0].length;
        return getStartPosition(rows, cols);
    }, []);

    useEffect(() => {
        if (gameState === GameState.INTRO) {
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
        }
    }, [gameState, setGridData, start]);

    useEffect(() => {
        if (levelRef.current) {
            gsap.to(levelRef.current, {
                alpha: 1,
                y: 0,
                duration: 1,
                delay: 0.2,
            });
        }
    }, [setStartLevelTimer, gameState, setTimerActive]);

    const fadeLevel = useCallback(
        (nextState: GameState) => {
            if (nextState === GameState.CTA_SUCCESS) {
                SoundManager.play(SoundsType.success);
            } else {
                SoundManager.play(SoundsType.failure);
            }
            setGameState(nextState);
        },
        [setGameState]
    );

    useEffect(() => {
        if (cellMerged === MAX_SCORE) {
            setTimerActive(false);
            fadeLevel(GameState.CTA_SUCCESS);
        } else if (gameState === GameState.PLAY && !timerActive && startLevelTimer > 0) {
            setTimerActive(false);
            fadeLevel(GameState.CTA_FAILURE);
        }
    }, [cellMerged, fadeLevel, gameState, setGameState, setTimerActive, startLevelTimer, timerActive]);
    useEffect(() => {
        if (gameState === GameState.INTRO) {
            setScore(0);
            setStartLevelTimer(0);
        }
        if (gameState === GameState.PLAY) {
            setTimerActive(true);
            setStartLevelTimer(performance.now());
        }
    }, [gameState, setScore, setStartLevelTimer, setTimerActive]);

    return (
        <Container sortableChildren={true} ref={levelRef}>
            <TotalScore position={start} />
            {levelGrid.map(({ position, id, cellId }) => (
                <Cell position={position} id={id} key={id} cellId={cellId} />
            ))}
            <Timer />
        </Container>
    );
};

const getStartPosition = (gridRows: number, gridCols: number) => {
    const rows = gridRows / 2 - 0.5;
    const cols = gridCols / 2 - 0.5;
    const spaceX = -cols * SPACER;
    const spaceY = -rows * SPACER;
    return setCoordinate(spaceX, spaceY - 40);
};
