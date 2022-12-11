import { useEffect, useMemo, useRef, useState } from 'react';
import gsap, { Back } from 'gsap';
import { Container, withFilters } from '@inlet/react-pixi';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { setCoordinate } from 'helper/types';
import { gameStateAtom, levelSuccessAtom, GameState } from './atoms/gameStateAtom';
import { gridLevelAtom, GradientCellData } from './atoms/levelItemAtoms';
const CELL_SIZE = 100;
export const LEVEL_ROWS = 7;
export const LEVEL_COLS = 5;
const firstTutorialId = 27;

export const Level = () => {
    const setGridLevel = useSetRecoilState(gridLevelAtom);
    const setGameState = useSetRecoilState(gameStateAtom);

    const [levelReferences, setLevelReferences] = useState<GradientCellData[]>([]);

    const gridWidth = useMemo(() => {
        return CELL_SIZE * LEVEL_COLS;
    }, []);

    const gridHeight = useMemo(() => {
        return CELL_SIZE * LEVEL_ROWS;
    }, []);

    const levelRef = useRef<ReturnType<typeof Container>>(null);
    const success = useRecoilValue(levelSuccessAtom);
    useEffect(() => {
        if (success) {
            gsap.to(levelRef.current, {
                y: 500,
                alpha: 0,
                duration: 2,
                delay: 0.3,
                repeat: 0,
                ease: Back.easeIn,
            }).then(() => {
                setGameState(GameState.CTA_SUCCESS);
            });
        }
    }, [setGameState, success]);

    return (
        <>
            <Container sortableChildren={true} ref={levelRef}></Container>
        </>
    );
};
