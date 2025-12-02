/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, PaletteIcon, ShoppingBagIcon, ExternalLinkIcon } from './icons';
import { WardrobeItem } from '../types';
import Spinner from './Spinner';
import { findSimilarItems, Product } from '../services/ecommerceService';

interface ItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WardrobeItem;
  onRecolor: (item: WardrobeItem, color: string) => Promise<void>;
}

const FASHION_COLORS = [
    { name: 'Hitam', hex: '#000000', label: 'Hitam' },
    { name: 'Putih', hex: '#ffffff', label: 'Putih' },
    { name: 'Navy', hex: '#172554', label: 'Navy' },
    { name: 'Merah', hex: '#991b1b', label: 'Merah' },
    { name: 'Zaitun', hex: '#3f6212', label: 'Hijau Zaitun' },
    { name: 'Krem', hex: '#e5e5e5', label: 'Krem' },
    { name: 'Abu-abu', hex: '#374151', label: 'Abu Gelap' },
    { name: 'Maroon', hex: '#500724', label: 'Maroon' },
];

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ isOpen, onClose, item, onRecolor }) => {
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [isRecoloring, setIsRecoloring] = useState(false);
    const [viewMode, setViewMode] = useState<'image' | '3d'>('image');

    useEffect(() => {
        if (isOpen && item) {
            setLoadingProducts(true);
            findSimilarItems(item).then(products => {
                setSimilarProducts(products);
                setLoadingProducts(false);
            });
            setViewMode('image');
        }
    }, [isOpen, item]);

    const handleColorClick = async (colorName: string) => {
        setIsRecoloring(true);
        try {
            await onRecolor(item, colorName);
            onClose(); 
        } catch (e) {
            console.error(e);
        } finally {
            setIsRecoloring(false);
        }
    };

    if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fdfdfd] w-full max-w-2xl rounded-[2px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/20"
          >
            <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-5/12 bg-[#f0f0f0] flex flex-col items-center justify-center p-4 relative group">
                    <div className="flex-grow w-full flex items-center justify-center relative">
                        {viewMode === '3d' && item.model3dUrl ? (
                             // @ts-ignore
                             <model-viewer
                                src={item.model3dUrl}
                                poster={item.url}
                                alt={`3D model of ${item.name}`}
                                camera-controls
                                auto-rotate
                                ar
                                shadow-intensity="1"
                                environment-image="neutral"
                                exposure="1"
                                loading="eager"
                                style={{ width: '100%', height: '100%', minHeight: '300px' }}
                             />
                        ) : (
                            <img src={item.url} alt={item.name} className="max-w-full max-h-[300px] object-contain drop-shadow-xl mix-blend-multiply" />
                        )}
                        
                        {!item.model3dUrl && viewMode === 'image' && (
                             <div className="absolute bottom-6 left-6">
                                <h3 className="font-serif text-2xl text-black italic">{item.category}</h3>
                                <p className="font-sans text-[10px] uppercase tracking-widest text-black/50 mt-1">{item.style || 'Classic'}</p>
                            </div>
                        )}
                    </div>

                    {item.model3dUrl && (
                        <div className="mt-4 flex bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                            <button 
                                onClick={() => setViewMode('image')}
                                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors ${viewMode === 'image' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
                            >
                                Foto 2D
                            </button>
                            <button 
                                onClick={() => setViewMode('3d')}
                                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors ${viewMode === '3d' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
                            >
                                Model 3D
                            </button>
                        </div>
                    )}
                </div>

                <div className="w-full md:w-7/12 p-8 overflow-y-auto flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                             <h2 className="font-serif text-3xl text-black leading-none mb-2">{item.name}</h2>
                             <p className="font-sans text-xs text-gray-500">ID: {item.id.split('-')[0]}</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-2 -mr-2 -mt-2 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <XIcon className="w-5 h-5 text-black" />
                        </button>
                    </div>

                    <div className="h-px w-full bg-black/5 mb-8"></div>

                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-black flex items-center gap-2">
                                <PaletteIcon className="w-3 h-3" />
                                PILIHAN WARNA
                            </span>
                            <span className="font-serif italic text-xs text-gray-400">Ganti Warna by AI</span>
                        </div>
                        
                        {isRecoloring ? (
                            <div className="flex flex-col items-center justify-center py-8 bg-gray-50 border border-gray-100">
                                <Spinner />
                                <p className="font-serif italic text-gray-600 mt-3">Lagi warnain kain...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-3">
                                {FASHION_COLORS.map(color => (
                                    <button
                                        key={color.name}
                                        onClick={() => handleColorClick(color.label)}
                                        className="group flex flex-col gap-2 cursor-pointer"
                                    >
                                        <div 
                                            className="w-full aspect-square border border-gray-200 transition-all duration-300 group-hover:border-black group-hover:shadow-lg relative overflow-hidden"
                                            style={{ backgroundColor: color.hex }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-white/20 pointer-events-none"></div>
                                        </div>
                                        <span className="font-sans text-[9px] uppercase tracking-wider text-gray-400 group-hover:text-black transition-colors text-center">
                                            {color.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-black flex items-center gap-2">
                                <ShoppingBagIcon className="w-3 h-3" />
                                REKOMENDASI MIRIP
                            </span>
                        </div>
                        
                        {loadingProducts ? (
                            <div className="w-full h-24 bg-gray-50 animate-pulse"></div>
                        ) : (
                            <div className="space-y-3">
                                {similarProducts.slice(0, 2).map(product => (
                                    <a 
                                        key={product.id} 
                                        href={product.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 group p-2 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 shrink-0">
                                            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover mix-blend-multiply" />
                                        </div>
                                        <div className="min-w-0 flex-grow">
                                            <h4 className="font-serif text-base text-black truncate group-hover:underline decoration-1 underline-offset-4">{product.title}</h4>
                                            <p className="font-sans text-[10px] text-gray-500 uppercase tracking-wide">{product.store}</p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="font-sans text-xs font-bold text-black">{product.currency} {product.price}</p>
                                            <ExternalLinkIcon className="w-3 h-3 text-gray-300 ml-auto mt-1 group-hover:text-black transition-colors" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ItemDetailsModal;
