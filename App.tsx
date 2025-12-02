
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import StartScreen from './components/StartScreen';
import Canvas from './components/Canvas';
import WardrobePanel from './components/WardrobePanel';
import OutfitStack from './components/OutfitStack';
import LookbookModal from './components/LookbookModal';
import ItemDetailsModal from './components/ItemDetailsModal';
import { generateVirtualTryOnImage, generatePoseVariation, generatePoseFromReference, generateGarmentColorway } from './services/geminiService';
import { OutfitLayer, WardrobeItem } from './types';
import { defaultWardrobe } from './wardrobe';
import Footer from './components/Footer';
import Header from './components/Header';
import { getFriendlyErrorMessage, urlToFile } from './lib/utils';
import PayungiBackground from './components/PayungiBackground';
import BackgroundMusic from './components/BackgroundMusic';
import { HomeIcon, LayoutGridIcon, LayersIcon, SettingsIcon, UserIcon, RotateCcwIcon } from './components/icons';
import { playSound } from './lib/soundEffects';

const INITIAL_POSE_INSTRUCTIONS = [
  "Idle Stance",
  "Profile View",
  "Walking",
  "Seated",
  "Crossed Arms",
  "Rear View",
  "Action Pose",
];

const screenTransition: Variants = {
  initial: { 
    opacity: 0, 
    x: 40, 
    scale: 0.96, 
    filter: 'blur(8px)' 
  },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { 
      duration: 0.6, 
      ease: [0.2, 0.8, 0.2, 1] // Custom refined cubic-bezier
    } 
  },
  exit: { 
    opacity: 0, 
    x: -40, 
    scale: 1.02, 
    filter: 'blur(8px)',
    transition: { 
      duration: 0.4, 
      ease: [0.2, 0.8, 0.2, 1] 
    } 
  }
};

