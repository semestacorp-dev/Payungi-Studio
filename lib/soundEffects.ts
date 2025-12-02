
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const SOUND_URLS = {
    click: 'https://cdn.pixabay.com/audio/2022/03/15/audio_7319e07886.mp3', // Soft UI Click
    hover: 'https://cdn.pixabay.com/audio/2022/03/24/audio_777b7d7260.mp3', // Subtle hover
    shutter: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3', // Camera Shutter
    beep: 'https://cdn.pixabay.com/audio/2023/07/11/audio_a16d56d45e.mp3', // Countdown Beep
    success: 'https://cdn.pixabay.com/audio/2022/03/19/audio_97427a9254.mp3', // Magic Chime
    error: 'https://cdn.pixabay.com/audio/2022/03/10/audio_b4e9417937.mp3' // Error thud
};

const audioCache: Record<string, HTMLAudioElement> = {};

// Preload sounds
if (typeof window !== 'undefined') {
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
        const audio = new Audio(url);
        audio.volume = 0.5;
        audioCache[key] = audio;
    });
}

export const playSound = (type: keyof typeof SOUND_URLS) => {
    if (typeof window === 'undefined') return;
    
    try {
        const audio = audioCache[type];
        if (audio) {
            audio.currentTime = 0;
            // Shutter needs to be louder
            if (type === 'shutter') audio.volume = 1.0;
            else audio.volume = 0.4;
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Auto-play was prevented
                    // console.warn("Sound play prevented:", error);
                });
            }
        }
    } catch (e) {
        console.error("Error playing sound", e);
    }
};
