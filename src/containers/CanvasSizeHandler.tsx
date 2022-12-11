import { addResizeListener } from 'helper/adProtocols';
import { FunctionComponent, useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { canvasWidthAtom, canvasHeightAtom, gameViewWidthAtom, gameViewHeightAtom } from 'root/atoms/canvasSize';
import { Coordinate } from 'helper/types';
const UI_RATIO_SCALE = window.devicePixelRatio;

export const CanvasSizeHandler: FunctionComponent<{ size: 'contain' | 'cover'; gameSize: Coordinate }> = ({
    size,
    gameSize,
}) => {
    const setCanvasWidth = useSetRecoilState(canvasWidthAtom);
    const setCanvasHeight = useSetRecoilState(canvasHeightAtom);
    const setGameWidth = useSetRecoilState(gameViewWidthAtom);
    const setGameHeight = useSetRecoilState(gameViewHeightAtom);

    const updateCanvasSize = useCallback(
        (width, height) => {
            setCanvasWidth(width * UI_RATIO_SCALE);
            setCanvasHeight(height * UI_RATIO_SCALE);
            let scale;
            if (size === 'cover') {
                scale = Math.min(width / gameSize[0], height / gameSize[1]);
            } else {
                scale = Math.max(width / gameSize[0], height / gameSize[1]);
            }

            setGameHeight(height * scale);
            setGameWidth(width * scale);
        },
        [setCanvasWidth, setCanvasHeight, size, setGameHeight, setGameWidth, gameSize]
    );
    useEffect(() => {
        addResizeListener(updateCanvasSize, 'updateCanvasSize');
    }, [updateCanvasSize]);
    return null;
};
