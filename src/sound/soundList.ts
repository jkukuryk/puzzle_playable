import failure from './assets/failure.mp3';
import success from './assets/success.mp3';
import merge from './assets/merge.mp3';

export enum SoundsType {
    failure = 'failure',
    success = 'success',
    merge = 'merge',
}

export const Sounds = {
    [SoundsType.failure]: failure,
    [SoundsType.success]: success,
    [SoundsType.merge]: merge,
};
type SoundObject = {
    name: SoundsType;
    src: string;
    loop: boolean;
    autoplay: boolean;
    volume?: number;
};

const soundManagerAssets = [
    {
        name: SoundsType.failure,
        src: Sounds[SoundsType.failure],
        loop: false,
        autoplay: false,
        volume: 1,
    },
    {
        name: SoundsType.success,
        src: Sounds[SoundsType.success],
        loop: false,
        autoplay: false,
        volume: 1,
    },
    {
        name: SoundsType.merge,
        src: Sounds[SoundsType.merge],
        loop: false,
        autoplay: false,
        volume: 1,
    },
] as unknown as SoundObject[];

export const getSoundAssets = () => {
    return soundManagerAssets;
};
