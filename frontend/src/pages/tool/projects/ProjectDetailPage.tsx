import { Plus, Layout, GitMerge, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';
import workflowsService from '../../../services/workflows.service';
import { PATHS } from '../../../routes/paths';

interface Project {
  id: string;
  name: string;
  description?: string;
}

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, activeProject, setActiveProject } = useProject();
  const [project, setProject] = useState<Project | null>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const found = projects.find((item) => item.id === id);
    if (found) {
      setProject(found);
      setActiveProject(found);
    }
  }, [id, projects, setActiveProject]);

  useEffect(() => {
    const loadWorkflows = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await workflowsService.getAll(id);
        setWorkflows(data);
      } catch (error) {
        console.error('Failed to fetch workflows for project:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkflows();
  }, [id]);

  if (!id) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">{project ? project.name : activeProject?.name || 'Project'}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {project?.description || 'Manage workflows and automations for this workspace.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(PATHS.WORKFLOWS)}
            className="text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
          >
            View all workflows
          </button>
          <Link
            to={PATHS.CREATE_WORKFLOW}
            className="bg-[#6366F1] hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-100 text-sm"
          >
            <Plus className="w-4 h-4" />
            New Workflow
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workflows.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm text-center col-span-full">
              <div className="w-16 h-16 bg-[#D8D8FB] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Layout className="w-8 h-8 text-[#6366F1]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No workflows yet</h3>
              <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm">
                Create your first workflow inside this workspace to start automating tasks.
              </p>
              <Link
                to={PATHS.CREATE_WORKFLOW}
                className="inline-flex items-center gap-2 text-[#6366F1] font-bold hover:underline py-2"
              >
                Create workflow <Plus className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            workflows.map((workflow) => (
              <div key={workflow.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#6366F1] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-[#D8D8FB] transition-colors">
                    <GitMerge className="w-6 h-6 text-[#6366F1]" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-[#6366F1] transition-colors line-clamp-1">{workflow.name}</h3>
                <p className="text-sm text-gray-400 mb-6 line-clamp-2 h-10 leading-relaxed">{workflow.description || 'No description provided.'}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{workflow.isActive ? 'Active' : 'Paused'}</span>
                  </div>
                  <Link to={`/tool/workflows/${workflow.id}`} className="text-xs font-bold text-[#6366F1] hover:underline">View workflow</Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
