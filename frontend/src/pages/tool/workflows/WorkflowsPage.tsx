import { Plus, GitMerge, MoreVertical, Layout, Play, Clock } from 'lucide-react';
import './WorkflowsPage.css';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import { useProject } from '../../../context/ProjectContext';
import { useState, useEffect } from 'react';
import workflowsService from '../../../services/workflows.service';
import { clsx } from 'clsx';

const WorkflowsPage = () => {
  const { activeProject } = useProject();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true);
        const data = await workflowsService.getAll(activeProject?.id);
        setWorkflows(data);
      } catch (error) {
        console.error('Failed to fetch workflows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [activeProject]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Workflows</h1>
          <p className="text-sm text-slate-500 mt-1">
            {activeProject 
              ? `Manage automations for ${activeProject.name}` 
              : "Manage and monitor your automated sequences"}
          </p>
        </div>
        <Link
          to={PATHS.CREATE_WORKFLOW}
          className="bg-[#6366F1] hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-100 text-sm"
        >
          <Plus className="w-4 h-4" />
          New Workflow
        </Link>
      </div>

      {workflows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#D8D8FB] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Layout className="w-8 h-8 text-[#6366F1]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No workflows found</h3>
          <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm">
            {activeProject 
              ? `Start by creating your first automation for the ${activeProject.name} project.`
              : "Select a project or create a new one to start building automations."}
          </p>
          <Link
            to={PATHS.CREATE_WORKFLOW}
            className="inline-flex items-center gap-2 text-[#6366F1] font-bold hover:underline py-2"
          >
            Create your first workflow <Plus className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#6366F1] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-[#D8D8FB] transition-colors">
                  <GitMerge className="w-6 h-6 text-[#6366F1]" />
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-[#6366F1] transition-colors line-clamp-1">
                {workflow.name}
              </h3>
              <p className="text-sm text-gray-400 mb-6 line-clamp-2 h-10 leading-relaxed">
                {workflow.description || "No description provided for this workflow."}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </div>
                </div>
                <Link 
                  to={`/workflows/${workflow.id}`} 
                  className="text-xs font-bold text-[#6366F1] hover:underline"
                >
                  View Editor
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowsPage;
