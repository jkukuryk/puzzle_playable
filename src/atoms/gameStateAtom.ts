import { atom } from 'recoil';

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

export const debugPhysicAtom = atom({
    key: 'debugPhysicAtom',
    default: false,
});
export const gameOverStateAtom = atom({
    key: 'gameOverAtom',
    default: null as null | 'won' | 'failed',
});

export const levelSuccessAtom = atom({
    key: 'levelSuccessAtom',
    default: false,
});
