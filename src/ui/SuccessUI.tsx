import { useRecoilValue } from 'recoil';
import { gameStateAtom, GameState } from 'root/atoms/gameStateAtom';
import { centerViewAtom, viewSizeAtom } from 'root/atoms/viewAtoms';
import { SVGSprite } from 'components/SvgSprite';

import { Container } from '@inlet/react-pixi';
import { Overlay } from 'components/UIOverlay';

import successBg from 'assets/ui/successBg.svg';
import nicePNG from 'assets/ui/nice.png';
import workPNG from 'assets/ui/work.png';
import { ScaleSprite } from 'components/ScaleSprite';
import { AnimationContainer } from 'components/AnimationContainer';
import { FunctionComponent, useMemo } from 'react';
import { ParticleEmitter } from 'components/ParticleEmitter';
import { ONE_SECOND } from 'constants/time';

const VIEW_WIDTH = 800;
const MAX_SCALE = 1.3;
const fadeAnimationScale = { x: [0, 1.2, 0.9, 1], y: [0, 1.2, 0.9, 1] };
export const SuccessUI: FunctionComponent = () => {
    const gameState = useRecoilValue(gameStateAtom);
    const centerView = useRecoilValue(centerViewAtom);
    const viewSize = useRecoilValue(viewSizeAtom);

    const uiScale = useMemo(() => {
        const prc = Math.min(MAX_SCALE, viewSize[0] / VIEW_WIDTH);
        return prc;
    }, [viewSize]);

    return (
        <>
            {gameState === GameState.CTA_SUCCESS && (
                <>
                    <AnimationContainer position={centerView} alpha={[0, 1]} loop={false} delay={0} duration={500}>
                        <Overlay />
                    </AnimationContainer>
                    <Container scale={uiScale} x={centerView[0]} y={centerView[1]}>
                        <AnimationContainer duration={ONE_SECOND * 3} rotation={[-5, 5, -5]}>
                            <AnimationContainer scale={fadeAnimationScale} loop={false} delay={30} duration={700}>
                                <SVGSprite src={successBg} width={500} height={500} />
                            </AnimationContainer>
                            <ParticleEmitter
                                colors={['#73CD4B', '#88E060', '#5FB13A', '#ffffff']}
                                size={60}
                                count={60}
                                emitterX={60}
                                emitterY={60}
                                force={10}
                                delay={300}
                                lifeTime={3000}
                            />
                            <AnimationContainer scale={fadeAnimationScale} loop={false} delay={200} duration={700}>
                                <ScaleSprite image={nicePNG} width={500} height={500} />
                            </AnimationContainer>
                            <AnimationContainer scale={fadeAnimationScale} loop={false} delay={300} duration={700}>
                                <ScaleSprite image={workPNG} width={500} height={500} />
                            </AnimationContainer>
                        </AnimationContainer>
                    </Container>
                </>
            )}
        </>
    );
};
