
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect } from 'react';
import { Volume2Icon, VolumeXIcon } from './icons';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // "Good Morning" - Cheerful, ambient, market-appropriate track from Pixabay
  const audioUrl = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"; 

  const togglePlay = () => {
    setHasInteracted(true);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Audio play failed:", error);
            });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = 0.3; // Set gentle ambient volume
    }
  }, []);

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col items-end gap-2 pointer-events-auto">
       <audio ref={audioRef} src={audioUrl} loop />
       
       {/* Helper tooltip to encourage playback since autoplay is blocked by browsers */}
       {!hasInteracted && !isPlaying && (
           <div className="bg-white text-black text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-lg animate-bounce mb-1 border border-gray-200">
               🎵 Play Market Music
           </div>
       )}

       <button 
         onClick={togglePlay}
         className={`flex items-center justify-center w-11 h-11 rounded-full shadow-xl border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 ${
             isPlaying 
             ? 'bg-indigo-600 text-white shadow-indigo-500/50 ring-2 ring-indigo-400 ring-offset-2 ring-offset-black' 
             : 'bg-white/90 text-gray-800 hover:bg-white shadow-lg'
         }`}
         title={isPlaying ? "Mute Market Sound" : "Play Market Sound"}
         aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
       >
         {isPlaying ? (
             <Volume2Icon className="w-5 h-5 animate-pulse" />
         ) : (
             <VolumeXIcon className="w-5 h-5 opacity-60" />
         )}
       </button>
    </div>
  );
};

export default BackgroundMusic;
