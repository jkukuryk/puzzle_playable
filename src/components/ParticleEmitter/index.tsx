import { Container } from '@inlet/react-pixi';
import { FunctionComponent, useMemo } from 'react';
import { Particle, ParticleItem } from './Particle';
import drop1 from 'assets/particle/drop1.png';
import drop2 from 'assets/particle/drop2.png';
import drop3 from 'assets/particle/drop3.png';
import { lerp } from 'helper/math';
import { setCoordinate } from 'helper/types';
import { ONE_SECOND } from 'constants/time';

type Props = {
    colors: string[];
    size: number;
    count: number;
    emitterX: number;
    emitterY: number;
    delay?: number;
    lifeTime?: number;
    force?: number;
};

export const ParticleEmitter: FunctionComponent<Props> = ({
    colors,
    size,
    count,
    emitterX,
    emitterY,
    delay = 0,
    lifeTime = ONE_SECOND,
    force = 1,
}) => {
    const particles = useMemo(() => {
        const particlesItems = [] as ParticleItem[];
        for (let index = 0; index < count; index++) {
            particlesItems.push({
                color: colors[Math.floor(Math.random() * colors.length)],
                vector: setCoordinate(lerp(-1, 1, Math.random()), lerp(-1, 1, Math.random())),
                alphaStart: 1,
                alphaEnd: 0,
                scaleStart: 1,
                scaleEnd: 0,
                lifeTime: lerp(0.3, 1, Math.random()) * lifeTime,
                rotationStart: lerp(-Math.PI, Math.PI, Math.random()),
                rotationEnd: lerp(-Math.PI, Math.PI, Math.random()),
                speed: lerp(5, 150, Math.random()) * force,
                image: [drop1, drop2, drop3][Math.floor(Math.random() * 3)],
                position: [
                    lerp(-emitterX / 2, emitterX / 2, Math.random()),
                    lerp(-emitterY / 2, emitterY / 2, Math.random()),
                ],
            });
        }
        return particlesItems;
    }, [colors, count, emitterX, emitterY, force, lifeTime]);

    return (
        <Container>
            {particles.map((particle, key) => {
                return <Particle particle={particle} size={size} key={key} delay={delay} />;
            })}
        </Container>
    );
};
