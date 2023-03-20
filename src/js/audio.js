import { Audio as TAudio, AudioListener, AudioLoader } from 'three';
import json from '../json/audio.json';

class Audio {
    constructor(manager) {
        this.cache = {};
        this.muted = false;
        this.listener = new AudioListener();
        this.loader = new AudioLoader(manager);
        this.volume = 1;
        this.setMasterVolume(this.volume);
    }

    load() {
        var _this = this;
        for (const [key, value] of Object.entries(json)) {
            this.loader.load(value.url, function(buffer) {
                var sound = new TAudio(_this.listener);
                sound.name = key;
                sound.setBuffer(buffer);
                _this.cache[key] = sound;
            });
        }
    }

    play(name) {
        this.cache[name].play();
    }

    toggleVolume() {
        if (this.muted == true) {
            this.muted = false;
            this.setMasterVolume(this.volume); // Use previous volume
        }
        else {
            this.muted = true;
            this.volume = this.getMasterVolume(); // Update previous volume
            this.setMasterVolume(0);
        }
    }

    mute(mute) {
        this.muted = !mute; // Set state to opposite
        this.toggleVolume();
    }

    setMasterVolume(volume) {
        this.listener.setMasterVolume(volume || 1);
    }

    getMasterVolume() {
        return this.listener.getMasterVolume();
    }
}

export { Audio };