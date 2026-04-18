import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle, Settings } from 'lucide-react';
import { AddSubscriptionDrawer } from './organisms/AddSubscriptionDrawer';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center overflow-hidden">
      {/* Mobile-first centered bounds */}
      <div className="w-full max-w-md bg-white flex flex-col h-screen overflow-hidden border-x border-gray-200 relative">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 pb-32 pt-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-30">
          <button className="p-2 text-gray-900 transition-colors">
            <LayoutDashboard size={24} strokeWidth={1.5} />
          </button>
          
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="p-4 bg-gray-900 text-white rounded-full -mt-10 shadow-lg hover:bg-gray-800 transition-colors ring-4 ring-white"
          >
            <PlusCircle size={28} strokeWidth={1.5} />
          </button>

          <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <Settings size={24} strokeWidth={1.5} />
          </button>
        </nav>

        {/* Safe Structural Modals */}
        <AddSubscriptionDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>
    </div>
  );
};
