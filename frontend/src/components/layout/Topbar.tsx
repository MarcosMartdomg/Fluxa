import { HelpCircle, ChevronUp, ChevronDown, Menu, Check, Plus } from 'lucide-react';

import { clsx } from 'clsx';
import { useProject } from '../../context/ProjectContext';
import { useState, useRef, useEffect } from 'react';

interface TopbarProps {
  onToggleSidebar: () => void;
  isExpanded: boolean;
}

const Topbar = ({ onToggleSidebar, isExpanded }: TopbarProps) => {
  const { projects, activeProject, setActiveProject, createProject } = useProject();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || isCreating) return;

    try {
      setIsCreating(true);
      await createProject(newProjectName);
      setNewProjectName('');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center h-full">
        {/* Left Section: Menu + Logo */}
        <div className={clsx(
          "flex items-center transition-all duration-300 h-full",
          isExpanded ? "w-60 px-6 gap-3" : "w-16 justify-center"
        )}>
          <button 
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {isExpanded && (
             <div className="flex items-center gap-2 animate-in fade-in duration-300">
              <img src="/images/logo_dashboard.png" alt="Fluxa" className="h-6" />
              <span className="text-[10px] font-bold bg-[#D8D8FB] text-[#6366F1] px-1.5 py-0.5 rounded leading-none uppercase tracking-wide">FREE</span>
            </div>
          )}
        </div>

        {/* Logo when collapsed (starts after the 64px sidebar/topbar section) */}
        {!isExpanded && (
          <div className="flex items-center gap-2 animate-in fade-in duration-300 ml-2">
            <img src="/images/logo_dashboard.png" alt="Fluxa" className="h-6" />
            <span className="text-[10px] font-bold bg-[#D8D8FB] text-[#6366F1] px-1.5 py-0.5 rounded leading-none uppercase tracking-wide">FREE</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 px-4">

        {/* Project Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 shadow-sm min-w-[140px]"
          >
            <div className="flex flex-col items-center gap-0.5 scale-75">
              <ChevronUp className="w-3 h-3 -mb-1" />
              <ChevronDown className="w-3 h-3 -mt-1" />
            </div>
            <span className="text-sm font-medium truncate max-w-[120px]">
              {activeProject ? activeProject.name : 'All Projects'}
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">YOUR PROJECTS</span>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto p-1">
                {projects.length === 0 ? (
                  <div className="px-3 py-4 text-center">
                    <p className="text-xs text-gray-400 font-medium">No projects yet</p>
                  </div>
                ) : (
                  projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        setActiveProject(project);
                        setIsDropdownOpen(false);
                      }}
                      className={clsx(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                        activeProject?.id === project.id 
                          ? "bg-[#6366F1]/10 text-[#6366F1] font-semibold" 
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={clsx(
                          "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold",
                          activeProject?.id === project.id ? "bg-[#6366F1] text-white" : "bg-gray-100 text-gray-400"
                        )}>
                          {project.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[140px]">{project.name}</span>
                      </div>
                      {activeProject?.id === project.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))
                )}
              </div>

              <div className="p-2 bg-gray-50/50 border-t border-gray-50">
                <form onSubmit={handleCreateProject} className="relative">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="New Workspace..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] outline-none transition-all placeholder:text-gray-300 font-medium"
                    autoComplete="off"
                  />
                  <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                  {newProjectName.trim() && (
                    <button 
                      type="submit"
                      disabled={isCreating}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-[#6366F1] text-white rounded hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}

        </div>

        <div className="h-6 w-px bg-gray-100 mx-1" />
        
        <button className="text-gray-400 hover:text-gray-600 p-2 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="bg-white border border-gray-200 text-gray-700 font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-colors shadow-sm">
          Upgrade
        </button>
        <button className="bg-[#6366F1] text-white font-bold px-4 py-1.5 rounded-lg text-sm hover:opacity-90 transition-all shadow-md shadow-indigo-100">
          PRO
        </button>
      </div>
    </header>
  );
};

export default Topbar;
