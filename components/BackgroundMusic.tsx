
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect } from 'react';
import { Volume2Icon, VolumeXIcon } from './icons';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Using a royalty-free cheerful/ambient track suitable for a market vibe
  const audioUrl = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"; 

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    // Optional: Attempt autoplay with muted if needed, but for now we rely on user interaction
    // to comply with browser policies.
    if (audioRef.current) {
        audioRef.current.volume = 0.4; // Set volume to a comfortable level
    }
  }, []);

  return (
    <div className="fixed bottom-20 right-4 z-[60]">
       <audio ref={audioRef} src={audioUrl} loop />
       <button 
         onClick={togglePlay}
         className="flex items-center justify-center w-12 h-12 rounded-full glass-panel shadow-lg hover:scale-105 transition-transform bg-white/80 text-gray-800"
         title={isPlaying ? "Mute Market Sound" : "Play Market Sound"}
         aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
       >
         {isPlaying ? <Volume2Icon className="w-6 h-6" /> : <VolumeXIcon className="w-6 h-6" />}
       </button>
       {!isPlaying && (
           <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs font-bold py-1 px-2 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none group-hover:opacity-100">
               Play Music
           </div>
       )}
    </div>
  );
};

export default BackgroundMusic;
