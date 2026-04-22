import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';
import { ReactFlowProvider } from '@xyflow/react';
import WorkflowBuilder from '../workflow-builder/WorkflowBuilder';
import { ConnectionProvider } from '../../../context/ConnectionContext';

const ProjectCanvasPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, activeProject, setActiveProject } = useProject();

  useEffect(() => {
    if (!id) return;
    const projectInList = projects.find((project) => project.id === id);
    if (projectInList && activeProject?.id !== projectInList.id) {
      setActiveProject(projectInList);
    }
  }, [id, projects, activeProject?.id, setActiveProject]);

  if (!id) return null;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
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