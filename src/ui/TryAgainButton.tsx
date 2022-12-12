import { FunctionComponent, useCallback, useMemo } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { gameStateAtom } from 'root/atoms/gameStateAtom';
import { centerViewAtom, viewSizeAtom } from 'root/atoms/viewAtoms';
import { SVGSprite } from 'components/SvgSprite';

import { Container } from '@inlet/react-pixi';

import tryAgainSVG from 'assets/ui/tryAgain.svg';
import { AnimationContainer } from 'components/AnimationContainer';
import { ONE_SECOND } from 'constants/time';
import { shuffleLevel } from 'constants/levelMatrix';

const VIEW_WIDTH = 800;
const MAX_SCALE = 1.3;

export const TryAgainButton: FunctionComponent = () => {
    const resetGameStateAtom = useResetRecoilState(gameStateAtom);

    const centerView = useRecoilValue(centerViewAtom);
    const viewSize = useRecoilValue(viewSizeAtom);

    const uiScale = useMemo(() => {
        const prc = Math.min(MAX_SCALE, viewSize[0] / VIEW_WIDTH);
        return prc;
    }, [viewSize]);

    const resetGame = useCallback(() => {
        shuffleLevel();
        resetGameStateAtom();
    }, [resetGameStateAtom]);

    return (
        <Container scale={uiScale} x={centerView[0]} y={viewSize[1] - 200}>
            <AnimationContainer
                scale={{ x: [1, 1.1, 0.95, 1], y: [1, 1.1, 0.95, 1] }}
                duration={0.8 * ONE_SECOND}
                sleep={3.6 * ONE_SECOND}
            >
                <SVGSprite src={tryAgainSVG} width={752 * 0.75} height={194 * 0.75} onClick={resetGame} />
            </AnimationContainer>
        </Container>
    );
};
