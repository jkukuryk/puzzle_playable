import { Container, Sprite, _ReactPixi } from '@inlet/react-pixi';

import { FunctionComponent, useMemo } from 'react';

type Props = {
    width: number;
    height: number;
    rotation?: number;
    x?: number;
    y?: number;
    image: string;
    anchor?: _ReactPixi.PointLike;
    onClick?: () => void;
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
    anchor = 0.5,
    image,
    onClick,
    rotation,
    zIndex = 100,
    alpha = 1,
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
            interactive={!!onClick}
            zIndex={zIndex}
            scale={scale}
            alpha={alpha}
        >
            <Sprite {...spriteProps} key={image} height={height} width={width} anchor={anchor} source={image} />
        </Container>
    );
};
