'use client';

import React from 'react';
import { useAudioStore } from '@/lib/audio';
import { Volume2, VolumeX, Music, Disc3 } from 'lucide-react';
import { Slider } from '@/components/ui/Slider';

interface AudioSettingsProps {
    compact?: boolean;
}

export const AudioSettings: React.FC<AudioSettingsProps> = ({ compact = false }) => {
    const {
        musicVolume,
        sfxVolume,
        isMuted,
        musicEnabled,
        sfxEnabled,
        setMusicVolume,
        setSfxVolume,
        setMuted,
        setMusicEnabled,
        setSfxEnabled,
    } = useAudioStore();

    if (compact) {
        // Compact version - just a mute toggle
        return (
            <button
                onClick={() => setMuted(!isMuted)}
                className={`
                    p-2 rounded-lg transition-colors
                    ${isMuted
                        ? 'bg-slate-800 text-slate-500'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                    }
                `}
                title={isMuted ? 'Unmute' : 'Mute'}
            >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
        );
    }

    return (
        <div className="space-y-6">
            {/* Master Mute */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isMuted ? (
                        <VolumeX className="w-5 h-5 text-slate-500" />
                    ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                    )}
                    <span className="text-white font-medium">Sound</span>
                </div>
                <button
                    onClick={() => setMuted(!isMuted)}
                    className={`
                        px-4 py-2 rounded-lg font-medium transition-colors
                        ${isMuted
                            ? 'bg-slate-700 text-slate-400'
                            : 'bg-green-600 text-white'
                        }
                    `}
                >
                    {isMuted ? 'OFF' : 'ON'}
                </button>
            </div>

            {/* Music Settings */}
            <div className={`space-y-3 ${isMuted ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-300">Music</span>
                    </div>
                    <button
                        onClick={() => setMusicEnabled(!musicEnabled)}
                        className={`
                            px-3 py-1 rounded text-sm font-medium transition-colors
                            ${musicEnabled
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-700 text-slate-400'
                            }
                        `}
                    >
                        {musicEnabled ? 'ON' : 'OFF'}
                    </button>
                </div>

                {musicEnabled && (
                    <div className="flex items-center gap-3">
                        <VolumeX className="w-4 h-4 text-slate-500" />
                        <Slider
                            value={[musicVolume * 100]}
                            onValueChange={(v) => setMusicVolume(v[0] / 100)}
                            max={100}
                            step={10}
                            className="flex-1"
                        />
                        <Volume2 className="w-4 h-4 text-slate-500" />
                    </div>
                )}
            </div>

            {/* SFX Settings */}
            <div className={`space-y-3 ${isMuted ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Disc3 className="w-4 h-4 text-cyan-400" />
                        <span className="text-slate-300">Sound Effects</span>
                    </div>
                    <button
                        onClick={() => setSfxEnabled(!sfxEnabled)}
                        className={`
                            px-3 py-1 rounded text-sm font-medium transition-colors
                            ${sfxEnabled
                                ? 'bg-cyan-600 text-white'
                                : 'bg-slate-700 text-slate-400'
                            }
                        `}
                    >
                        {sfxEnabled ? 'ON' : 'OFF'}
                    </button>
                </div>

                {sfxEnabled && (
                    <div className="flex items-center gap-3">
                        <VolumeX className="w-4 h-4 text-slate-500" />
                        <Slider
                            value={[sfxVolume * 100]}
                            onValueChange={(v) => setSfxVolume(v[0] / 100)}
                            max={100}
                            step={10}
                            className="flex-1"
                        />
                        <Volume2 className="w-4 h-4 text-slate-500" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioSettings;
