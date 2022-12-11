import { FunctionComponent, useState, useCallback, useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { gameStateAtom, GameState } from 'root/atoms/gameStateAtom';
import { isHorizontalSelector } from 'root/atoms/viewAtoms';
import { openStoreLink } from 'helper/adProtocols';
import { SVGSprite } from 'components/SvgSprite';

export const UI: FunctionComponent = () => {
    const gameState = useRecoilValue(gameStateAtom);
    const isHorizontal = useRecoilValue(isHorizontalSelector);
    const [ctaShowTime, setCtaShowTime] = useState(0);

    const CTAClick = useCallback(() => {
        const now = performance.now();
        if (ctaShowTime + 1000 < now) {
            openStoreLink();
        }
    }, [ctaShowTime]);

    useEffect(() => {
        switch (gameState) {
            case GameState.CTA_SUCCESS:
                setCtaShowTime(performance.now());
                break;

            case GameState.CTA_FAILURE:
                setCtaShowTime(performance.now());
                break;
        }
    }, [gameState]);

    return (
        <>
            {gameState === GameState.PLAY && <></>}
            {gameState === GameState.CTA_FAILURE && <></>}
            {gameState === GameState.CTA_SUCCESS && <></>}
        </>
    );
};
