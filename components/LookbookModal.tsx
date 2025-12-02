
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, DownloadIcon, ShareIcon } from './icons';
import { WardrobeItem } from '../types';
import Spinner from './Spinner';

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelImageUrl: string | null;
  items: WardrobeItem[];
}

const LookbookModal: React.FC<LookbookModalProps> = ({ isOpen, onClose, modelImageUrl, items }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleDownload = () => {
    if (modelImageUrl) {
      const link = document.createElement('a');
      link.href = modelImageUrl;
      link.download = `foto-payungi-studio-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (!modelImageUrl) return;
    setIsSharing(true);

    try {
      // 1. Construct the Outfit Description
      const outfitDetails = items
        .map(item => `• ${item.name} (${item.style || item.category})`)
        .join('\n');
      
      const shareTitle = 'My Payungi Studio Look ✨';
      const shareText = `Cek gaya baruku di Payungi Studio! Kece gak?\n\nOutfit yang dipake:\n${outfitDetails}\n\nCobain sendiri di sini! #PayungiStudio`;
      
      // 2. Convert Base64/URL to Blob/File for sharing
      const response = await fetch(modelImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'payungi-ootd.png', { type: 'image/png' });

      // 3. Prepare Share Data
      // Note: Some browsers/platforms support files, some support text/url. We try to bundle them.
      const shareData = {
        title: shareTitle,
        text: shareText,
        files: [file],
      };

      // 4. Execute Share
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support file sharing via API (e.g., some Desktop)
        // We try sharing just text and URL, or copy to clipboard
        try {
            await navigator.share({
                title: shareTitle,
                text: shareText,
                url: window.location.href
            });
        } catch (textShareError) {
             // Ultimate fallback: Clipboard
             await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
             alert('Info outfit & link udah dicopy ke clipboard ya! (Browser ini belum support share gambar langsung)');
        }
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Don't alert if user cancelled the share dialog
      if ((err as Error).name !== 'AbortError' && !(err as Error).message.toLowerCase().includes('cancel')) {
          alert('Gagal membuka menu share.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_60px_rgba(255,255,255,0.2)]"
          >
            {/* Left Side: The Image */}
            <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-4 md:p-8 relative overflow-hidden group">
               {modelImageUrl && (
                   <>
                    <img 
                        src={modelImageUrl} 
                        alt="Final Look" 
                        className="w-full h-full object-contain rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                   </>
               )}
            </div>

            {/* Right Side: Details */}
            <div className="w-full md:w-1/2 flex flex-col p-6 md:p-8 bg-white/60 backdrop-blur-xl relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors"
                >
                    <XIcon className="w-6 h-6 text-gray-800" />
                </button>

                <div className="mb-6">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-1">Gaya Kece Gue</h2>
                    <p className="text-gray-500 text-sm font-medium">Dibikin di Payungi Studio</p>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Outfit Yang Dipake</h3>
                    <div className="space-y-3">
                        {items.length > 0 ? (
                            items.map((item, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={`${item.id}-${idx}`} 
                                    className="flex items-center p-3 bg-white/70 rounded-xl border border-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 mr-4 border border-gray-100">
                                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.category} • {item.style || 'Santai'}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Belum ada item khusus yang dipakai.</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200/50 flex gap-3">
                    <button 
                        onClick={handleDownload}
                        disabled={isSharing}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-lg disabled:opacity-50"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        Simpan
                    </button>
                    <button 
                        onClick={handleShare}
                        disabled={isSharing}
                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 font-bold py-3.5 px-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSharing ? (
                            <div className="flex items-center gap-2">
                                <div className="scale-50"><Spinner /></div>
                                <span className="text-xs">Loading...</span>
                            </div>
                        ) : (
                            <>
                                <ShareIcon className="w-5 h-5" />
                                Share
                            </>
                        )}
                    </button>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LookbookModal;
