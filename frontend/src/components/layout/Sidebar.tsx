import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: PATHS.DASHBOARD, icon: Home },
    { name: 'Assets', path: PATHS.WORKFLOWS, icon: Layout },
    { name: 'Discover', path: PATHS.LOGS, icon: Globe },
  ];

  return (
    <aside 
      className={clsx(
        "bg-white border-r border-gray-100 flex flex-col z-20 overflow-hidden",
        isExpanded ? "w-60" : "w-16"
      )}
      style={{ transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <div className={clsx("flex flex-col items-center pt-4 pb-6 h-full", isExpanded && "items-stretch px-3")}>
        
        {/* Create Button (Integrated grid item) */}
        <button 
          onClick={() => navigate(PATHS.CREATE_WORKFLOW)}
          className={clsx(
            "flex items-center rounded-lg transition-all duration-200 bg-[#6366F1] text-white mb-4 shrink-0 overflow-hidden",
            isExpanded ? "px-3 py-2 gap-4 w-full" : "h-10 w-10 justify-center mx-auto"
          )}
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          <span className={clsx(
            "text-[14px] font-semibold whitespace-nowrap transition-all duration-200",
            isExpanded ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4 pointer-events-none"
          )}>
            Create
          </span>
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
                  'flex items-center rounded-lg transition-all duration-200 group relative overflow-hidden',
                  isExpanded ? 'px-3 py-2 gap-4' : 'h-10 w-10 justify-center mx-auto',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={clsx(
                  "text-[14px] font-semibold whitespace-nowrap transition-all duration-200",
                  isExpanded ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4 pointer-events-none",
                  isActive ? "text-indigo-600" : "text-gray-600 group-hover:text-gray-900"
                )}>
                  {item.name}
                </span>

                {!isActive && !isExpanded && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform translate-x-[-4px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-md">
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
            "flex items-center text-gray-400 rounded-lg transition-all duration-200 group overflow-hidden",
            isExpanded ? "px-3 py-2 gap-4" : "h-10 w-10 justify-center mx-auto hover:bg-gray-100 hover:text-gray-700"
          )}>
            <Clock className="w-5 h-5 flex-shrink-0" />
            <span className={clsx(
              "text-[14px] font-semibold whitespace-nowrap transition-all duration-200",
              isExpanded ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4 pointer-events-none",
              "text-gray-500 group-hover:text-gray-700"
            )}>
              Log
            </span>
          </button>
          <button className={clsx(
            "flex items-center text-gray-400 rounded-lg transition-all duration-200 group overflow-hidden",
            isExpanded ? "px-3 py-2 gap-4" : "h-10 w-10 justify-center mx-auto hover:bg-gray-100 hover:text-gray-700"
          )}>
            <MoreHorizontal className="w-5 h-5 flex-shrink-0" />
            <span className={clsx(
              "text-[14px] font-semibold whitespace-nowrap transition-all duration-200",
              isExpanded ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4 pointer-events-none",
              "text-gray-500 group-hover:text-gray-700"
            )}>
              More
            </span>
          </button>
        </nav>
      </div>
    </aside>

  );
};


export default Sidebar;
