import { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-background min-h-screen font-sans text-text relative overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-surface-2/90 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2">
            <img src="/assets/leo-logo.png" alt="Logo" className="w-8 h-8 rounded-full bg-white p-1 object-contain" onError={(e) => e.target.style.display = 'none'} />
            <h2 className="text-xl font-black text-primary">LEO<span className="text-white font-light">CRACKERS</span></h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-primary text-2xl p-2 hover:bg-white/5 rounded-lg transition"
          >
            <FaBars />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 lg:p-10 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;