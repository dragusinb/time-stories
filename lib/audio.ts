import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Audio System
 *
 * Provides background music and sound effects for the app.
 * Uses HTML5 Audio for broad compatibility.
 *
 * Music tracks are loaded lazily and crossfade between each other.
 * Sound effects are preloaded for instant playback.
 */

// Audio file paths (relative to /public/audio/)
export const MUSIC_TRACKS = {
    menu: '/audio/music/menu-ambient.mp3',
    lab: '/audio/music/lab-ambient.mp3',
    apollo: '/audio/music/apollo-theme.mp3',
    alchemist: '/audio/music/alchemist-theme.mp3',
    archimedes: '/audio/music/archimedes-theme.mp3',
} as const;

export const SFX = {
    // UI sounds
    buttonClick: '/audio/sfx/button-click.mp3',
    buttonHover: '/audio/sfx/button-hover.mp3',
    pageFlip: '/audio/sfx/page-flip.mp3',
    modalOpen: '/audio/sfx/modal-open.mp3',
    modalClose: '/audio/sfx/modal-close.mp3',

    // Rewards
    coinEarned: '/audio/sfx/coin-earned.mp3',
    coinsMany: '/audio/sfx/coins-many.mp3',
    rewardClaim: '/audio/sfx/reward-claim.mp3',
    achievementUnlock: '/audio/sfx/achievement-unlock.mp3',
    trophyUnlock: '/audio/sfx/trophy-unlock.mp3',

    // Minigames
    minigameStart: '/audio/sfx/minigame-start.mp3',
    minigameSuccess: '/audio/sfx/minigame-success.mp3',
    minigameFail: '/audio/sfx/minigame-fail.mp3',
    correctAnswer: '/audio/sfx/correct-answer.mp3',
    wrongAnswer: '/audio/sfx/wrong-answer.mp3',
    timerTick: '/audio/sfx/timer-tick.mp3',
    timerWarning: '/audio/sfx/timer-warning.mp3',

    // Lab
    energyGain: '/audio/sfx/energy-gain.mp3',
    upgrade: '/audio/sfx/upgrade.mp3',
    prestige: '/audio/sfx/prestige.mp3',
} as const;

export type MusicTrack = keyof typeof MUSIC_TRACKS;
export type SoundEffect = keyof typeof SFX;

interface AudioState {
    // Settings
    musicVolume: number; // 0-1
    sfxVolume: number; // 0-1
    isMuted: boolean;
    musicEnabled: boolean;
    sfxEnabled: boolean;

    // Current state
    currentTrack: MusicTrack | null;
    isPlaying: boolean;

    // Actions
    setMusicVolume: (volume: number) => void;
    setSfxVolume: (volume: number) => void;
    setMuted: (muted: boolean) => void;
    setMusicEnabled: (enabled: boolean) => void;
    setSfxEnabled: (enabled: boolean) => void;
    playMusic: (track: MusicTrack) => void;
    stopMusic: () => void;
    pauseMusic: () => void;
    resumeMusic: () => void;
    playSfx: (sound: SoundEffect) => void;
}

// Audio elements (managed outside of store to avoid serialization issues)
let musicElement: HTMLAudioElement | null = null;
let sfxElements: Map<string, HTMLAudioElement> = new Map();
let audioContext: AudioContext | null = null;

// Initialize audio context on first user interaction
const initAudioContext = () => {
    if (typeof window === 'undefined') return;

    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Resume if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
};

// Preload a sound effect
const preloadSfx = (key: string, path: string) => {
    if (typeof window === 'undefined') return;

    if (!sfxElements.has(key)) {
        const audio = new Audio(path);
        audio.preload = 'auto';
        sfxElements.set(key, audio);
    }
};

// Preload common sound effects
const preloadCommonSfx = () => {
    if (typeof window === 'undefined') return;

    // Preload the most commonly used sounds
    const commonSounds: SoundEffect[] = [
        'buttonClick',
        'coinEarned',
        'rewardClaim',
        'minigameSuccess',
        'minigameFail',
    ];

    commonSounds.forEach((sound) => {
        preloadSfx(sound, SFX[sound]);
    });
};

