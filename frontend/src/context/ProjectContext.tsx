import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import projectsService from '../services/projects.service';
import { useAuth } from './AuthContext';

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
  setActiveProject: (project: Project | null) => void;
  refreshProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProjectState] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const data = await projectsService.getAll();
      setProjects(data);
    } catch (error: any) {
      console.error('Failed to fetch projects:', error);
      if (error.response?.status === 401) {
        setProjects([]);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const setActiveProject = (project: Project | null) => {
    setActiveProjectState(project);
    if (project) {
      localStorage.setItem('activeProjectId', project.id);
    } else {
      localStorage.removeItem('activeProjectId');
    }
  };

  const createProject = async (name: string, description?: string) => {
    const newProject = await projectsService.create({ name, description });
    await refreshProjects();
    setActiveProject(newProject);
    return newProject;
  };

  const deleteProject = async (id: string) => {
    await projectsService.delete(id);
    const nextProjects = projects.filter((project) => project.id !== id);
    setProjects(nextProjects);

    if (activeProject?.id === id) {
      const nextActive = nextProjects[0] ?? null;
      setActiveProject(nextActive);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      refreshProjects();
    } else if (!isAuthenticated && !authLoading) {
      setProjects([]);
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, refreshProjects]);

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      activeProject, 
      loading, 
      setActiveProject, 
      refreshProjects, 
      createProject,
      deleteProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
