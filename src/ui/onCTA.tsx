import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { gameStateAtom, GameState } from 'root/atoms/gameStateAtom';

export const OnCTA = () => {
    const gameState = useRecoilValue(gameStateAtom);
    useEffect(() => {
        if (gameState === GameState.CTA_SUCCESS) {
        }
        if (gameState === GameState.CTA_FAILURE) {
        }
    }, [gameState]);

    return <></>;
};
