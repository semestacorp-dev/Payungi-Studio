
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { OutfitLayer, WardrobeItem } from '../types';
import { Trash2Icon, ShareIcon, PaletteIcon, DownloadIcon, UndoIcon, RedoIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

interface OutfitStackProps {
  outfitHistory: OutfitLayer[];
  onRemoveLastGarment: () => void;
  onAddGarment: () => void;
  onShare?: () => void;
  onShareLink?: () => void;
  onOpenDetails: (item: WardrobeItem) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const OutfitStack: React.FC<OutfitStackProps> = ({ 
    outfitHistory, 
    onRemoveLastGarment, 
    onShare, 
    onShareLink, 
    onOpenDetails,
    onUndo,
    onRedo,
    canUndo = false,
    canRedo = false
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Undo/Redo Controls within the list context if available */}
      {(onUndo || onRedo) && (
        <div className="px-2 pb-2 flex justify-end gap-1">
             <button 
                onClick={onUndo} 
                disabled={!canUndo} 
                className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Undo"
            >
                <UndoIcon className="w-4 h-4 text-gray-700" />
            </button>
            <button 
                onClick={onRedo} 
                disabled={!canRedo} 
                className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Redo"
            >
                <RedoIcon className="w-4 h-4 text-gray-700" />
            </button>
        </div>
      )}

      <div className="flex-grow overflow-y-auto custom-scrollbar space-y-1">
        <AnimatePresence initial={false}>
            {outfitHistory.length <= 1 ? (
                <div className="h-full flex items-center justify-center opacity-40">
                   <span className="type-subhead">BELUM PAKE APA-APA</span>
                </div>
            ) : (
                outfitHistory.slice(1).map((layer, index) => (
                <motion.div
                    key={layer.garment?.id || index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-between group p-2 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={() => layer.garment && onOpenDetails(layer.garment)}>
                         {layer.garment && (
                            <div className="w-8 h-8 border border-black overflow-hidden flex-shrink-0">
                                <img src={layer.garment.url} className="w-full h-full object-cover" alt="thumb" />
                            </div>
                         )}
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-black uppercase truncate">
                                {layer.garment?.name}
                            </span>
                            <span className="text-[9px] text-gray-500 font-serif italic">
                                {layer.garment?.category}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {layer.garment && (
                            <button onClick={() => onOpenDetails(layer.garment!)} className="p-1.5 hover:bg-gray-200 text-black transition-colors" title="Ganti Warna">
                                <PaletteIcon className="w-3.5 h-3.5" />
                            </button>
                        )}
                        {/* Only show trash for the top-most item to maintain stack integrity, or use general undo */}
                        {index === outfitHistory.length - 2 && (
                        <button onClick={onRemoveLastGarment} className="p-1.5 hover:bg-red-50 text-red-600 transition-colors" title="Lepas">
                            <Trash2Icon className="w-3.5 h-3.5" />
                        </button>
                        )}
                    </div>
                </motion.div>
                ))
            )}
        </AnimatePresence>
      </div>
      
      {/* Bottom Actions */}
      <div className="mt-auto pt-2 flex gap-2 border-t border-black">
         {onShare && (
            <button onClick={onShare} disabled={outfitHistory.length <= 1} className="flex-1 btn-editorial-outline flex justify-center gap-2 items-center disabled:opacity-30">
                <ShareIcon className="w-3 h-3" /> LIHAT HASIL
            </button>
         )}
         {onShareLink && (
            <button onClick={onShareLink} disabled={outfitHistory.length <= 1} className="flex-1 btn-editorial-outline flex justify-center gap-2 items-center disabled:opacity-30">
                <DownloadIcon className="w-3 h-3" /> BAGI LINK
            </button>
         )}
      </div>
    </div>
  );
};

export default OutfitStack;
