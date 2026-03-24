import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, GitMerge, PlayCircle, ClipboardList, Settings, Zap } from 'lucide-react';
import { PATHS } from '../../routes/paths';
import { clsx } from 'clsx';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: PATHS.DASHBOARD, icon: LayoutDashboard },
    { name: 'Workflows', path: PATHS.WORKFLOWS, icon: GitMerge },
    { name: 'Executions', path: PATHS.EXECUTIONS, icon: PlayCircle },
    { name: 'Logs', path: PATHS.LOGS, icon: ClipboardList },
    { name: 'Settings', path: PATHS.SETTINGS, icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="p-6 flex items-center gap-2">
        <Zap className="w-8 h-8 text-brand-500 fill-brand-500" />
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Fluxa</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <span className="text-xs font-bold">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">John Doe</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">john@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