const App: React.FC = () => {
  const [modelImageUrl, setModelImageUrl] = useState<string | null>(null);
  const [outfitHistory, setOutfitHistory] = useState<OutfitLayer[]>([]);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [poseInstructions, setPoseInstructions] = useState(INITIAL_POSE_INSTRUCTIONS);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(defaultWardrobe);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<WardrobeItem | null>(null);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'studio' | 'layer' | 'settings'>('studio');

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Theme Side Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    playSound('click');
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const activeOutfitLayers = useMemo(() => 
    outfitHistory.slice(0, currentOutfitIndex + 1), 
    [outfitHistory, currentOutfitIndex]
  );
  
  const activeGarmentIds = useMemo(() => 
    activeOutfitLayers.map(layer => layer.garment?.id).filter(Boolean) as string[], 
    [activeOutfitLayers]
  );
  
  const displayImageUrl = useMemo(() => {
    if (outfitHistory.length === 0) return modelImageUrl;
    const currentLayer = outfitHistory[currentOutfitIndex];
    if (!currentLayer) return modelImageUrl;

    const poseInstruction = poseInstructions[currentPoseIndex];
    return currentLayer.poseImages[poseInstruction] ?? Object.values(currentLayer.poseImages)[0];
  }, [outfitHistory, currentOutfitIndex, currentPoseIndex, modelImageUrl, poseInstructions]);

  const availablePoseKeys = useMemo(() => {
    if (outfitHistory.length === 0) return [];
    const currentLayer = outfitHistory[currentOutfitIndex];
    return currentLayer ? Object.keys(currentLayer.poseImages) : [];
  }, [outfitHistory, currentOutfitIndex]);

  const currentOutfitItems = useMemo(() => {
      return activeOutfitLayers.map(layer => layer.garment).filter(Boolean) as WardrobeItem[];
  }, [activeOutfitLayers]);

  // Undo/Redo State
  const canUndo = currentOutfitIndex > 0;
  const canRedo = currentOutfitIndex < outfitHistory.length - 1;

  const handleUndo = useCallback(() => {
      if (canUndo) {
          playSound('click');
          setCurrentOutfitIndex(prev => prev - 1);
          // Optional: reset pose index or keep it. Keeping it might be smoother if available.
          // For now, let's keep it but handle missing poses in `displayImageUrl` (which we do).
      }
  }, [canUndo]);

  const handleRedo = useCallback(() => {
      if (canRedo) {
          playSound('click');
          setCurrentOutfitIndex(prev => prev + 1);
      }
  }, [canRedo]);


  const handleModelFinalized = (url: string) => {
    playSound('success');
    setModelImageUrl(url);
    setOutfitHistory([{
      garment: null,
      poseImages: { [INITIAL_POSE_INSTRUCTIONS[0]]: url }
    }]);
    setCurrentOutfitIndex(0);
    setActiveTab('studio');
  };

  const handleStartOver = () => {
    playSound('click');
    setModelImageUrl(null);
    setOutfitHistory([]);
    setCurrentOutfitIndex(0);
    setIsLoading(false);
    setLoadingMessage('');
    setError(null);
    setCurrentPoseIndex(0);
    setPoseInstructions(INITIAL_POSE_INSTRUCTIONS);
    setWardrobe(defaultWardrobe);
    setActiveTab('studio');
  };

  const handleGarmentSelect = useCallback(async (garmentFile: File, garmentInfo: WardrobeItem) => {
    if (!displayImageUrl || isLoading) return;
    const nextLayer = outfitHistory[currentOutfitIndex + 1];
    if (nextLayer && nextLayer.garment?.id === garmentInfo.id) {
        setCurrentOutfitIndex(prev => prev + 1);
        setCurrentPoseIndex(0); 
        return;
    }
    setError(null);
    setIsLoading(true);
    setLoadingMessage(`Lagi makein ${garmentInfo.name}`);
    playSound('click');

    try {
      const newImageUrl = await generateVirtualTryOnImage(displayImageUrl, garmentFile, garmentInfo.category);
      const currentPoseInstruction = poseInstructions[currentPoseIndex];
      const newLayer: OutfitLayer = { 
        garment: garmentInfo, 
        poseImages: { [currentPoseInstruction]: newImageUrl } 
      };
      setOutfitHistory(prevHistory => {
        const newHistory = prevHistory.slice(0, currentOutfitIndex + 1);
        return [...newHistory, newLayer];
      });
      setCurrentOutfitIndex(prev => prev + 1);
      setWardrobe(prev => {
        if (prev.find(item => item.id === garmentInfo.id)) return prev;
        return [...prev, garmentInfo];
      });
      playSound('success');
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err, 'Gagal Make Baju'));
      playSound('error');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [displayImageUrl, isLoading, currentPoseIndex, outfitHistory, currentOutfitIndex, poseInstructions]);

  const handleRecolorGarment = useCallback(async (item: WardrobeItem, color: string) => {
      if (isLoading) return;
      setError(null);
      setIsLoading(true);
      setLoadingMessage(`Lagi warnain jadi ${color}`);
      try {
          const newGarmentUrl = await generateGarmentColorway(item.url, color);
          const newItem: WardrobeItem = {
              ...item,
              id: `${item.id}-${color.toLowerCase()}-${Date.now()}`,
              name: `${item.name} (${color})`,
              url: newGarmentUrl,
          };
          setWardrobe(prev => [newItem, ...prev]);
          const file = await urlToFile(newGarmentUrl, newItem.name);
          await handleGarmentSelect(file, newItem);
          playSound('success');
      } catch (err: any) {
           setError(getFriendlyErrorMessage(err, 'Gagal Ganti Warna'));
           setIsLoading(false); 
           setLoadingMessage('');
           playSound('error');
      }
  }, [isLoading, handleGarmentSelect]);

  const handleRemoveLastGarment = () => {
    playSound('click');
    if (currentOutfitIndex > 0) {
      setCurrentOutfitIndex(prevIndex => prevIndex - 1);
      setCurrentPoseIndex(0); 
    }
  };
  
  const handlePoseSelect = useCallback(async (newIndex: number) => {
    if (isLoading || outfitHistory.length === 0 || newIndex === currentPoseIndex) return;
    playSound('click');
    const poseInstruction = poseInstructions[newIndex];
    const currentLayer = outfitHistory[currentOutfitIndex];

    if (currentLayer.poseImages[poseInstruction]) {
      setCurrentPoseIndex(newIndex);
      return;
    }
    const baseImageForPoseChange = Object.values(currentLayer.poseImages)[0];
    if (!baseImageForPoseChange) return;

    setError(null);
    setIsLoading(true);
    setLoadingMessage(`Lagi atur pose ${poseInstruction}`);
    const prevPoseIndex = currentPoseIndex;
    setCurrentPoseIndex(newIndex);

    try {
      const newImageUrl = await generatePoseVariation(baseImageForPoseChange, poseInstruction);
      setOutfitHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const updatedLayer = newHistory[currentOutfitIndex];
        updatedLayer.poseImages[poseInstruction] = newImageUrl;
        return newHistory;
      });
      playSound('success');
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err, 'Gagal Ganti Pose'));
      setCurrentPoseIndex(prevPoseIndex);
      playSound('error');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [currentPoseIndex, outfitHistory, isLoading, currentOutfitIndex, poseInstructions]);

  const handleCustomPoseSelect = useCallback(async (file: File) => {
    if (isLoading || outfitHistory.length === 0) return;
    playSound('click');
    const currentLayer = outfitHistory[currentOutfitIndex];
    const baseImageForPoseChange = Object.values(currentLayer.poseImages)[0];
    if (!baseImageForPoseChange) return;
    setError(null);
    setIsLoading(true);
    setLoadingMessage('Lagi niru gaya foto...');
    const prevPoseIndex = currentPoseIndex;
    const newPoseName = `Custom Reference ${poseInstructions.length - INITIAL_POSE_INSTRUCTIONS.length + 1}`;
    try {
        const newImageUrl = await generatePoseFromReference(baseImageForPoseChange, file);
        setPoseInstructions(prev => [...prev, newPoseName]);
        const newIndex = poseInstructions.length; 
        setOutfitHistory(prevHistory => {
            const newHistory = [...prevHistory];
            const updatedLayer = newHistory[currentOutfitIndex];
            updatedLayer.poseImages[newPoseName] = newImageUrl;
            return newHistory;
        });
        setCurrentPoseIndex(newIndex);
        playSound('success');
    } catch (err: any) {
        setError(getFriendlyErrorMessage(err, 'Gagal Tiru Pose'));
        setCurrentPoseIndex(prevPoseIndex);
        playSound('error');
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [isLoading, outfitHistory, currentOutfitIndex, poseInstructions, currentPoseIndex]);

  const handleShareLink = async () => {
    playSound('click');
    if (activeOutfitLayers.length <= 1) { 
       alert('Belum ada outfit yang dipake nih.');
       return;
    }
    const garmentIds = activeOutfitLayers.map(layer => layer.garment?.id).filter(Boolean).join(',');
    const shareUrl = `${window.location.origin}${window.location.pathname}?outfit=${btoa(garmentIds)}`;
    const shareData = { title: 'Look Payungi Studio', text: 'Cek gaya kerenku!', url: shareUrl };
    if (navigator.share && navigator.canShare(shareData)) {
        try { await navigator.share(shareData); } catch (err) { console.error('Gagal share:', err); }
    } else {
        try { await navigator.clipboard.writeText(shareUrl); alert('Link udah dicopy.'); } catch (err) { alert('Gagal copy link.'); }
    }
  };

  // Kiosk Style Navigation Dock
  const SidebarDock = () => (
      <div className="flex flex-col items-center py-8 px-4 bg-white/90 dark:bg-black/90 backdrop-blur-md border-r border-white/20 dark:border-white/10 h-full w-[120px] shadow-2xl z-40 shrink-0 transition-colors duration-300">
            {/* Logo Area */}
            <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                <button 
                    onClick={handleStartOver}
                    className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-3xl shadow-glow cursor-pointer border border-white/10"
                    title="Reset Session"
                >
                    <span className="font-editorial font-bold text-4xl italic">P</span>
                </button>
            </div>
            
            {/* Navigation Items */}
            <div className="flex flex-col w-full gap-6">
                <SidebarItem 
                    icon={<HomeIcon />} 
                    label="HOME" 
                    active={!modelImageUrl} 
                    onClick={handleStartOver} 
                />
                
                {modelImageUrl && (
                    <>
                        <div className="w-full h-px bg-black/10 dark:bg-white/10 my-1"></div>
                        <SidebarItem 
                            icon={<LayoutGridIcon />} 
                            label="STUDIO" 
                            active={activeTab === 'studio'} 
                            onClick={() => { playSound('click'); setActiveTab('studio'); }} 
                        />
                        <SidebarItem 
                            icon={<LayersIcon />} 
                            label="LAYER" 
                            active={activeTab === 'layer'} 
                            onClick={() => { playSound('click'); setActiveTab('layer'); }} 
                        />
                    </>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-col gap-6 w-full pb-4">
                 <SidebarItem 
                    icon={<SettingsIcon />} 
                    label="SETUP" 
                    active={activeTab === 'settings'} 
                    onClick={() => { playSound('click'); setActiveTab('settings'); }} 
                />
            </div>
      </div>
  );

  const SidebarItem = ({ icon, label, active, onClick }: any) => (
      <button 
        onClick={onClick}
        className={`w-full aspect-square flex flex-col items-center justify-center gap-2 transition-all duration-200 rounded-3xl border-2 ${active ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xl scale-105' : 'bg-white/50 text-gray-500 border-transparent hover:bg-white hover:text-black hover:border-gray-200 hover:shadow-lg dark:bg-white/10 dark:text-gray-400 dark:hover:bg-white/20 dark:hover:text-white'}`}
        title={label}
      >
          {React.cloneElement(icon, { className: "w-8 h-8 stroke-[2]" })}
          <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
      </button>
  );

  return (
    <div className="flex h-screen bg-[#e5e5e5] dark:bg-[#0f0f0f] text-black dark:text-white font-sans overflow-hidden selection:bg-black selection:text-white p-4 gap-4 transition-colors duration-300">
        <PayungiBackground />
        <BackgroundMusic />

        {/* 1. Floating Kiosk Dock (Left) */}
        <nav className="flex-shrink-0 h-full relative z-20">
            <SidebarDock />
        </nav>

        {/* 2. Main Workspace */}
        <div className="flex-grow flex flex-col min-w-0 h-full gap-4 relative z-10">
            
            {/* Header */}
            <header className="h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm rounded-2xl flex-shrink-0 z-30 overflow-hidden px-4 transition-colors duration-300">
                <Header 
                    theme={theme} 
                    onToggleTheme={toggleTheme} 
                    onSettingsClick={() => { playSound('click'); setActiveTab('settings'); }}
                />
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex min-h-0 gap-4">
                <AnimatePresence mode="wait">
                    {!modelImageUrl ? (
                        <motion.div
                            key="start"
                            className="w-full h-full magazine-panel dark:magazine-panel-dark overflow-hidden rounded-[2rem]"
                            variants={screenTransition}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <StartScreen onModelFinalized={handleModelFinalized} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="editor"
                            className="w-full h-full flex gap-4"
                            variants={screenTransition}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {/* Canvas */}
                            <div className="flex-grow bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 shadow-xl rounded-[2rem] overflow-hidden relative flex flex-col transition-colors duration-300">
                                <div className="absolute top-0 left-0 bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-br-xl text-[10px] font-bold uppercase z-20 tracking-widest">
                                    VIEWPORT 01
                                </div>
                                <div className="flex-grow p-0">
                                    <Canvas 
                                        displayImageUrl={displayImageUrl}
                                        onStartOver={handleStartOver}
                                        isLoading={isLoading}
                                        loadingMessage={loadingMessage}
                                        onSelectPose={handlePoseSelect}
                                        onCustomPoseSelect={handleCustomPoseSelect}
                                        poseInstructions={poseInstructions}
                                        currentPoseIndex={currentPoseIndex}
                                        availablePoseKeys={availablePoseKeys}
                                    />
                                </div>
                            </div>

                            {/* Tools Panel (Right) - Dynamic Content Based on Tab */}
                            <aside className="w-[400px] flex flex-col gap-4 shrink-0 transition-all duration-300">
                                
                                {/* STUDIO VIEW: Split Layers + Wardrobe */}
                                {activeTab === 'studio' && (
                                    <>
                                        <div className="h-1/3 bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl rounded-[2rem] overflow-hidden flex flex-col">
                                            <div className="border-b border-gray-100 dark:border-gray-800 p-3 bg-white/50 dark:bg-white/5 backdrop-blur-md flex justify-between items-center">
                                                <h3 className="type-subhead text-gray-800 dark:text-gray-200">LIST OUTFIT</h3>
                                            </div>
                                            <div className="flex-grow p-2 overflow-hidden">
                                                <OutfitStack 
                                                    outfitHistory={activeOutfitLayers}
                                                    onRemoveLastGarment={handleRemoveLastGarment}
                                                    onAddGarment={() => {}}
                                                    onShare={() => { playSound('click'); setIsLookbookOpen(true); }}
                                                    onShareLink={handleShareLink}
                                                    onOpenDetails={(item) => { playSound('click'); setSelectedItemForDetails(item); }}
                                                    onUndo={handleUndo}
                                                    onRedo={handleRedo}
                                                    canUndo={canUndo}
                                                    canRedo={canRedo}
                                                />
                                            </div>
                                        </div>
                                        <div className="h-2/3 bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl rounded-[2rem] overflow-hidden flex flex-col">
                                            <WardrobePanel
                                                onGarmentSelect={handleGarmentSelect}
                                                activeGarmentIds={activeGarmentIds}
                                                isLoading={isLoading}
                                                wardrobe={wardrobe}
                                                onOpenDetails={(item) => { playSound('click'); setSelectedItemForDetails(item); }}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* LAYER VIEW: Full Height Layer Manager */}
                                {activeTab === 'layer' && (
                                    <div className="h-full bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl rounded-[2rem] overflow-hidden flex flex-col">
                                        <div className="border-b border-gray-100 dark:border-gray-800 p-4 bg-white/50 dark:bg-white/5 backdrop-blur-md flex justify-between items-center">
                                            <h3 className="type-subhead text-gray-800 dark:text-gray-200">LAYER EDITOR</h3>
                                            <span className="text-[10px] font-mono text-gray-500">{activeOutfitLayers.length} LAYERS</span>
                                        </div>
                                        <div className="flex-grow p-4 overflow-hidden">
                                            <OutfitStack 
                                                outfitHistory={activeOutfitLayers}
                                                onRemoveLastGarment={handleRemoveLastGarment}
                                                onAddGarment={() => { playSound('click'); setActiveTab('studio'); }} // Go back to studio to add
                                                onShare={() => { playSound('click'); setIsLookbookOpen(true); }}
                                                onShareLink={handleShareLink}
                                                onOpenDetails={(item) => { playSound('click'); setSelectedItemForDetails(item); }}
                                                onUndo={handleUndo}
                                                onRedo={handleRedo}
                                                canUndo={canUndo}
                                                canRedo={canRedo}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* SETTINGS VIEW: System Panel */}
                                {activeTab === 'settings' && (
                                     <div className="h-full bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl rounded-[2rem] overflow-hidden flex flex-col p-6 text-black dark:text-white">
                                        <h2 className="type-headline text-2xl mb-6">SYSTEM SETUP</h2>
                                        
                                        <div className="space-y-6">
                                            <div className="p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-white/60 dark:border-white/10">
                                                <h3 className="type-subhead mb-2">SESSION</h3>
                                                <button onClick={handleStartOver} className="btn-editorial-outline w-full flex items-center justify-center gap-2 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                                                    <RotateCcwIcon className="w-4 h-4"/> RESTART SESSION
                                                </button>
                                            </div>

                                             <div className="p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-white/60 dark:border-white/10">
                                                <h3 className="type-subhead mb-2">DISPLAY</h3>
                                                <div className="flex justify-between items-center text-sm font-medium">
                                                    <span>Quality Mode</span>
                                                    <span className="text-green-600 dark:text-green-400 font-bold text-xs bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">HIGH (GPU)</span>
                                                </div>
                                                 <div className="flex justify-between items-center text-sm font-medium mt-3">
                                                    <span>UI Animation</span>
                                                    <span className="text-black dark:text-white font-bold text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">ON</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm font-medium mt-3">
                                                    <span>Appearance</span>
                                                    <span className="text-black dark:text-white font-bold text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full uppercase">{theme}</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-800">
                                                 <h3 className="type-subhead mb-2">ABOUT</h3>
                                                 <p className="text-xs text-gray-500 leading-relaxed font-mono">
                                                    Payungi Studio OS<br/>
                                                    Version 1.0.2 (Stable)<br/>
                                                    Engine: Gemini 2.5 Flash
                                                 </p>
                                            </div>
                                        </div>
                                     </div>
                                )}
                            </aside>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer Status */}
            <footer className="h-8 bg-black/90 backdrop-blur rounded-xl text-white flex items-center justify-between px-6 text-[10px] uppercase font-bold tracking-widest flex-shrink-0 shadow-lg border border-white/10">
                 <Footer isOnDressingScreen={!!modelImageUrl} />
            </footer>
        </div>

        <LookbookModal 
            isOpen={isLookbookOpen} 
            onClose={() => { playSound('click'); setIsLookbookOpen(false); }} 
            modelImageUrl={displayImageUrl}
            items={currentOutfitItems}
        />

        {selectedItemForDetails && (
            <ItemDetailsModal
                isOpen={!!selectedItemForDetails}
                onClose={() => { playSound('click'); setSelectedItemForDetails(null); }}
                item={selectedItemForDetails}
                onRecolor={handleRecolorGarment}
            />
        )}
    </div>
  );
};

export default App;
