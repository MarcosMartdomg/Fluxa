import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';
import { ReactFlowProvider } from '@xyflow/react';
import WorkflowBuilder from '../workflow-builder/WorkflowBuilder';
import { ConnectionProvider } from '../../../context/ConnectionContext';

const ProjectCanvasPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, activeProject, setActiveProject, loading } = useProject();

  useEffect(() => {
    if (!id || loading) return;
    const projectInList = projects.find((project) => project.id === id);
    if (projectInList && activeProject?.id !== projectInList.id) {
      setActiveProject(projectInList);
    }
  }, [id, projects, activeProject?.id, setActiveProject, loading]);

  if (loading || !id || (activeProject && activeProject.id !== id)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        <ConnectionProvider>
          <ReactFlowProvider>
            <WorkflowBuilder projectId={id} />
          </ReactFlowProvider>
        </ConnectionProvider>
      </div>
    </div>
  );
};

export default ProjectCanvasPage;