import { Container, Graphics, useTick } from '@inlet/react-pixi';
import { levelMatrixGrid } from 'constants/levelMatrix';
import { ONE_SECOND } from 'constants/time';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { GameState, gameStateAtom } from 'root/atoms/gameStateAtom';
import { startLevelTimerAtom, timerActiveAtom } from 'root/atoms/levelItemAtoms';
import { GAP } from 'root/Level';
import { CELL_SIZE } from './Cells/Cell';
import { ParticleEmitter } from './ParticleEmitter';

const timerColor = 0x7fbd1f;
const timerBg = 0xffffff;
const TOTAL_TIME = 21 * ONE_SECOND;

export const Timer = () => {
    const [timeActive, setTimerActive] = useRecoilState(timerActiveAtom);
    const timerValue = useRecoilValue(startLevelTimerAtom);
    const gameState = useRecoilValue(gameStateAtom);

    const [timeProgress, setProgress] = useState(0);
    useEffect(() => {
        if (gameState === GameState.INTRO) {
            setTimerActive(false);
            setProgress(0);
        }
    }, [gameState, setTimerActive]);
    const totalLength = useMemo(() => {
        const totalLength = CELL_SIZE * levelMatrixGrid.length + GAP * (levelMatrixGrid.length - 1);
        return totalLength;
    }, []);
    const draw = useCallback(
        (g) => {
            g.clear();
            g.beginFill(timerColor);
            g.drawRoundedRect(-totalLength / 2, -10, totalLength * (1 - timeProgress), 24, 10);
            g.endFill();
        },
        [timeProgress, totalLength]
    );
    const drawBg = useCallback(
        (g) => {
            g.clear();
            g.beginFill(timerBg);
            g.drawRoundedRect(-totalLength / 2, -10, totalLength, 24, 10);
            g.endFill();
        },
        [totalLength]
    );
    const updateProgress = useCallback(() => {
        const progress = (performance.now() - timerValue) / TOTAL_TIME;
        setProgress(Math.min(1, progress));
        if (progress > 1) {
            setTimerActive(false);
        }
    }, [setTimerActive, timerValue]);

    useTick(updateProgress, timeActive);

    return (
        <Container position={[0, 500]}>
            <Graphics draw={drawBg} />
            <Graphics draw={draw} />
            {timeActive && (
                <ParticleEmitter
                    colors={['#7fbd1f', '#ffffff']}
                    size={35}
                    count={2}
                    emitterX={24}
                    emitterY={24}
                    lifeTime={1000}
                    emitTime={TOTAL_TIME}
                    x={totalLength * (1 - timeProgress) - totalLength / 2}
                />
            )}
        </Container>
    );
};
