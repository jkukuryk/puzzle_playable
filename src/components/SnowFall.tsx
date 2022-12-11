import { Container } from '@inlet/react-pixi';
import flowerSvg from 'assets/background/snow.svg';
import { ONE_SECOND } from 'constants/time';
import { FunctionComponent, useMemo } from 'react';
import { AnimationContainer, Ease } from './AnimationContainer';
import { ScaleSprite } from './ScaleSprite';
const FALL_TIME = 20 * ONE_SECOND;

const SWING_TIME = 4 * ONE_SECOND;
const ROTATE_TIME = 6 * ONE_SECOND;

const flowersLine = [
    { delay: 15 },
    { delay: 13 },
    { delay: 3 },
    { delay: 12 },
    { delay: 5 },
    { delay: 8 },
    { delay: 14 },
    { delay: 2 },
    { delay: 6 },
    { delay: 10 },
    { delay: 4 },
    { delay: 11 },
    { delay: 1 },
    { delay: 7 },
    { delay: 9 },
    { delay: 0 },
];
type Props = {
    width: number;
    height: number;
};
export const SnowFall: FunctionComponent<Props> = ({ width, height }) => {
    const step = useMemo(() => {
        return width / flowersLine.length;
    }, [width]);

    return (
        <Container>
            {flowersLine.map((flower, key) => {
                return (
                    <Container x={step * key} key={key}>
                        <AnimationContainer
                            key={flower.delay}
                            y={[0, height]}
                            start={flower.delay * (FALL_TIME / flowersLine.length)}
                            duration={FALL_TIME}
                            ease={Ease.LINEAR}
                        >
                            <AnimationContainer x={[-25, 25, -25]} delay={-Math.random() * SWING_TIME} duration={3000}>
                                <AnimationContainer
                                    rotation={[0, 360]}
                                    delay={-Math.random() * ROTATE_TIME}
                                    duration={5000}
                                    ease={Ease.LINEAR}
                                >
                                    <ScaleSprite image={flowerSvg} width={10} height={10} anchor={0.5} />
                                </AnimationContainer>
                            </AnimationContainer>
                        </AnimationContainer>
                    </Container>
                );
            })}
        </Container>
    );
};
