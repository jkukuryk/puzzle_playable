import { isDapi, isDesktop } from 'helper/adProtocols';
import { Howl } from 'howler';

let logSoundValueChange: any;
let initSoundReported = false;
let changeSoundReported = false;

type SoundElements = { [name: string]: { instance: Howl; soundData: SoundFile } };
export type SoundFile = {
    name: string;
    src: string;
    loop: boolean;
    autoplay: boolean;
    volume?: number;
};
class SoundController {
    initialized: boolean;
    soundsList: SoundElements;
    volume: number;

    constructor() {
        this.initialized = false;
        this.soundsList = {} as SoundElements;
        this.volume = 1;
        this.init = this.init.bind(this);
        this.play = this.play.bind(this);
        this.mute = this.mute.bind(this);
        this.setVolume = this.setVolume.bind(this);
    }

    play(soundName: string, timeout = 0, force = false) {
        if (!soundActive()) {
            if (force) {
                timeout = Math.max(timeout, 300);
            } else {
                return;
            }
        }

        if (timeout) {
            setTimeout((sm) => sm.soundsList[soundName].instance.play(), timeout, this);
        } else {
            this.soundsList[soundName].instance.play();
        }
    }
    mute(muteStatus: boolean) {
        if (muteStatus) {
            this.setVolume(0);
        } else {
            this.setVolume(1);
        }
    }
    setVolume(volumeValue: number) {
        this.volume = volumeValue;
        Object.keys(this.soundsList).forEach((soundKey) => {
            const soundItem = this.soundsList[soundKey];
            soundItem.instance.volume(volumeValue * (soundItem.soundData.volume || 1));
        });
    }
    init(soundManagerAssets: SoundFile[]) {
        if (!this.initialized) {
            this.initialized = true;
            const newSoundList = {} as { [key: string]: { instance: Howl; soundData: SoundFile } };
            soundManagerAssets.forEach((sound) => {
                const newHowlSoundSrc = new Howl({
                    src: [sound.src],
                    loop: sound.loop,
                    volume: sound.volume || 1,
                    autoplay: sound.autoplay,
                });
                newSoundList[sound.name] = { instance: newHowlSoundSrc, soundData: sound };
            });
            this.soundsList = newSoundList;
            setVolumeListener();
        }
    }
}

function setVolumeListener() {
    document.addEventListener('pointerdown', firstInteraction);
    document.addEventListener('click', firstInteraction);

    if (isDapi()) {
        setTimeout(getSystemVolumeOnInit, 2000);
        SoundManager.setVolume(dapi.getAudioVolume());
        dapi.addEventListener('audioVolumeChange', (e) => {
            SoundManager.setVolume(e);
            clearTimeout(logSoundValueChange);
            logSoundValueChange = setTimeout(getSystemVolumeAfterChange, 1000);
        });
    } else if (isDesktop()) {
        document.addEventListener('keydown', handlePresentationSound);
    }
}
export const SoundManager = new SoundController();

function handlePresentationSound(e: { key: string }) {
    const keyValue = e.key;
    switch (keyValue) {
        case 'p':
            SoundManager.setVolume(0.1);
            break;
        case 'm':
            SoundManager.setVolume(0);
            break;
        case '+':
            SoundManager.setVolume(Math.min(1, SoundManager.volume + 0.1));
            break;
        case '-':
            SoundManager.setVolume(Math.max(0, SoundManager.volume - 0.1));
            break;
    }
}

function soundActive() {
    return hasFirstInteraction();
}

function getSystemVolumeOnInit() {
    if (isDapi() && !initSoundReported) {
        initSoundReported = true;
    }
}
function getSystemVolumeAfterChange() {
    if (isDapi() && initSoundReported && !changeSoundReported) {
        changeSoundReported = true;
    }
}
let gameTouched = false;

export function hasFirstInteraction() {
    return gameTouched;
}

export function firstInteraction() {
    if (!gameTouched) {
        document.removeEventListener('pointerdown', firstInteraction);
        document.removeEventListener('click', firstInteraction);
        gameTouched = true;
    }
}
