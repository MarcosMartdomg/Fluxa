import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Globe, 
  Clock, 
  MoreHorizontal,
  Plus,
  Layout
} from 'lucide-react';
import { PATHS } from '../../routes/paths';
import { clsx } from 'clsx';

interface SidebarProps {
  isExpanded: boolean;
}

const Sidebar = ({ isExpanded }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: PATHS.DASHBOARD, icon: Home },
    { name: 'Assets', path: PATHS.WORKFLOWS, icon: Layout },
    { name: 'Discover', path: PATHS.LOGS, icon: Globe },
  ];

  return (
    <aside className={clsx(
      "bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-20",
      isExpanded ? "w-60" : "w-16"
    )}>
      <div className={clsx("flex flex-col items-center py-6 h-full", isExpanded && "items-stretch px-4")}>
        {/* Purple Plus Button / Create Button */}
        <button className={clsx(
          "bg-[#6366F1] text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:opacity-90 transition-all mb-6 shrink-0",
          isExpanded ? "h-11 px-4 gap-3 w-full" : "w-10 h-10"
        )}>
          <Plus className={clsx(isExpanded ? "w-5 h-5" : "w-6 h-6")} />
          {isExpanded && <span className="text-[13px] font-bold">+ Create</span>}
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={isExpanded ? undefined : item.name}
                className={clsx(
                  'flex items-center gap-4 rounded-xl transition-all duration-200 group relative',
                  isExpanded ? 'px-4 py-2.5' : 'p-2 justify-center mx-auto',
                  isActive
                    ? 'bg-[#D8D8FB] text-[#6366F1]'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                )}
              >
                <Icon className={clsx(isExpanded ? "w-5 h-5" : "w-6 h-6")} />
                {isExpanded && (
                  <span className={clsx(
                    "text-[14px] font-medium transition-colors",
                    isActive ? "text-[#6366F1]" : "text-gray-500"
                  )}>
                    {item.name}
                  </span>
                )}
                {!isActive && !isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
          
          {/* Separator Line */}
          <div className={clsx(
            "my-4 border-t border-gray-100",
            isExpanded ? "mx-2" : "w-8 mx-auto"
          )} />

          {/* Secondary Items integrated in the flow */}
          <button className={clsx(
            "flex items-center gap-4 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors",
            isExpanded ? "px-4 py-2.5" : "p-2 justify-center mx-auto"
          )}>
            <Clock className={clsx(isExpanded ? "w-5 h-5" : "w-6 h-6")} />
            {isExpanded && <span className="text-[14px] font-medium text-gray-500">Log</span>}
          </button>
          <button className={clsx(
            "flex items-center gap-4 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors",
            isExpanded ? "px-4 py-2.5" : "p-2 justify-center mx-auto"
          )}>
            <MoreHorizontal className={clsx(isExpanded ? "w-5 h-5" : "w-6 h-6")} />
            {isExpanded && <span className="text-[14px] font-medium text-gray-500">More</span>}
          </button>
        </nav>
      </div>
    </aside>

  );
};


export default Sidebar;



