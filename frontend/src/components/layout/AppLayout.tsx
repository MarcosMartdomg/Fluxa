import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DashboardFooter from './DashboardFooter';
import FloatingChatButton from '../common/FloatingChatButton';

const AppLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();
  const isProjectCanvasRoute = /^\/projects\/[^/]+$/.test(location.pathname);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Topbar 
        onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} 
        isExpanded={isSidebarExpanded}
        showSidebarToggle={!isProjectCanvasRoute}
      />
      <div className="flex flex-1 overflow-hidden">
        {!isProjectCanvasRoute && <Sidebar isExpanded={isSidebarExpanded} />}

        <div className="flex flex-col flex-1 relative overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-gray-50/30">
            <Outlet />
          </main>
          <DashboardFooter />
          <FloatingChatButton />
        </div>
      </div>
    </div>
  );
};




export default AppLayout;
