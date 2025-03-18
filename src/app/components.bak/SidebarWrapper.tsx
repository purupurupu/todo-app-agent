'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { useResponsive } from '../hooks/useResponsive';

export const SidebarWrapper: React.FC = () => {
  const { isMobile, isMobileMenuOpen, setIsMobileMenuOpen } = useResponsive();

  return (
    <>
      {!isMobile && <Sidebar isMobile={false} isOpen={true} onClose={() => {}} />}
      
      {isMobile && (
        <Sidebar 
          isMobile={true} 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </>
  );
}; 