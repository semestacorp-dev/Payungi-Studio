
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo } from 'react';
import type { WardrobeItem, WardrobeCategory } from '../types';
import { UploadCloudIcon, CheckCircleIcon, CubeIcon } from './icons';
import { urlToFile } from '../lib/utils';
import { playSound } from '../lib/soundEffects';

interface WardrobePanelProps {
  onGarmentSelect: (garmentFile: File, garmentInfo: WardrobeItem) => void;
  activeGarmentIds: string[];
  isLoading: boolean;
  wardrobe: WardrobeItem[];
  onOpenDetails: (item: WardrobeItem) => void;
}

// Define the available filters mixing Categories and Styles
const FILTERS = [
    'All', 
    'Suits',
    'Party', 
    'Streetwear', 
    'Vintage', 
    'Instagram Filter',
    'Formal',
    'Traditional', 
    'Swimwear', 
    'Accessories', 
    'Tops', 
    'Bottoms', 
    'Dresses', 
    'Outerwear', 
    'Custom'
];

const WardrobePanel: React.FC<WardrobePanelProps> = ({ onGarmentSelect, activeGarmentIds, isLoading, wardrobe, onOpenDetails }) => {
    const [activeFilter, setActiveFilter] = useState<string>('All');

    const handleFilterChange = (filter: string) => {
        playSound('click');
        setActiveFilter(filter);
    };

    const handleGarmentClick = async (item: WardrobeItem) => {
        if (isLoading || activeGarmentIds.includes(item.id)) return;
        playSound('click');
        try {
            const file = await urlToFile(item.url, item.name);
            onGarmentSelect(file, item);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            playSound('click');
            const file = e.target.files[0];
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
        return wardrobe.filter(item => {
            if (activeFilter === 'All') return true;
            
            // Filter by Category OR Style
            const categoryMatch = item.category === activeFilter;
            const styleMatch = item.style === activeFilter;

            return categoryMatch || styleMatch;
        });
    }, [wardrobe, activeFilter]);

    // Helper to render label with icon
    const getLabel = (filter: string) => {
        switch(filter) {
            case 'Suits': return '🕴️ Daily Suit';
            case 'Party': return '🎉 Party';
            case 'Streetwear': return '👟 Streetwear';
            case 'Vintage': return '📻 Vintage';
            case 'Instagram Filter': return '✨ Insta Filter';
            case 'Formal': return '👔 Formal';
            case 'Traditional': return '🏛️ Adat';
            case 'Swimwear': return '👙 Renang';
            case 'Accessories': return '✨ Aksesoris';
            case 'Custom': return '📂 Upload';
            default: return filter;
        }
    };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white text-black">
        {/* Header & Filters */}
        <div className="flex-shrink-0 mb-6 px-1">
             <div className="flex justify-between items-end border-b border-black pb-2 mb-4">
                 <h2 className="type-headline text-2xl">LEMARI BAJU</h2>
                 <span className="type-subhead">{filteredWardrobe.length} ITEM</span>
             </div>
             
             <div className="flex flex-wrap gap-2">
                {FILTERS.map(filter => (
                    <button
                        key={filter}
                        onClick={() => handleFilterChange(filter)}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                            activeFilter === filter 
                            ? 'bg-black text-white border-black' 
                            : 'bg-transparent text-black/50 border-gray-200 hover:border-black hover:text-black'
                        }`}
                    >
                        {getLabel(filter)}
                    </button>
                ))}
             </div>
        </div>

        {/* Grid Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
            <div className="grid grid-cols-2 gap-x-2 gap-y-6 pb-6">
                {/* Upload Card */}
                <label className="aspect-[3/4] border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all group">
                    <UploadCloudIcon className="w-6 h-6 text-gray-400 group-hover:text-black mb-2"/>
                    <span className="type-subhead text-[8px]">TAMBAH BAJU</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading}/>
                </label>

                {filteredWardrobe.map((item) => {
                    const isActive = activeGarmentIds.includes(item.id);
                    return (
                        <div key={item.id} className="group flex flex-col relative">
                            <button
                                onClick={() => handleGarmentClick(item)}
                                disabled={isLoading || isActive}
                                className={`relative aspect-[3/4] overflow-hidden border transition-all ${
                                    isActive ? 'border-black opacity-100' : 'border-transparent hover:border-black'
                                }`}
                            >
                                <img src={item.url} alt={item.name} className={`w-full h-full object-cover transition-transform duration-500 ${isActive ? '' : 'group-hover:scale-105'} ${isActive ? 'grayscale' : ''}`} />
                                
                                {isActive && (
                                    <div className="absolute top-2 right-2 bg-black text-white p-1 rounded-full z-10">
                                        <CheckCircleIcon className="w-4 h-4" />
                                    </div>
                                )}
                            </button>
                            
                            {item.model3dUrl && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenDetails(item);
                                    }}
                                    className="absolute top-2 left-2 bg-white/90 text-black p-1.5 rounded-full shadow-sm hover:scale-110 transition-transform z-10 border border-gray-200"
                                    title="View 3D Model"
                                >
                                    <CubeIcon className="w-3.5 h-3.5 group-hover:animate-[spin_3s_linear_infinite]" />
                                </button>
                            )}

                            <div className="mt-2 flex justify-between items-start">
                                <div className="flex flex-col min-w-0">
                                    <button 
                                        onClick={() => onOpenDetails(item)}
                                        className="font-bold text-xs truncate hover:underline text-left"
                                    >
                                        {item.name}
                                    </button>
                                    <span className="text-[9px] text-gray-500 uppercase tracking-wide">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
             {filteredWardrobe.length === 0 && (
                <p className="text-center text-sm text-gray-500 mt-4">Gak ada baju yang cocok nih.</p>
            )}
        </div>
    </div>
  );
};

export default WardrobePanel;
