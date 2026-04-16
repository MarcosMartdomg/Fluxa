import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ModeSwitcher.css';

interface ModeSwitcherProps {
  activeMode: 'editor' | 'executions';
  projectId: string;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ activeMode, projectId }) => {
  const navigate = useNavigate();

  return (
    <div className="mode-switcher-container">
      <div className="mode-switcher-tabs">
        <button
          onClick={() => navigate(`/tool/projects/${projectId}`)}
          className={`mode-switcher-tab ${activeMode === 'editor' ? 'active' : ''}`}
        >
          Editor
        </button>
        <button
          onClick={() => navigate(`/tool/projects/${projectId}/executions`)}
          className={`mode-switcher-tab ${activeMode === 'executions' ? 'active' : ''}`}
        >
          Ejecuciones
        </button>
      </div>
      <div className="mode-switcher-label">
        <span className="mode-switcher-dot" />
        Modo {activeMode === 'editor' ? 'edición' : 'ejecución'} activo
      </div>
    </div>
  );
};

export default ModeSwitcher;
