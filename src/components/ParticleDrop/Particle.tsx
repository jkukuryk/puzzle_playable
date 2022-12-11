import { useTick } from '@inlet/react-pixi';
import Color from 'color';
import { ScaleSprite } from 'components/ScaleSprite';
import { lerp } from 'helper/math';
import { Coordinate } from 'helper/types';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';
export type ParticleItem = {
    color: string;
    image: string;
    vector: Coordinate;
    alphaStart: number;
    alphaEnd: number;
    scaleStart: number;
    scaleEnd: number;
    rotationStart: number;
    rotationEnd: number;
    lifeTime: number;
    speed: number;
    position: Coordinate;
};
type Props = {
    particle: ParticleItem;
    size: number;
};

export const Particle: FunctionComponent<Props> = ({ particle, size }) => {
    const {
        vector,
        speed,
        scaleStart,
        lifeTime,
        alphaStart,
        position,
        scaleEnd,
        rotationStart,
        rotationEnd,
        alphaEnd,
        image,
        color,
    } = particle;
    const startAnimation = useMemo(() => performance.now(), []);
    const [active, setActive] = useState(true);

    const [anim, setAnim] = useState({
        position: position,
        scale: scaleStart,
        alpha: alphaStart,
        rotation: rotationStart,
    });
    const updateParticle = useCallback(() => {
        const progress = (performance.now() - startAnimation) / (lifeTime * 1000);
        if (progress > 1) {
            setActive(false);
        } else {
            const alpha = lerp(alphaStart, alphaEnd, progress);
            const scale = lerp(scaleStart, scaleEnd, progress);
            const rotation = lerp(rotationStart, rotationEnd, progress);
            const x = position[0] + speed * progress * vector[0];
            const y = position[1] + speed * progress * vector[1];
            setAnim({ scale, position: [x, y], alpha, rotation });
        }
    }, [
        alphaEnd,
        alphaStart,
        lifeTime,
        position,
        rotationEnd,
        rotationStart,
        scaleEnd,
        scaleStart,
        speed,
        startAnimation,
        vector,
    ]);

    useTick(updateParticle, active);
    if (!active) {
        return null;
    }

    return (
        <ScaleSprite
            tint={Color(color).rgbNumber()}
            x={anim.position[0]}
            y={anim.position[1]}
            image={image}
            width={size}
            height={size}
            scale={[anim.scale, anim.scale]}
            anchor={0.5}
            alpha={anim.alpha}
            rotation={anim.rotation}
        />
    );
};
