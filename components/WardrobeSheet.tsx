
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo } from 'react';
import { defaultWardrobe } from '../wardrobe';
import type { WardrobeItem, WardrobeCategory } from '../types';
import { UploadCloudIcon, CheckCircleIcon, XIcon } from './icons';
import { AnimatePresence, motion } from 'framer-motion';
import { urlToFile } from '../lib/utils';


interface WardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGarmentSelect: (garmentFile: File, garmentInfo: WardrobeItem) => void;
  activeGarmentIds: string[];
  isLoading: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
    'All': 'Semua',
    'Traditional': 'Adat',
    'Swimwear': 'Baju Renang',
    'Accessories': 'Aksesoris',
    'Tops': 'Atasan',
    'Bottoms': 'Bawahan',
    'Dresses': 'Terusan',
    'Outerwear': 'Luaran',
    'Custom': 'Upload'
};

const STYLE_LABELS: Record<string, string> = {
    'All': 'Semua',
    'Casual': 'Santai',
    'Formal': 'Resmi',
    'Sport': 'Olahraga',
    'Party': 'Pesta'
};

const CATEGORIES: (WardrobeCategory | 'All')[] = ['All', 'Traditional', 'Swimwear', 'Accessories', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Custom'];
const STYLES = ['All', 'Casual', 'Formal', 'Sport', 'Party'];

const WardrobeModal: React.FC<WardrobeModalProps> = ({ isOpen, onClose, onGarmentSelect, activeGarmentIds, isLoading }) => {
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<WardrobeCategory | 'All'>('All');
    const [activeStyle, setActiveStyle] = useState<string>('All');

    const handleGarmentClick = async (item: WardrobeItem) => {
        if (isLoading || activeGarmentIds.includes(item.id)) return;
        setError(null);
        try {
            const file = await urlToFile(item.url, `${item.id}.png`);
            onGarmentSelect(file, item);
        } catch (err) {
            setError('Gagal memuat item.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                setError('Pilih file gambar ya.');
                return;
            }
            const customGarmentInfo: WardrobeItem = {
                id: `custom-${Date.now()}`,
                name: file.name,
                url: URL.createObjectURL(file),
                category: 'Custom',
                style: 'Casual'
            };
            onGarmentSelect(file, customGarmentInfo);
        }
    };

    const filteredWardrobe = useMemo(() => {
        return defaultWardrobe.filter(item => {
            const catMatch = activeCategory === 'All' || item.category === activeCategory;
            const styleMatch = activeStyle === 'All' || (item.style && item.style === activeStyle) || (!item.style && activeStyle === 'Casual');
            return catMatch && styleMatch;
        });
    }, [activeCategory, activeStyle]);

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="glass-panel relative rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center justify-between p-4 border-b border-gray-200/50 flex-shrink-0 bg-white/40">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Pilih Item</h2>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-white/50 hover:text-gray-900 transition-colors">
                            <XIcon className="w-6 h-6"/>
                        </button>
                    </div>

                    {/* Filters - Floating Glass Style */}
                    <div className="p-4 bg-gray-50/20 flex flex-col gap-3 flex-shrink-0 relative z-10">
                        <div className="glass-panel rounded-2xl p-2 shadow-sm">
                            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar px-1">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                                            activeCategory === cat 
                                            ? 'bg-indigo-600 text-white shadow-md transform scale-105' 
                                            : 'bg-white/40 border border-white/60 text-gray-600 hover:bg-indigo-50'
                                        }`}
                                    >
                                        {cat === 'Accessories' ? '✨ Aksesoris' : cat === 'Traditional' ? '🏛️ Adat' : cat === 'Swimwear' ? '👙 Renang' : CATEGORY_LABELS[cat] || cat}
                                    </button>
                                ))}
                            </div>
                            <div className="flex overflow-x-auto gap-2 no-scrollbar px-1 pt-2 border-t border-gray-200/30 mt-1">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 self-center mr-1">Vibe</span>
                                {STYLES.map(style => (
                                    <button
                                        key={style}
                                        onClick={() => setActiveStyle(style)}
                                        className={`px-3 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-colors border ${
                                            activeStyle === style 
                                            ? 'border-gray-800 text-gray-900 bg-white/80 shadow-sm' 
                                            : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-white/40'
                                        }`}
                                    >
                                        {STYLE_LABELS[style] || style}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto min-h-0 bg-white/30">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {filteredWardrobe.map((item) => {
                            const isActive = activeGarmentIds.includes(item.id);
                            return (
                                <button
                                key={item.id}
                                onClick={() => handleGarmentClick(item)}
                                disabled={isLoading || isActive}
                                className="relative aspect-square glass-card rounded-xl overflow-hidden transition-all duration-200 focus:outline-none group disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105"
                                aria-label={`Select ${item.name}`}
                                >
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover p-1" />
                                {isActive && (
                                    <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center backdrop-blur-[2px]">
                                        <CheckCircleIcon className="w-8 h-8 text-white drop-shadow-md" />
                                    </div>
                                )}
                                </button>
                            );
                            })}
                            <label htmlFor="custom-garment-upload-sheet" className={`relative aspect-square border-2 border-dashed border-indigo-300 rounded-xl flex flex-col items-center justify-center text-gray-500 transition-colors ${isLoading ? 'cursor-not-allowed bg-gray-100' : 'hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 cursor-pointer'}`}>
                                <UploadCloudIcon className="w-6 h-6 mb-1"/>
                                <span className="text-xs text-center font-bold">Upload</span>
                                <input id="custom-garment-upload-sheet" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} disabled={isLoading}/>
                            </label>
                        </div>
                         {filteredWardrobe.length === 0 && (
                            <p className="text-center text-sm text-gray-500 mt-8">Gak ada item di kategori ini.</p>
                        )}
                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};

export default WardrobeModal;