import { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { Stage, Container, Sprite } from '@inlet/react-pixi';
import { addResizeListener } from 'helper/adProtocols';
import { sendToSubscriber, RecoilEventsSubscription } from './Subscriber';
import { Coordinate } from 'helper/types';

import { gameSize } from 'constants/resolution';
import levelBackground from 'assets/background/levelBackground.jpg';

const BG_COLOR = 0xcfeffc;
const BG_RATIO = [800, 800];

export const StageContainer: FunctionComponent = ({ children }) => {
    const [backgroundSize, setBackgroundSize] = useState({ width: 0, height: 0 });

    const [screenSize, setScreenSize] = useState<Coordinate>([0, 0]);
    const [gameScale, setGameScale] = useState(1);

    const getTranslation = useCallback(
        (left: number, top: number, screenWidth: number, screenHeight: number, scaleView: number) => {
            const visibleLeft = Math.abs(left);
            const visibleTop = Math.abs(top);
            const range = {
                top: visibleTop,
                left: visibleLeft,
                right: visibleLeft + screenWidth / scaleView,
                bottom: visibleTop + screenHeight / scaleView,
            };
            sendToSubscriber(RecoilEventsSubscription.RECT_VIEW_CHANGED, range);
        },
        []
    );
    const onResizeGame = useCallback(
        (screenWidth: number, screenHeight: number) => {
            setScreenSize([screenWidth, screenHeight]);
            const newBackgroundRatio = Math.max(screenWidth / BG_RATIO[0], screenHeight / BG_RATIO[1]);
            const newGameScale = Math.min(screenWidth / gameSize[0], screenHeight / gameSize[1]);
            sendToSubscriber(RecoilEventsSubscription.RESIZE, { width: screenWidth, height: screenHeight });
            setGameScale(newGameScale);
            sendToSubscriber(RecoilEventsSubscription.GAME_SCALE, newGameScale);
            setBackgroundSize({
                width: BG_RATIO[0] * newBackgroundRatio,
                height: BG_RATIO[1] * newBackgroundRatio,
            });
            getTranslation(0, 0, screenWidth, screenHeight, newGameScale);
        },
        [getTranslation]
    );
    useEffect(() => {
        addResizeListener(onResizeGame, 'stageContainerOnResize');
    }, [onResizeGame]);

    return (
        <Stage
            key={window.devicePixelRatio}
            options={{
                resolution: window.devicePixelRatio,
                autoDensity: true,
                autoStart: false,
                backgroundColor: BG_COLOR,
            }}
            width={screenSize[0]}
            height={screenSize[1]}
        >
            <Sprite
                position={[screenSize[0] / 2, screenSize[1] / 2]}
                source={levelBackground}
                width={backgroundSize.width}
                height={backgroundSize.height}
                anchor={0.5}
            />
            <Container scale={gameScale}>{children}</Container>
        </Stage>
    );
};
