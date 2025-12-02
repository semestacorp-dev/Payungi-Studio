
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcwIcon, ChevronLeftIcon, ChevronRightIcon, ImageIcon, PaletteIcon, LightbulbIcon, XIcon, UploadCloudIcon } from './icons';
import Spinner from './Spinner';
import { AnimatePresence, motion } from 'framer-motion';
import { playSound } from '../lib/soundEffects';

interface CanvasProps {
  displayImageUrl: string | null;
  onStartOver: () => void;
  isLoading: boolean;
  loadingMessage: string;
  onSelectPose: (index: number) => void;
  onCustomPoseSelect: (file: File) => void;
  poseInstructions: string[];
  currentPoseIndex: number;
  availablePoseKeys: string[];
}

const STUDIO_COLORS = [
    { name: 'Dark Grey', value: '#1a1a1a', type: 'color' },
    { name: 'Pure White', value: '#f0f0f0', type: 'color' },
    { name: 'Warm Beige', value: '#d4c4b7', type: 'color' },
    { name: 'Cool Blue', value: '#3b82f6', type: 'color' },
    { name: 'Chroma Green', value: '#00b140', type: 'color' },
    { name: 'Deep Purple', value: '#2e1065', type: 'color' },
];

const LIGHTING_EFFECTS = [
    { name: 'Standard', css: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.4) 100%)' },
    { name: 'Spotlight', css: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
    { name: 'Softbox', css: 'linear-gradient(120deg, rgba(255,255,255,0.15) 0%, transparent 100%)' },
    { name: 'Rim Light', css: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(255,255,255,0.1) 100%)' },
    { name: 'Dual Tone', css: 'linear-gradient(90deg, rgba(255,0,150,0.1) 0%, rgba(0,204,255,0.1) 100%)' },
    { name: 'Blinds', css: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 20px, transparent 20px, transparent 40px)' },
];

