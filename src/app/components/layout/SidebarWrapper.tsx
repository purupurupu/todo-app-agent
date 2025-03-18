'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { useResponsive } from '@/app/hooks/useResponsive';

export const SidebarWrapper: React.FC = () => {
  const { isMobile } = useResponsive();
  const [isOpen, setIsOpen] = React.useState(false);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <Sidebar isMobile={isMobile} isOpen={isOpen} onClose={closeSidebar} />
      {isMobile && !isOpen && (
        <button onClick={openSidebar} className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      )}
    </>
  );
}; 