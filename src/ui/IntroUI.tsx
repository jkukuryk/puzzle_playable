import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { gameStateAtom, GameState } from 'root/atoms/gameStateAtom';
import { centerViewAtom, viewSizeAtom } from 'root/atoms/viewAtoms';
import { SVGSprite } from 'components/SvgSprite';
import tutorialInfo from 'assets/ui/tutorialInfo.svg';
import startButton from 'assets/ui/start.svg';
import { Container } from '@inlet/react-pixi';
import { Overlay } from 'components/UIOverlay';
import { AnimationContainer } from 'components/AnimationContainer';
import { ONE_SECOND } from 'constants/time';
import gsap, { Power0, Back } from 'gsap';
import { SoundManager } from 'root/sound/soundManager';
import { SoundsType } from 'root/sound/soundList';

const INTRO_WIDTH = 1200;
const MAX_SCALE = 1.3;

export const IntroUI: FunctionComponent = () => {
    const [gameState, setGameState] = useRecoilState(gameStateAtom);
    const centerView = useRecoilValue(centerViewAtom);
    const viewSize = useRecoilValue(viewSizeAtom);
    const overlayRef = useRef(undefined);
    const infoRef = useRef(undefined);
    const buttonRef = useRef(undefined);
    const [clickDisabled, setClickDisabled] = useState(false);

    const uiScale = useMemo(() => {
        const prc = Math.min(MAX_SCALE, viewSize[0] / INTRO_WIDTH);
        return prc;
    }, [viewSize]);

    useEffect(() => {
        if (gameState === GameState.INTRO) {
            setClickDisabled(false);
            if (overlayRef.current) {
                gsap.fromTo(
                    overlayRef.current,
                    {
                        alpha: 0,
                    },
                    { alpha: 1, duration: 1, delay: 0.1, ease: Power0.easeOut }
                );
            }
            if (infoRef.current) {
                gsap.fromTo(
                    infoRef.current,
                    {
                        alpha: 0,
                        y: -100,
                    },
                    { alpha: 1, y: 0, duration: 0.6, delay: 0.3, ease: Back.easeOut }
                );
            }
            if (buttonRef.current) {
                gsap.fromTo(
                    buttonRef.current,
                    {
                        alpha: 0,
                        y: -120,
                    },
                    { alpha: 1, y: 120, duration: 0.4, delay: 0.5, ease: Back.easeOut }
                );
            }
        }
    }, [gameState]);

    const startGame = useCallback(() => {
        if (!clickDisabled) {
            SoundManager.play(SoundsType.merge, 0, true);
            setClickDisabled(true);
            if (overlayRef.current) {
                gsap.to(overlayRef.current, { alpha: 0, duration: 1, delay: 0.5, ease: Power0.easeIn }).then(() => {
                    setGameState(GameState.PLAY);
                });
            }
            if (infoRef.current) {
                gsap.to(infoRef.current, { alpha: 0, y: 300, duration: 1, delay: 0.2, ease: Back.easeIn });
            }
            if (buttonRef.current) {
                gsap.to(buttonRef.current, { alpha: 0, y: 420, duration: 1.1, delay: 0.1, ease: Back.easeIn });
            }
        }
    }, [clickDisabled, setGameState]);

    if (gameState !== GameState.INTRO) {
        return null;
    }
    return (
        <>
            <Container ref={overlayRef} x={centerView[0]} y={centerView[1]}>
                <Overlay />
            </Container>
            <Container scale={uiScale} x={centerView[0]} y={centerView[1]}>
                <Container ref={infoRef}>
                    <SVGSprite src={tutorialInfo} width={1004} height={238} />
                </Container>
                <AnimationContainer
                    onClick={startGame}
                    y={[0, -15, 0, -15, 0]}
                    scale={{ x: [1, 1.1, 1, 1.1, 1], y: [1, 1.1, 1, 1.1, 1] }}
                    sleep={ONE_SECOND}
                    duration={ONE_SECOND}
                >
                    <Container ref={buttonRef}>
                        <SVGSprite src={startButton} width={536} height={138} />
                    </Container>
                </AnimationContainer>
            </Container>
        </>
    );
};
