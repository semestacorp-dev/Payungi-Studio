
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { UploadCloudIcon, CameraIcon, UserIcon, UsersIcon, HeartIcon } from './icons';
import { generateModelImage, GenerationMode } from '../services/geminiService';
import Spinner from './Spinner';
import CameraModal from './CameraModal';
import { playSound } from '../lib/soundEffects';

interface StartScreenProps {
  onModelFinalized: (modelUrl: string) => void;
}

const contentVariants: Variants = {
    initial: { opacity: 0, scale: 0.98, filter: 'blur(5px)' },
    animate: { 
        opacity: 1, 
        scale: 1, 
        filter: 'blur(0px)',
        transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } 
    },
    exit: { 
        opacity: 0, 
        scale: 1.02, 
        filter: 'blur(5px)',
        transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] } 
    }
};

const StartScreen: React.FC<StartScreenProps> = ({ onModelFinalized }) => {
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('Family');

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError('Format file salah nih.');
        return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setUserImageUrl(dataUrl);
        setIsGenerating(true);
        setGeneratedModelUrl(null);
        setError(null);
        playSound('click');
        try {
            const result = await generateModelImage(file, generationMode);
            setGeneratedModelUrl(result);
            playSound('success');
        } catch (err) {
            setError('Gagal bikin model. Coba foto lain ya.');
            setUserImageUrl(null);
            playSound('error');
        } finally {
            setIsGenerating(false);
        }
    };
    reader.readAsDataURL(file);
  }, [generationMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const reset = () => {
    playSound('click');
    setUserImageUrl(null);
    setGeneratedModelUrl(null);
    setIsGenerating(false);
    setError(null);
  };

  const handleSetMode = (mode: GenerationMode) => {
      playSound('click');
      setGenerationMode(mode);
  }

  const renderModeButton = (mode: GenerationMode, label: string, sub: string) => (
    <button
        onClick={() => handleSetMode(mode)}
        className={`flex flex-col items-start justify-between p-4 border border-black transition-all h-full ${
            generationMode === mode 
            ? 'bg-black text-white' 
            : 'bg-transparent text-black hover:bg-black/5'
        }`}
    >
        <span className="font-sans text-[10px] uppercase tracking-widest opacity-60">{sub}</span>
        <span className="font-editorial text-2xl italic">{label}</span>
    </button>
  );

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar bg-[#f4f4f4] text-black">
      <AnimatePresence mode="wait">
        {!userImageUrl ? (
          <motion.div
            key="cover"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12 relative"
          >
             {/* Decorative Lines */}
             <div className="absolute top-0 left-0 w-full h-4 bg-black"></div>
             <div className="absolute bottom-0 left-0 w-full h-4 bg-black"></div>
             <div className="absolute left-0 top-0 h-full w-4 bg-black hidden md:block"></div>
             <div className="absolute right-0 top-0 h-full w-4 bg-black hidden md:block"></div>

             <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 z-10">
                 
                 {/* Left: Headlines */}
                 <div className="md:col-span-7 flex flex-col justify-center">
                     <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                     >
                        <h1 className="type-masthead text-[5rem] md:text-[8rem] leading-[0.8] mb-4">
                            PAYUNGI<br/>
                            <span className="italic font-light">STUDIO</span>
                        </h1>
                        <div className="w-32 h-2 bg-red-600 mb-8"></div>
                     </motion.div>

                     <p className="font-sans text-sm max-w-md font-medium leading-relaxed mb-10 border-l-2 border-black pl-4">
                        Studio fashion AI paling hits di Pasar Yosomulyo Pelangi. Coba gaya baru, mix & match sesuka hati, dan temukan versi paling kece dari dirimu!
                     </p>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-black w-full max-w-xl">
                        {renderModeButton('Personal', 'Sendirian', 'SOLO')}
                        {renderModeButton('Jomblo', 'Halu Pacar', 'DUO')}
                        {renderModeButton('Couple', 'Couple-an', 'LOVE')}
                        {renderModeButton('Family', 'Sekeluarga', 'CLAN')}
                     </div>
                 </div>

                 {/* Right: Call to Action */}
                 <div className="md:col-span-5 flex flex-col justify-center gap-6">
                     <div className="bg-white border border-black p-1 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="bg-gray-100 aspect-[3/4] flex flex-col items-center justify-center relative overflow-hidden group border border-black/10">
                            {/* Magazine Cover Image Placeholder */}
                            <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Cover" />
                            
                            <div className="relative z-10 bg-white p-6 text-center border border-black">
                                <h3 className="type-subhead text-black mb-4">MULAI SESI</h3>
                                <div className="flex gap-2">
                                    <label onClick={() => playSound('click')} className="btn-editorial cursor-pointer flex-grow text-center flex items-center justify-center">
                                        UPLOAD FOTO
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                    <button onClick={() => { playSound('click'); setIsCameraOpen(true); }} className="w-12 bg-black text-white flex items-center justify-center border border-black hover:bg-white hover:text-black transition-colors" title="Ambil Foto">
                                        <CameraIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>
             </div>
             
             <AnimatePresence>
                {isCameraOpen && (
                    <CameraModal 
                        onCapture={handleFileSelect} 
                        onClose={() => setIsCameraOpen(false)} 
                    />
                )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
             key="processing"
             variants={contentVariants}
             initial="initial"
             animate="animate"
             exit="exit"
             className="w-full h-full flex flex-col items-center justify-center bg-white"
          >
             <div className="w-full max-w-5xl p-8 flex flex-col md:flex-row gap-12 items-center">
                 
                 <div className="flex-1 w-full flex gap-4 md:gap-8 justify-center items-center">
                     <div className="relative w-full max-w-[300px] aspect-[3/4] bg-gray-100 border border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                         <img src={userImageUrl} className="w-full h-full object-cover grayscale" alt="Source" />
                         <div className="absolute bottom-4 left-4 bg-black text-white px-2 py-1 text-[10px] font-bold uppercase">ASLI</div>
                     </div>
                     
                     <div className="font-serif italic text-2xl text-black">vs</div>

                     <div className="relative w-full max-w-[300px] aspect-[3/4] bg-white border border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                         {generatedModelUrl ? (
                             <>
                                <img src={generatedModelUrl} className="w-full h-full object-cover" alt="Generated" />
                                <div className="absolute bottom-4 left-4 bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase">VERSI KECE</div>
                             </>
                         ) : (
                             <div className="flex flex-col items-center gap-4">
                                 <Spinner />
                                 <span className="type-subhead text-black animate-pulse">LAGI MIKIR...</span>
                             </div>
                         )}
                     </div>
                 </div>

                 <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
                     <div className="border-b-2 border-black pb-4">
                         <h3 className="type-headline text-3xl">LAGI DIPROSES</h3>
                         <p className="font-sans text-xs mt-2">Sabar ya, lagi dandanin avatar digital kamu biar makin keren.</p>
                     </div>
                     
                     {error && (
                         <div className="p-4 bg-red-50 text-red-600 border border-red-200 text-xs font-bold">
                             UPS ERROR: {error}
                         </div>
                     )}

                     <div className="flex flex-col gap-3 mt-auto">
                         {generatedModelUrl ? (
                             <>
                                <button onClick={() => onModelFinalized(generatedModelUrl!)} className="btn-editorial w-full">
                                    MASUK STUDIO
                                </button>
                                <button onClick={reset} className="btn-editorial-outline w-full">
                                    ULANGI
                                </button>
                             </>
                         ) : (
                             <button onClick={reset} className="btn-editorial-outline w-full opacity-50 cursor-not-allowed">
                                 BATAL
                             </button>
                         )}
                     </div>
                 </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StartScreen;
