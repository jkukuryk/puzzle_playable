import { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import { gameStateAtom, GameState } from 'root/atoms/gameStateAtom';
import { centerViewAtom } from 'root/atoms/viewAtoms';

import { Overlay } from 'components/UIOverlay';

import { AnimationContainer } from 'components/AnimationContainer';
import { TryAgainButton } from './TryAgainButton';
import { FailureIcon } from './FailureIcon';

export const FailureUI: FunctionComponent = () => {
    const gameState = useRecoilValue(gameStateAtom);
    const centerView = useRecoilValue(centerViewAtom);

    return (
        <>
            {gameState === GameState.CTA_FAILURE && (
                <>
                    <AnimationContainer position={centerView} alpha={[0, 1]} loop={false} delay={0} duration={500}>
                        <Overlay />
                    </AnimationContainer>
                    <FailureIcon />
                    <TryAgainButton />
                </>
            )}
        </>
    );
};
