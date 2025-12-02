
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface FooterProps {
  isOnDressingScreen?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isOnDressingScreen = false }) => {
  return (
    <footer className="h-8 bg-vendor-panel border-t border-vendor-border flex items-center justify-between px-4 text-[10px] text-vendor-text-muted z-50 shrink-0">
        <div className="flex items-center gap-4">
            <span>SISTEM: AMAN</span>
            <span className="hidden sm:inline">GPU: GASPOL</span>
            <span className="hidden sm:inline">MEMORI: LEGA</span>
        </div>
        <div>
            <span>© 2025 Payungi Studio Systems</span>
        </div>
    </footer>
  );
};

export default Footer;
