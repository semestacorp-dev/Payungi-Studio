
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme = 'light', onToggleTheme }) => {
  return (
    <div className="w-full h-full flex items-center justify-between px-2 relative">
        {/* Left: Issue Details */}
        <div className="hidden md:flex flex-col items-start gap-1">
             <span className="type-subhead text-black/60 dark:text-white/60">VOL. 01</span>
             <span className="font-sans text-[9px] font-medium border-b border-black dark:border-white pb-0.5 text-black dark:text-white">EST. 2025</span>
        </div>

        {/* Center: Masthead */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="type-masthead text-black dark:text-white">PAYUNGI</h1>
            <div className="w-full h-px bg-black dark:bg-white mt-1 mb-1"></div>
            <span className="type-subhead text-black dark:text-white tracking-[0.4em]">STUDIO</span>
        </div>

        {/* Right: Context Info & Theme Toggle */}
        <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="type-subhead text-black dark:text-white">STUDIO LIVE</span>
            </div>
            
            <div className="flex items-center gap-4">
                <span className="type-subhead text-black dark:text-white border border-black dark:border-white px-2 py-1 rounded-sm">
                    ID
                </span>

                {onToggleTheme && (
                    <button 
                        onClick={onToggleTheme}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-black dark:text-white transition-colors"
                        title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
                    >
                        {theme === 'light' ? (
                            <MoonIcon className="w-4 h-4" />
                        ) : (
                            <SunIcon className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default Header;
