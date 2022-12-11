import { FunctionComponent } from 'react';

import { Container, Sprite } from '@inlet/react-pixi';
import { Coordinate } from 'helper/types';

import levelBackground from 'assets/background/levelBackground.jpg';
import { SnowFall } from './SnowFall';

type Props = {
    width: number;
    height: number;
    position: Coordinate;
};
export const LevelBackground: FunctionComponent<Props> = ({ position, width, height }) => {
    return (
        <Container>
            <Sprite position={position} source={levelBackground} width={width} height={height} anchor={0.5} />
            <SnowFall width={width} height={height} />
        </Container>
    );
};
