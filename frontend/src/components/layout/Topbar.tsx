import { HelpCircle, ChevronUp, ChevronDown, Menu, Check, Trash2, AlertTriangle } from 'lucide-react';

import { clsx } from 'clsx';
import { useProject } from '../../context/ProjectContext';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

interface TopbarProps {
  onToggleSidebar: () => void;
  isExpanded: boolean;
  showSidebarToggle?: boolean;
}

const Topbar = ({ onToggleSidebar, isExpanded, showSidebarToggle = true }: TopbarProps) => {
  const { projects, activeProject, setActiveProject, deleteProject } = useProject();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDeleteProject = async () => {
    if (!projectToDelete || isDeleting) return;
    if (deleteConfirmationText.trim() !== projectToDelete.name) return;

    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteProject(projectToDelete.id);
      setProjectToDelete(null);
      setDeleteConfirmationText('');
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsDeleting(false);
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
          showSidebarToggle
            ? isExpanded
              ? "w-60 px-6 gap-3"
              : "w-16 justify-center"
            : "px-4 gap-3"
        )}>
          {showSidebarToggle && (
            <button 
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          {(isExpanded || !showSidebarToggle) && (
             <Link to={PATHS.DASHBOARD} className="flex items-center gap-2 animate-in fade-in duration-300">
              <img src="/images/logo_dashboard.png" alt="Fluxa" className="h-6" />
              <span className="text-[10px] font-bold bg-[#D8D8FB] text-[#6366F1] px-1.5 py-0.5 rounded leading-none uppercase tracking-wide">FREE</span>
            </Link>
          )}
        </div>

        {/* Logo when collapsed (starts after the 64px sidebar/topbar section) */}
        {!isExpanded && showSidebarToggle && (
          <Link to={PATHS.DASHBOARD} className="flex items-center gap-2 animate-in fade-in duration-300 ml-2">
            <img src="/images/logo_dashboard.png" alt="Fluxa" className="h-6" />
            <span className="text-[10px] font-bold bg-[#D8D8FB] text-[#6366F1] px-1.5 py-0.5 rounded leading-none uppercase tracking-wide">FREE</span>
          </Link>
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
                  <>
                    <button
                      onClick={() => {
                        setActiveProject(null);
                        setIsDropdownOpen(false);
                        navigate(PATHS.WORKFLOWS);
                      }}
                      className={clsx(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                        !activeProject
                          ? "bg-[#6366F1]/10 text-[#6366F1] font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <span className="truncate">All Projects</span>
                      {!activeProject && <Check className="w-3.5 h-3.5" />}
                    </button>

                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="mt-1 w-full rounded-lg border border-transparent transition-all"
                      >
                        <div className="flex items-center gap-1 pr-1">
                          <button
                            onClick={() => {
                              setActiveProject(project);
                              setIsDropdownOpen(false);
                              navigate(PATHS.PROJECT_DETAIL.replace(':id', project.id));
                            }}
                            className={clsx(
                              "flex-1 flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
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
                              <span className="truncate max-w-[110px]">{project.name}</span>
                            </div>
                            {activeProject?.id === project.id && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => {
                              setProjectToDelete({ id: project.id, name: project.name });
                              setDeleteConfirmationText('');
                              setIsDropdownOpen(false);
                            }}
                            disabled={isDeleting}
                            title="Delete project"
                            className={clsx(
                              "p-2 rounded-md transition-colors",
                              "text-gray-400 hover:text-red-600 hover:bg-red-50",
                              isDeleting && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
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

      {projectToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start gap-3">
              <div className="mt-0.5 rounded-xl bg-red-100 p-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete project?</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This action cannot be undone. Type the project name to confirm deletion.
                </p>
              </div>
            </div>

            <div className="mb-5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {projectToDelete.name}
            </div>

            <input
              value={deleteConfirmationText}
              onChange={(event) => setDeleteConfirmationText(event.target.value)}
              placeholder="Type project name"
              className="mb-6 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition-colors focus:border-[#6366F1]"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setProjectToDelete(null);
                  setDeleteConfirmationText('');
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={isDeleting || deleteConfirmationText.trim() !== projectToDelete.name}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;
