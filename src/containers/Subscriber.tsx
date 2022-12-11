import { valuesIn } from 'lodash';

import { FunctionComponent, useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { gameStateAtom, GameState } from '../atoms/gameStateAtom';
import { viewSizeRectAtom, viewSizeAtom, centerViewAtom, viewOrientationAtom, gameScaleAtom } from '../atoms/viewAtoms';

export enum RecoilEventsSubscription {
    RECT_VIEW_CHANGED = 'rectViewChanged',
    RESIZE = 'resize',
    GAME_SCALE = 'gameScale',
}
const recoilListeners = [] as RecoilEventsSubscription[];

valuesIn(RecoilEventsSubscription).forEach((eventType) => {
    recoilListeners.push(eventType);
});

export const Subscriber: FunctionComponent = () => {
    const setSizeRectView = useSetRecoilState(viewSizeRectAtom);
    const setSizeView = useSetRecoilState(viewSizeAtom);
    const setCenterView = useSetRecoilState(centerViewAtom);
    const setViewOrientation = useSetRecoilState(viewOrientationAtom);
    const setGameScale = useSetRecoilState(gameScaleAtom);
    const setGameState = useSetRecoilState(gameStateAtom);

    useEffect(() => {
        setGameState(GameState.INTRO);
    }, [setGameState]);

    const changeState = useCallback(
        (atomKey, value: any) => {
            switch (atomKey) {
                case RecoilEventsSubscription.RECT_VIEW_CHANGED:
                    setSizeRectView(value);
                    setCenterView([
                        value.left + (value.right - value.left) / 2,
                        value.top + (value.bottom - value.top) / 2,
                    ]);
                    setSizeView([value.right - value.left, value.bottom - value.top]);
                    break;
                case RecoilEventsSubscription.GAME_SCALE:
                    setGameScale(value);
                    break;
                case RecoilEventsSubscription.RESIZE:
                    setViewOrientation(value.width > value.height ? 'horizontal' : 'vertical');
                    break;
                default:
                    console.error('USE KEY', atomKey);
            }
        },
        [setCenterView, setGameScale, setSizeRectView, setSizeView, setViewOrientation]
    );

    useEffect(() => {
        recoilListeners.forEach((listenerKey) => {
            document.addEventListener(listenerKey, (e) => {
                changeState(listenerKey, e.detail);
            });
        });
    }, [changeState]);

    return null;
};

export const sendToSubscriber = (subscription: RecoilEventsSubscription, data: any) => {
    document.dispatchEvent(new CustomEvent(subscription, { detail: data }));
};
