import { useRecoilValue } from 'recoil';
import { gameStateAtom, GameState } from 'root/atoms/gameStateAtom';
import { centerViewAtom } from 'root/atoms/viewAtoms';

import { Overlay } from 'components/UIOverlay';

import { AnimationContainer } from 'components/AnimationContainer';
import { FunctionComponent } from 'react';
import { SuccessIcon } from './SuccessIcon';

export const SuccessUI: FunctionComponent = () => {
    const gameState = useRecoilValue(gameStateAtom);
    const centerView = useRecoilValue(centerViewAtom);

    return (
        <>
            {gameState === GameState.CTA_SUCCESS && (
                <>
                    <AnimationContainer position={centerView} alpha={[0, 1]} loop={false} delay={0} duration={500}>
                        <Overlay />
                    </AnimationContainer>
                    <SuccessIcon />
                </>
            )}
        </>
    );
};
