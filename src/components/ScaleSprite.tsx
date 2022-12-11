import { AnimatedSprite, Container, Sprite, _ReactPixi } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

import { FunctionComponent, useMemo } from 'react';

type Props = {
    width: number;
    height: number;
    rotation?: number;
    x?: number;
    y?: number;
    images?: string[];
    image?: string;
    anchor: _ReactPixi.PointLike;
    onClick?: () => void;
    fps?: number;
    loop?: boolean;
    filters?: PIXI.Filter[];
    zIndex?: number;
    scale?: [number, number];
    alpha?: number;
    tint?: number;
};
export const ScaleSprite: FunctionComponent<Props> = ({
    width,
    height,
    x = 0,
    y = 0,
    images,
    anchor,
    image,
    onClick,
    fps = 1,
    rotation,
    loop = true,
    filters = [] as PIXI.Filter[],
    zIndex = 100,
    alpha,
    scale = [1, 1],
    tint,
}) => {
    const spriteProps = useMemo(() => {
        const props = {} as { tint?: number; rotation?: number };
        if (tint) {
            props.tint = tint;
        }
        if (rotation) {
            props.rotation = rotation;
        }
        return props;
    }, [rotation, tint]);

    return (
        <Container
            position={[x, y]}
            pointerdown={(e) => {
                if (onClick) {
                    e.stopPropagation();
                    onClick();
                }
            }}
            filters={filters}
            interactive={!!onClick}
            zIndex={zIndex}
            scale={scale}
            alpha={alpha}
        >
            {!!images && (
                <AnimatedSprite
                    {...spriteProps}
                    height={height}
                    width={width}
                    anchor={anchor}
                    images={images}
                    isPlaying={true}
                    animationSpeed={(1 / 60) * fps}
                    loop={loop}
                />
            )}

            {!!image && (
                <Sprite {...spriteProps} key={image} height={height} width={width} anchor={anchor} source={image} />
            )}
        </Container>
    );
};
