import { ArrowLeft, Layout, Check, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';

const CreateWorkflowPage = () => {
  const navigate = useNavigate();
  const { activeProject, createProject, projects } = useProject();
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectCreationError, setProjectCreationError] = useState('');

  const handleCreateProject = async () => {
    const normalizedName = newProjectName.trim();
    if (!normalizedName) return;

    const duplicated = projects.some(
      (project) => project.name.trim().toLowerCase() === normalizedName.toLowerCase(),
    );
    if (duplicated) {
      setProjectCreationError('A project with that name already exists. Use a different name.');
      return;
    }

    try {
      setIsCreatingProject(true);
      setProjectCreationError('');
      const created = await createProject(newProjectName, newProjectDescription.trim() || undefined);
      setNewProjectName('');
      setNewProjectDescription('');
      navigate(PATHS.PROJECT_DETAIL.replace(':id', created.id));
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsCreatingProject(false);
    }
  };

  return (
    <div className="px-6 py-6 animate-in fade-in duration-300">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-4">
          <Link
            to={PATHS.WORKFLOWS}
            className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-400 transition-all hover:border-[#6366F1]/20 hover:text-[#6366F1] hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Project</h1>
            <p className="text-sm font-medium text-gray-500">
              Set up a project and jump straight into the visual board.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-indigo-100 bg-white p-8 shadow-lg shadow-indigo-100/20">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-2xl bg-[#6366F1] p-3 text-white shadow-md shadow-indigo-200">
            <Layout className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Set up your workspace</h2>
            <p className="mt-1 text-sm text-gray-500">
              Create only the project here. Workflows/cards are managed in the visual board.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => {
              setNewProjectName(e.target.value);
              if (projectCreationError) setProjectCreationError('');
            }}
            placeholder="Workspace name (e.g. Marketing)"
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium outline-none transition-colors focus:border-[#6366F1]"
          />
          <textarea
            rows={4}
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
            placeholder="Project description (optional)"
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition-colors focus:border-[#6366F1]"
          />
        </div>

        {projectCreationError && (
          <p className="mt-3 text-sm font-medium text-red-600">{projectCreationError}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500">
            Current selection:{' '}
            <span className="font-semibold text-gray-700">{activeProject?.name ?? 'All Projects'}</span>
          </p>
          <button
            onClick={handleCreateProject}
            disabled={!newProjectName.trim() || isCreatingProject}
            className="inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreatingProject ? (
              'Creating...'
            ) : (
              <>
                <Check className="h-4 w-4" />
                Create project and open board
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Sparkles className="h-4 w-4 text-[#6366F1]" />
          Next step
        </div>
        <p className="mt-2 text-sm text-gray-500">
          After creating the project, you will be redirected to the board where you can move around and
          build your connection cards visually.
        </p>
      </div>
    </div>
  );
};

export default CreateWorkflowPage;
