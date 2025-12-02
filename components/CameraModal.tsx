
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { XIcon, CameraIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../lib/soundEffects';

interface CameraModalProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Gagal akses kamera. Cek izinnya dulu ya.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
     return () => {
         if (stream) {
             stream.getTracks().forEach(track => track.stop());
         }
     }
  }, [stream]);

  const performCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      playSound('shutter'); // Play shutter sound
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "foto-jepret.png", { type: "image/png" });
            onCapture(file);
            onClose();
          }
        }, 'image/png');
      }
    }
  }, [onCapture, onClose]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      playSound('beep'); // Play beep on 3, 2, 1
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      performCapture();
    }
  }, [countdown, performCapture]);

  const startCountdown = () => {
    playSound('click');
    setCountdown(3);
  };

  const handleClose = () => {
      playSound('click');
      onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-panel-dark rounded-3xl overflow-hidden w-full max-w-2xl relative flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
      >
        <div className="p-4 flex justify-between items-center border-b border-white/10 bg-black/20">
             <h2 className="text-lg font-bold text-white tracking-wide">📸 Ambil Foto</h2>
             <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white" aria-label="Close camera">
                 <XIcon className="w-6 h-6" />
             </button>
        </div>
        
        <div className="relative bg-black w-full aspect-[4/3] sm:aspect-video flex items-center justify-center overflow-hidden group">
            {error ? (
                <div className="text-white text-center p-6 max-w-xs glass-panel-dark rounded-xl">
                    <p>{error}</p>
                </div>
            ) : (
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover transform scale-x-[-1]" 
                />
            )}
            <canvas ref={canvasRef} className="hidden" />

            <AnimatePresence>
              {countdown !== null && countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 backdrop-blur-[4px]">
                   <motion.div
                      key={countdown}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 1 }}
                      exit={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-[10rem] font-black text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                   >
                      {countdown}
                   </motion.div>
                </div>
              )}
            </AnimatePresence>
        </div>

        <div className="p-6 flex justify-center bg-black/20 backdrop-blur-xl border-t border-white/5">
            <button 
                onClick={startCountdown}
                disabled={!!error || countdown !== null}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.3)] w-56 text-lg"
            >
                {countdown !== null ? (
                    <span className="animate-pulse">Siap-siap...</span>
                ) : (
                    <>
                        <CameraIcon className="w-6 h-6" />
                        Jepret
                    </>
                )}
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CameraModal;
