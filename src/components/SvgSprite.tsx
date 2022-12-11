import { Sprite, _ReactPixi } from '@inlet/react-pixi';
import { FunctionComponent, useMemo } from 'react';
import * as PIXI from 'pixi.js';

type Props = {
    rotation?: number;
    x?: number;
    y?: number;
    anchor?: _ReactPixi.PointLike;
    onClick?: () => void;
    src: string;
    scale?: number;
    width: number;
    height: number;
};

export const SVGSprite: FunctionComponent<Props> = ({
    x = 0,
    y = 0,
    anchor = 0.5,
    onClick,
    src,
    rotation,
    scale = 2,
    width,
    height,
}) => {
    const texture = useMemo(() => {
        return PIXI.Texture.from(src, { resourceOptions: { scale } });
    }, [src, scale]);

    return (
        <Sprite
            position={[x, y]}
            pointerdown={(e) => {
                if (onClick) {
                    e.stopPropagation();
                    onClick();
                }
            }}
            interactive={!!onClick}
            anchor={anchor}
            texture={texture}
            rotation={rotation || 0}
            scale={1 / scale}
            width={width}
            height={height}
        />
    );
};
