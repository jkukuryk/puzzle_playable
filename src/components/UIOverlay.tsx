import { useCallback } from 'react';
import { Graphics } from '@inlet/react-pixi';
import { useRecoilValue } from 'recoil';
import { viewSizeAtom } from 'root/atoms/viewAtoms';

export const Overlay = () => {
    const viewSize = useRecoilValue(viewSizeAtom);

    const drawOverlay = useCallback(
        (d) => {
            d.clear();
            d.alpha = 0.52;
            d.beginFill(0x000000);
            d.drawRect(-viewSize[0] / 2, -viewSize[1] / 2, viewSize[0], viewSize[1]);
        },
        [viewSize]
    );

    return <Graphics draw={drawOverlay} />;
};