const Canvas: React.FC<CanvasProps> = ({ displayImageUrl, onStartOver, isLoading, loadingMessage, onSelectPose, onCustomPoseSelect, poseInstructions, currentPoseIndex, availablePoseKeys }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [studioColor, setStudioColor] = useState(STUDIO_COLORS[0]);
  const [lightingEffect, setLightingEffect] = useState(LIGHTING_EFFECTS[0]);
  const [showStudioControls, setShowStudioControls] = useState(false);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  
  const handlePreviousPose = () => {
    // ... (logic reused)
     if (isLoading || availablePoseKeys.length <= 1) return;
    const currentPoseInstruction = poseInstructions[currentPoseIndex];
    const currentIndexInAvailable = availablePoseKeys.indexOf(currentPoseInstruction);
    if (currentIndexInAvailable === -1) {
        onSelectPose((currentPoseIndex - 1 + poseInstructions.length) % poseInstructions.length);
        return;
    }
    const prevIndexInAvailable = (currentIndexInAvailable - 1 + availablePoseKeys.length) % availablePoseKeys.length;
    const prevPoseInstruction = availablePoseKeys[prevIndexInAvailable];
    const newGlobalPoseIndex = poseInstructions.indexOf(prevPoseInstruction);
    if (newGlobalPoseIndex !== -1) {
        onSelectPose(newGlobalPoseIndex);
    }
  };

  const handleNextPose = () => {
    // ... (logic reused)
    if (isLoading) return;
    const currentPoseInstruction = poseInstructions[currentPoseIndex];
    const currentIndexInAvailable = availablePoseKeys.indexOf(currentPoseInstruction);
    if (currentIndexInAvailable === -1 || availablePoseKeys.length === 0) {
        onSelectPose((currentPoseIndex + 1) % poseInstructions.length);
        return;
    }
    const nextIndexInAvailable = currentIndexInAvailable + 1;
    if (nextIndexInAvailable < availablePoseKeys.length) {
        const nextPoseInstruction = availablePoseKeys[nextIndexInAvailable];
        const newGlobalPoseIndex = poseInstructions.indexOf(nextPoseInstruction);
        if (newGlobalPoseIndex !== -1) {
            onSelectPose(newGlobalPoseIndex);
        }
    } else {
        const newGlobalPoseIndex = (currentPoseIndex + 1) % poseInstructions.length;
        onSelectPose(newGlobalPoseIndex);
    }
  };

  const handleCustomPoseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCustomPoseSelect(e.target.files[0]);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        playSound('click');
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        setCustomBackground(url);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!displayImageUrl || isLoading) return;
        if (e.key === 'ArrowLeft') {
            handlePreviousPose();
        } else if (e.key === 'ArrowRight') {
            handleNextPose();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayImageUrl, isLoading, handlePreviousPose, handleNextPose]);
  
  return (
    <div 
        ref={canvasRef}
        className="w-full h-full flex flex-col relative outline-none overflow-hidden rounded-xl border border-vendor-border select-none"
        tabIndex={0}
    >
        {/* ========================================================= */}
        {/* STUDIO BACKGROUND LAYERS */}
        {/* ========================================================= */}
        <div className="absolute inset-0 z-0 transition-colors duration-700 ease-in-out" style={{ backgroundColor: studioColor.value }}>
            {/* Custom Background Image */}
            <AnimatePresence>
                {customBackground && (
                     <motion.img 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        src={customBackground} 
                        alt="Custom Backdrop" 
                        className="absolute inset-0 w-full h-full object-cover z-0" 
                    />
                )}
            </AnimatePresence>

            {/* 1. Vignette / Floor Horizon simulation */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none z-0" />
            
            {/* 2. Noise Texture for Realism */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay z-0"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
            />

            {/* 3. Dynamic Lighting Layer */}
            <div 
                className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out mix-blend-screen z-0"
                style={{ background: lightingEffect.css }}
            />
        </div>

        {/* Top Viewport Controls */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
             <button 
                onClick={onStartOver}
                className="dashboard-btn dashboard-btn-secondary text-xs py-1.5 px-3 bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-md hover:bg-black/70 transition-colors"
                title="Mulai Sesi Baru"
            >
                <RotateCcwIcon className="w-3 h-3 inline-block mr-2" />
                <span>Ulang</span>
            </button>
        </div>

        <div className="absolute top-4 right-4 z-20">
             {displayImageUrl && !isLoading && (
                <label className="dashboard-btn dashboard-btn-primary text-xs py-1.5 px-3 cursor-pointer bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-md flex items-center gap-2 hover:bg-black/80 transition-colors shadow-lg">
                    <ImageIcon className="w-3 h-3" />
                    <span>Tiru Gaya Foto</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCustomPoseFileChange} />
                </label>
            )}
        </div>

        {/* Main Viewport */}
        <div className="flex-grow flex items-center justify-center relative z-10">
            {displayImageUrl ? (
            <motion.img
                key={displayImageUrl}
                src={displayImageUrl}
                alt="Studio Viewport"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-full max-h-[calc(100%-80px)] object-contain shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10"
                draggable={false}
            />
            ) : (
                <div className="flex flex-col items-center text-white/50">
                    <Spinner />
                    <p className="mt-4 text-sm font-mono tracking-widest uppercase">Menyiapkan Studio...</p>
                </div>
            )}
        </div>

        {/* Bottom Floating Controls (Pose Navigation) */}
        {displayImageUrl && !isLoading && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                <div className="flex items-center bg-black/60 backdrop-blur-md rounded-full border border-white/10 p-1 shadow-lg">
                    <button 
                        onClick={handlePreviousPose}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    
                    <div className="px-4 min-w-[120px] text-center">
                        <span className="text-xs font-medium text-white tracking-wide uppercase">
                            {poseInstructions[currentPoseIndex]}
                        </span>
                    </div>

                    <button 
                        onClick={handleNextPose}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        )}

        {/* Studio Controls Toggle (Bottom Right) */}
        {displayImageUrl && !isLoading && (
            <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2">
                <AnimatePresence>
                    {showStudioControls && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl mb-2 w-64 origin-bottom-right"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/80">Studio Control</h3>
                                <button onClick={() => { playSound('click'); setShowStudioControls(false); }}>
                                    <XIcon className="w-4 h-4 text-white/50 hover:text-white" />
                                </button>
                            </div>
                            
                            {/* Backdrop Colors */}
                            <div className="mb-4">
                                <span className="text-[9px] uppercase text-white/40 mb-2 block font-bold">Backdrop</span>
                                <div className="flex gap-2 flex-wrap items-center">
                                    {STUDIO_COLORS.map(c => (
                                        <button 
                                            key={c.name}
                                            onClick={() => { 
                                                playSound('click'); 
                                                setStudioColor(c); 
                                                setCustomBackground(null); // Clear custom bg
                                            }}
                                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${studioColor.name === c.name && !customBackground ? 'border-white scale-110 shadow-glow' : 'border-transparent opacity-70'}`}
                                            style={{ backgroundColor: c.value }}
                                            title={c.name}
                                        />
                                    ))}
                                    <div className="w-px h-6 bg-white/10 mx-1"></div>
                                    <label className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${customBackground ? 'border-white bg-white/20 scale-110 shadow-glow' : 'border-white/30 bg-white/10 hover:border-white'}`} title="Upload Custom Background">
                                        <UploadCloudIcon className="w-3 h-3 text-white" />
                                        <input type="file" accept="image/*" className="hidden" onChange={handleBackgroundUpload} />
                                    </label>
                                </div>
                            </div>

                            {/* Lighting Effects */}
                            <div>
                                <span className="text-[9px] uppercase text-white/40 mb-2 block font-bold">Lighting</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {LIGHTING_EFFECTS.map(l => (
                                        <button 
                                            key={l.name}
                                            onClick={() => { playSound('click'); setLightingEffect(l); }}
                                            className={`px-2 py-1.5 text-[9px] uppercase font-bold text-center rounded-lg border transition-all ${
                                                lightingEffect.name === l.name 
                                                ? 'bg-white text-black border-white' 
                                                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                                            }`}
                                        >
                                            {l.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button 
                    onClick={() => { playSound('click'); setShowStudioControls(!showStudioControls); }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ${
                        showStudioControls 
                        ? 'bg-white text-black border-white rotate-45' 
                        : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                    }`}
                    title="Studio Settings"
                >
                    {showStudioControls ? <XIcon className="w-5 h-5" /> : <PaletteIcon className="w-5 h-5" />}
                </button>
            </div>
        )}

        {/* Loading Overlay */}
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40 flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="bg-vendor-panel border border-vendor-border p-6 rounded-xl shadow-2xl flex flex-col items-center">
                        <Spinner />
                        <p className="mt-4 text-sm font-medium text-white">{loadingMessage}</p>
                        <p className="text-xs text-vendor-text-muted mt-1">AI lagi kerja, tunggu bentar ya...</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default Canvas;
