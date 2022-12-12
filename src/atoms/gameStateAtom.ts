import { atom, selector } from 'recoil';

export enum GameState {
    LOADER = 'loader',
    INTRO = 'intro',
    PLAY = 'play',
    CTA_SUCCESS = 'success_cta',
    CTA_FAILURE = 'failure_cta',
}

export const gameStateAtom = atom({
    key: 'gameStateAtom',
    default: GameState.LOADER,
});

export const gameActiveAtom = selector({
    key: 'gameActiveAtom',
    get: ({ get }) => {
        const state = get(gameStateAtom);
        return state === GameState.PLAY;
    },
});