export const useAudioStore = create<AudioState>()(
    persist(
        (set, get) => ({
            musicVolume: 0.5,
            sfxVolume: 0.7,
            isMuted: false,
            musicEnabled: true,
            sfxEnabled: true,
            currentTrack: null,
            isPlaying: false,

            setMusicVolume: (volume) => {
                set({ musicVolume: Math.max(0, Math.min(1, volume)) });
                if (musicElement) {
                    musicElement.volume = get().isMuted ? 0 : volume;
                }
            },

            setSfxVolume: (volume) => {
                set({ sfxVolume: Math.max(0, Math.min(1, volume)) });
            },

            setMuted: (muted) => {
                set({ isMuted: muted });
                if (musicElement) {
                    musicElement.volume = muted ? 0 : get().musicVolume;
                }
            },

            setMusicEnabled: (enabled) => {
                set({ musicEnabled: enabled });
                if (!enabled) {
                    get().stopMusic();
                }
            },

            setSfxEnabled: (enabled) => {
                set({ sfxEnabled: enabled });
            },

            playMusic: (track) => {
                const state = get();
                if (!state.musicEnabled) return;

                initAudioContext();

                const trackPath = MUSIC_TRACKS[track];
                if (!trackPath) return;

                // If same track is already playing, do nothing
                if (state.currentTrack === track && state.isPlaying) return;

                // Stop current music with fade out
                if (musicElement) {
                    const currentVolume = musicElement.volume;
                    const fadeOut = setInterval(() => {
                        if (musicElement && musicElement.volume > 0.1) {
                            musicElement.volume -= 0.1;
                        } else {
                            clearInterval(fadeOut);
                            if (musicElement) {
                                musicElement.pause();
                                musicElement.currentTime = 0;
                            }
                        }
                    }, 50);
                }

                // Create new audio element for new track
                setTimeout(() => {
                    musicElement = new Audio(trackPath);
                    musicElement.loop = true;
                    musicElement.volume = 0;

                    const targetVolume = state.isMuted ? 0 : state.musicVolume;

                    musicElement.play().then(() => {
                        // Fade in
                        const fadeIn = setInterval(() => {
                            if (musicElement && musicElement.volume < targetVolume - 0.1) {
                                musicElement.volume += 0.1;
                            } else {
                                clearInterval(fadeIn);
                                if (musicElement) {
                                    musicElement.volume = targetVolume;
                                }
                            }
                        }, 50);

                        set({ currentTrack: track, isPlaying: true });
                    }).catch((err) => {
                        console.warn('Music playback failed:', err);
                        // Often fails due to autoplay policy - will work after user interaction
                    });
                }, 500); // Wait for fade out
            },

            stopMusic: () => {
                if (musicElement) {
                    musicElement.pause();
                    musicElement.currentTime = 0;
                }
                set({ currentTrack: null, isPlaying: false });
            },

            pauseMusic: () => {
                if (musicElement) {
                    musicElement.pause();
                }
                set({ isPlaying: false });
            },

            resumeMusic: () => {
                const state = get();
                if (musicElement && state.currentTrack && state.musicEnabled) {
                    musicElement.play().catch(console.warn);
                    set({ isPlaying: true });
                }
            },

            playSfx: (sound) => {
                const state = get();
                if (!state.sfxEnabled || state.isMuted) return;

                initAudioContext();

                const soundPath = SFX[sound];
                if (!soundPath) return;

                // Try to use preloaded audio, or create new
                let audio = sfxElements.get(sound);
                if (audio) {
                    // Clone for overlapping sounds
                    audio = audio.cloneNode(true) as HTMLAudioElement;
                } else {
                    audio = new Audio(soundPath);
                    // Preload for next time
                    preloadSfx(sound, soundPath);
                }

                audio.volume = state.sfxVolume;
                audio.play().catch(() => {
                    // Ignore autoplay errors for SFX
                });
            },
        }),
        {
            name: 'timestories-audio',
            // Only persist settings, not playback state
            partialize: (state) => ({
                musicVolume: state.musicVolume,
                sfxVolume: state.sfxVolume,
                isMuted: state.isMuted,
                musicEnabled: state.musicEnabled,
                sfxEnabled: state.sfxEnabled,
            }),
        }
    )
);

// Convenience functions
export const playMusic = (track: MusicTrack) => useAudioStore.getState().playMusic(track);
export const stopMusic = () => useAudioStore.getState().stopMusic();
export const playSfx = (sound: SoundEffect) => useAudioStore.getState().playSfx(sound);

// Sound effect shortcuts
export const sfx = {
    click: () => playSfx('buttonClick'),
    hover: () => playSfx('buttonHover'),
    coin: () => playSfx('coinEarned'),
    coins: () => playSfx('coinsMany'),
    reward: () => playSfx('rewardClaim'),
    achievement: () => playSfx('achievementUnlock'),
    trophy: () => playSfx('trophyUnlock'),
    success: () => playSfx('minigameSuccess'),
    fail: () => playSfx('minigameFail'),
    correct: () => playSfx('correctAnswer'),
    wrong: () => playSfx('wrongAnswer'),
    upgrade: () => playSfx('upgrade'),
    prestige: () => playSfx('prestige'),
    pageFlip: () => playSfx('pageFlip'),
};

// Initialize on load
if (typeof window !== 'undefined') {
    // Preload common sounds after a short delay
    setTimeout(preloadCommonSfx, 1000);

    // Handle visibility change (pause/resume music)
    document.addEventListener('visibilitychange', () => {
        const store = useAudioStore.getState();
        if (document.hidden) {
            store.pauseMusic();
        } else {
            store.resumeMusic();
        }
    });
}

// Map story IDs to music tracks
export const getStoryMusicTrack = (storyId: string): MusicTrack => {
    switch (storyId) {
        case 'story-1':
            return 'apollo';
        case 'story-2':
            return 'alchemist';
        case 'story-3':
            return 'archimedes';
        default:
            return 'menu';
    }
};
