import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';
import WorkflowBuilder from '../workflow-builder/WorkflowBuilder';

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
        <WorkflowBuilder projectId={id} />
      </div>
    </div>
  );
};

export default ProjectCanvasPage;