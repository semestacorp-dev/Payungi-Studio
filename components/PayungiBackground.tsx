
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { motion } from 'framer-motion';

const PayungiBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050505] z-0">
      {/* Base Gradient - Deep Studio Grey */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-[#0a0a0a] to-[#000000]"></div>

      {/* Animated Studio Spotlights (Gobo Effects) */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        {/* Light Beam 1 */}
        <motion.div 
            animate={{ 
                rotate: [0, 10, 0], 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-50%] left-[20%] w-[50vh] h-[150vh] bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-[80px] origin-top"
        />
        
        {/* Light Beam 2 */}
        <motion.div 
            animate={{ 
                rotate: [0, -15, 0], 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[-50%] right-[20%] w-[50vh] h-[150vh] bg-gradient-to-b from-blue-200/10 via-blue-200/5 to-transparent blur-[80px] origin-top"
        />

        {/* Moving Orb / Fill Light */}
        <motion.div 
            animate={{ 
                x: ['-20%', '20%', '-20%'],
                y: ['-20%', '20%', '-20%'],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-purple-500/5 blur-[120px]"
        />
      </div>

      {/* Graphic Studio Pattern - Grid/Lines */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
            backgroundSize: '100px 100px' 
        }}
      >
        <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none"></div>
      
      {/* Film Grain Texture */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
      ></div>
    </div>
  );
};

export default PayungiBackground;
