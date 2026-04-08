import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import projectsService from '../services/projects.service';

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
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProjectState] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsService.getAll();
      setProjects(data);
      
      // If no active project is set, or current active project is not in the list, set the first one
      const storedActiveId = localStorage.getItem('activeProjectId');
      const found = data.find((p: Project) => p.id === storedActiveId);
      
      if (found) {
        setActiveProjectState(found);
      } else if (data.length > 0) {
        setActiveProjectState(data[0]);
        localStorage.setItem('activeProjectId', data[0].id);
      } else {
        setActiveProjectState(null);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      activeProject, 
      loading, 
      setActiveProject, 
      refreshProjects, 
      createProject 
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
