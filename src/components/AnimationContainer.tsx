import { Container } from '@inlet/react-pixi';
import { v4 as uuid } from 'uuid';

import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isUndefined } from 'lodash';
import { degreesToRadians, easeInBackOut, easeInOut, lerp } from 'helper/math';
import { Time, addTicker, removeTicker } from 'helper/ticker';
export const defaultDuration = 1000;
export enum Ease {
    NONE = 'none',
    IN_OUT = 'inOut',
    IN_OUT_BACK = 'inOutBack',
    LINEAR = 'linear',
}
export interface AnimationContainerAnimationProps {
    x?: number[];
    y?: number[];
    tint?: number[];
    alpha?: number[];
    scale?: { x?: number[]; y?: number[] };
    rotation?: number[];
    sleep?: number;
    duration?: number;
    delay?: number;
    ease?: Ease;
    loop?: boolean;
    start?: number;
}
interface Props extends AnimationContainerAnimationProps {
    position?: number[];
    onClick?: () => void;
    onFinish?: () => void;
    onUpdate?: (anim: AnimationChanges) => void;
    onStart?: () => void;
    name?: string;
    zIndex?: number;
    sortableChildren?: boolean;
    debug?: boolean;
}
export type AnimationProperty = {
    x?: number[];
    y?: number[];
    rotation?: number[];
    duration?: number;
    alpha?: number[];
};
type AnimationChanges = {
    x: number;
    y: number;
    rotation: number;
    scale: {
        x: number;
        y: number;
    };
    alpha: number;
};
export const AnimationContainer: FunctionComponent<Props> = ({
    x,
    y,
    scale,
    children,
    alpha,
    rotation,
    duration = defaultDuration,
    position = [0, 0],
    onClick,
    delay = 0,
    onFinish,
    onStart,
    onUpdate,
    loop = true,
    ease = Ease.IN_OUT,
    sleep = 0,
    zIndex = 1,
    sortableChildren = false,
    start = 0,
    ...otherProps
}) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isStarted, setStarted] = useState(false);
    const [active, setActive] = useState(true);

    const [anim, setAnim] = useState<AnimationChanges>({
        x: x ? x[0] : 0,
        y: y ? y[0] : 0,
        rotation: rotation?.[0] || 0,
        scale: { x: scale?.x ? scale.x[0] : 1, y: scale?.y ? scale.y[0] : 1 },
        alpha: alpha ? alpha[0] : 1,
    });
    const [lastFrame, setCurrentFrame] = useState(0);
    const [startAnimation, setStartAnimation] = useState(0);

    useEffect(() => {
        const startProps = start || performance.now();
        setStartAnimation(startProps + delay);
    }, [delay, isStarted, start]);

    const updateAnimation = useCallback(() => {
        if (active) {
            const now = Time.now();
            if (now < startAnimation) {
                return;
            }
            if (!isStarted) {
                setStarted(true);
                onStart?.();
            }
            let currentFrame = Math.floor((now - startAnimation) / duration);
            let timeProgress = ((now - startAnimation) % duration) / duration;

            if (now - startAnimation > duration) {
                if (loop) {
                    const timeAfterStart = now - startAnimation;
                    const loopAboveStart = Math.floor(timeAfterStart / duration);

                    setStartAnimation(startAnimation + loopAboveStart * duration + sleep);
                    if (sleep > 0) {
                        setIsPlaying(false);
                        setTimeout(setIsPlaying, sleep, true);
                        if (onStart) setTimeout(onStart, sleep);
                    } else {
                        onStart?.();
                    }
                } else {
                    setIsPlaying(false);
                    timeProgress = 1;
                }
                currentFrame = 1;
                onFinish?.();
            }
            if (currentFrame > lastFrame) {
                setCurrentFrame(currentFrame);
            }
            const xProgress = x ? getProgressValue(x, timeProgress, ease) : 0;
            const yProgress = y ? getProgressValue(y, timeProgress, ease) : 0;
            const rotationProgress = rotation ? getProgressValue(rotation, timeProgress, ease) : 0;
            const scaleProgressX = scale && scale.x ? getProgressValue(scale.x, timeProgress, ease) : 1;
            const scaleProgressY = scale && scale.y ? getProgressValue(scale.y, timeProgress, ease) : 1;
            const opacity = alpha && alpha ? getProgressValue(alpha, timeProgress, ease) : 1;

            setAnim({
                x: xProgress,
                y: yProgress,
                rotation: rotationProgress,
                scale: { x: scaleProgressX, y: scaleProgressY },
                alpha: opacity,
            });
            if (onUpdate) {
                onUpdate(anim);
            }
        }
    }, [
        active,
        startAnimation,
        isStarted,
        duration,
        lastFrame,
        x,
        ease,
        y,
        rotation,
        scale,
        alpha,
        onUpdate,
        onStart,
        loop,
        onFinish,
        sleep,
        anim,
    ]);
    const tickerId = useMemo(() => {
        return `updateAnimation_${uuid()}`;
    }, []);

    useEffect(() => {
        if (isPlaying) {
            addTicker(updateAnimation, tickerId);
            setActive(true);
        } else {
            removeTicker(tickerId);
            setActive(false);
        }
        return () => {
            removeTicker(tickerId);
            setActive(false);
        };
    }, [isPlaying, tickerId, updateAnimation]);

    const containerRef = useRef(null);

    const isInteractive = useMemo(() => {
        return !isUndefined(onClick);
    }, [onClick]);

    return (
        <Container
            zIndex={zIndex}
            pointerdown={() => {
                onClick?.();
            }}
            mousedown={() => {
                onClick?.();
            }}
            position={[position[0] + anim.x, position[1] + anim.y]}
            rotation={degreesToRadians(anim.rotation) || 0}
            scale={[anim.scale.x, anim.scale.y]}
            alpha={anim.alpha}
            interactive={isInteractive}
            anchor={0.5}
            {...otherProps}
        >
            <Container position={[0, 0]} ref={containerRef} sortableChildren={sortableChildren}>
                {children}
            </Container>
        </Container>
    );
};

export function getProgressValue(property: number[], timeProgress: number, ease: Ease) {
    if (timeProgress === 1) {
        return property[property.length - 1];
    }
    const steps = property.length - 1;
    const currentStep = Math.floor(timeProgress * steps);
    const stepTime = 1 / steps;
    const stepProgress = (timeProgress - stepTime * currentStep) / stepTime;
    let progress;
    switch (ease) {
        case Ease.IN_OUT_BACK:
            progress = easeInBackOut(stepProgress);
            break;
        case Ease.LINEAR:
            progress = stepProgress;
            break;
        case Ease.NONE:
            progress = 0;
            break;
        default:
            progress = easeInOut(stepProgress);
            break;
    }
    const range = [property[currentStep], property[currentStep + 1]];
    return lerp(range[0], range[1], progress);
}
