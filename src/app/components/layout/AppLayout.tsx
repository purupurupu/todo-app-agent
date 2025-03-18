import React from 'react';
import { AppHeader } from './AppHeader';
import { SidebarWrapper } from './SidebarWrapper';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* サイドバーラッパー（クライアントコンポーネント） */}
      <SidebarWrapper />

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ヘッダー（クライアントコンポーネント） */}
        <AppHeader />

        {/* メインコンテンツエリア */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}; 