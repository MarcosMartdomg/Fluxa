import { HelpCircle, ChevronUp, ChevronDown, Menu } from 'lucide-react';
import { clsx } from 'clsx';


interface TopbarProps {
  onToggleSidebar: () => void;
  isExpanded: boolean;
}

const Topbar = ({ onToggleSidebar, isExpanded }: TopbarProps) => {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between z-30">
      <div className="flex items-center h-full">
        {/* Menu & Brand Section - Width transitions to match Sidebar */}
        <div className={clsx(
          "flex items-center transition-all duration-300 border-r border-gray-100 h-full",
          isExpanded ? "w-60 px-6 gap-3" : "w-16 justify-center"
        )}>
          <button 
            onClick={onToggleSidebar}
            className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors shrink-0"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
          
          {isExpanded && (
            <div className="flex items-center gap-3 animate-in fade-in duration-300">
              <img 
                src="/images/logo_dashboard.png" 
                alt="Fluxa" 
                className="h-6 w-auto object-contain"
              />
              <span className="bg-[#6366F1] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Free
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center h-full">
          {/* Brand Section (Only visible when sidebar is collapsed) */}
          {!isExpanded && (
            <div className="flex items-center gap-3 px-6 border-r border-gray-50 h-full animate-in fade-in duration-300">
              <img 
                src="/images/logo_dashboard.png" 
                alt="Fluxa" 
                className="h-6 w-auto object-contain"
              />
              <span className="bg-[#6366F1] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Free
              </span>
            </div>
          )}

          {/* Project Selector Section */}
          <div className="flex items-center px-6 h-full">
            <button className="flex items-center gap-3 text-[13px] font-medium text-gray-500 hover:text-[#6366F1] transition-colors group">
              <div className="flex flex-col text-gray-300 group-hover:text-[#6366F1] transition-colors scale-75">
                <ChevronUp className="w-4 h-4 translate-y-1" />
                <ChevronDown className="w-4 h-4 -translate-y-1" />
              </div>
              <span className="tracking-tight">All Projects</span>
            </button>
          </div>
        </div>
      </div>



      <div className="flex items-center gap-3 pr-6">
        <button className="text-gray-400 hover:text-gray-600 p-2 border border-gray-100 rounded-full transition-colors mr-2">
          <HelpCircle className="w-4 h-4 stroke-[2]" />
        </button>
        
        <button className="bg-[#6366F1] hover:opacity-90 text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-sm transition-all">
          Upgrade
        </button>
        
        <button className="bg-[#3B82F6] hover:opacity-90 text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-sm transition-all">
          Upgrade
        </button>

        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 ml-2 shadow-sm">
          <span className="text-[11px] font-bold text-blue-600">MD</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

