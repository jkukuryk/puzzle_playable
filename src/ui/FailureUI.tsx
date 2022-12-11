import { FunctionComponent, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { gameStateAtom, GameState } from 'root/atoms/gameStateAtom';
import { centerViewAtom, viewSizeAtom } from 'root/atoms/viewAtoms';
import { SVGSprite } from 'components/SvgSprite';

import { Container } from '@inlet/react-pixi';
import { Overlay } from 'components/UIOverlay';

import failureBg from 'assets/ui/failureBg.svg';
import letterF from 'assets/ui/failLetterF.png';
import letterA from 'assets/ui/failLetterA.png';
import letterI from 'assets/ui/failLetterI.png';
import letterL from 'assets/ui/failLetterL.png';
import letterEx from 'assets/ui/failLetterEx.png';
import { ScaleSprite } from 'components/ScaleSprite';
import { AnimationContainer } from 'components/AnimationContainer';
import { ParticleEmitter } from 'components/ParticleEmitter';
import { ONE_SECOND } from 'constants/time';

const VIEW_WIDTH = 800;
const MAX_SCALE = 1.3;
const fadeAnimationScale = { x: [0, 1.2, 0.9, 1], y: [0, 1.2, 0.9, 1] };
export const FailureUI: FunctionComponent = () => {
    const gameState = useRecoilValue(gameStateAtom);
    const centerView = useRecoilValue(centerViewAtom);
    const viewSize = useRecoilValue(viewSizeAtom);

    const uiScale = useMemo(() => {
        const prc = Math.min(MAX_SCALE, viewSize[0] / VIEW_WIDTH);
        return prc;
    }, [viewSize]);

    return (
        <>
            {gameState === GameState.CTA_FAILURE && (
                <>
                    <AnimationContainer position={centerView} alpha={[0, 1]} loop={false} delay={0} duration={500}>
                        <Overlay />
                    </AnimationContainer>
                    <Container scale={uiScale} x={centerView[0]} y={centerView[1]}>
                        <AnimationContainer duration={ONE_SECOND * 3} rotation={[-5, 5, -5]}>
                            <AnimationContainer scale={fadeAnimationScale} loop={false} delay={50} duration={700}>
                                <SVGSprite src={failureBg} width={500} height={500} />
                            </AnimationContainer>
                            <ParticleEmitter
                                colors={['#E86A17', '#FA8132', '#CD5D12', '#ffffff']}
                                size={60}
                                count={60}
                                emitterX={60}
                                emitterY={60}
                                force={10}
                                delay={300}
                                lifeTime={3000}
                            />
                            <AnimationContainer scale={fadeAnimationScale} loop={false} delay={200} duration={700}>
                                <ScaleSprite image={letterF} width={500} height={500} />
                            </AnimationContainer>
                            <AnimationContainer scale={fadeAnimationScale} loop={false} delay={250} duration={650}>
                                <ScaleSprite image={letterA} width={500} height={500} />
                            </AnimationContainer>
                            <AnimationContainer scale={fadeAnimationScale} loop={false} delay={300} duration={600}>
                                <ScaleSprite image={letterI} width={500} height={500} />
                            </AnimationContainer>
                            <AnimationContainer scale={fadeAnimationScale} loop={false} delay={350} duration={550}>
                                <ScaleSprite image={letterL} width={500} height={500} />
                            </AnimationContainer>
                            <AnimationContainer scale={fadeAnimationScale} loop={false} delay={400} duration={500}>
                                <ScaleSprite image={letterEx} width={500} height={500} />
                            </AnimationContainer>
                        </AnimationContainer>
                    </Container>
                </>
            )}
        </>
    );
};
