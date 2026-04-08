import { ArrowLeft, Plus, FileText, Zap, Layout, Check } from 'lucide-react';
import './CreateWorkflowPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import workflowsService from '../../../services/workflows.service';

const CreateWorkflowPage = () => {
  const navigate = useNavigate();
  const { activeProject, createProject } = useProject();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return alert('Please enter a name');
    if (!activeProject) return alert('Please create or select a project first');

    try {
      setLoading(true);
      await workflowsService.create({
        name,
        description,
        projectId: activeProject.id
      });
      navigate(PATHS.WORKFLOWS);
    } catch (error) {
      console.error('Failed to create workflow:', error);
      alert('Failed to create workflow. Make sure everything is correct.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      setIsCreatingProject(true);
      await createProject(newProjectName);
      setNewProjectName('');
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsCreatingProject(false);
    }
  };

  return (
    <div className="create-workflow-container animate-in fade-in duration-500">
      {/* Header section */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={PATHS.WORKFLOWS} className="p-2.5 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-[#6366F1] hover:border-[#6366F1]/20 hover:shadow-md transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">New Workflow</h1>
            <p className="text-sm text-gray-400 font-medium">Create a new automation for your project</p>
          </div>
        </div>
        
        <button 
          onClick={handleCreate}
          disabled={loading || !activeProject}
          className="btn-gradient text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-100"
        >
          {loading ? (
            'Creating...'
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Create Workflow</span>
            </>
          )}
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {!activeProject && (
          <div className="mb-8 p-6 bg-white/70 backdrop-blur-md border border-indigo-100 rounded-[32px] shadow-xl shadow-indigo-100/20 animate-in slide-in-from-top-6 duration-700">
             <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 bg-[#6366F1] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
                  <Layout className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Step 1: Set up your Workspace</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    You need to name your workspace/project before you can create your first workflow.
                  </p>
                </div>

                <div className="w-full md:w-auto flex items-center gap-2">
                  <div className="relative group flex-1">
                    <input 
                      type="text" 
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Workspace Name (e.g. Marketing)"
                      className="w-full md:w-80 px-6 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all placeholder:text-gray-300 font-bold text-sm"
                    />
                  </div>
                  <button 
                    onClick={handleCreateProject}
                    disabled={!newProjectName.trim() || isCreatingProject}
                    className="p-3.5 bg-[#6366F1] text-white rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-indigo-200"
                  >
                    {isCreatingProject ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-5 h-5" />}
                  </button>
                </div>
             </div>
          </div>
        )}

        <div className="glass-card rounded-[32px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
          {/* Form Side */}
          <div className="lg:col-span-5 p-10 border-r border-gray-100/50 space-y-10">
            <div className="space-y-6">
              <div>
                <label className="premium-label">
                  <Layout className="w-3.5 h-3.5" />
                  Workflow Name
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="premium-input" 
                    placeholder="e.g. Sync Shopify to Slack"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center text-gray-200 group-focus-within:text-[#6366F1] transition-colors">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>

              <div>
                <label className="premium-label">
                  <FileText className="w-3.5 h-3.5" />
                  Description
                </label>
                <textarea 
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="premium-input resize-none" 
                  placeholder="Tell us what this automation will achieve..."
                />
              </div>

              {activeProject && (
                <div className="pt-6">
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#6366F1] text-white rounded-lg flex items-center justify-center font-bold text-xs">
                      {activeProject.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-[#6366F1]">Selected Project</p>
                      <p className="text-sm font-bold text-gray-700">{activeProject.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-10 border-t border-gray-100/50">
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Ready for configuration</span>
              </div>
            </div>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-7 bg-gray-50/30 canvas-preview-box relative p-12 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
               <Zap className="w-64 h-64 text-[#6366F1]" />
            </div>

            <h3 className="relative z-10 text-[13px] font-black text-gray-400 uppercase tracking-[0.2em] mb-12">Canvas Preview</h3>
            
            <div className="relative h-full">
              {/* Mock Node 1 - Trigger */}
              <div className="workflow-node-mock top-4 left-10">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-[#6366F1]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-indigo-400">Trigger</p>
                  <p className="text-xs font-bold text-gray-600">New Shopify Order</p>
                </div>
              </div>

              {/* Connector line */}
              <div className="absolute top-20 left-[68px] w-0.5 h-32 bg-gray-200 border-dashed border-l" />

              {/* Mock Node 2 - Action */}
              <div className="workflow-node-mock top-52 left-10 delay-300">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500 text-xs font-bold">
                  S
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-green-500">Action</p>
                  <p className="text-xs font-bold text-gray-600">Send Slack Message</p>
                </div>
              </div>

              {/* Mock Node 3 - Add */}
              <div className="absolute bottom-20 right-10 p-10 bg-white/40 backdrop-blur-md rounded-[40px] border border-white/50 shadow-2xl flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-100 mb-6 group cursor-default">
                    <Plus className="w-8 h-8 text-[#6366F1] group-hover:rotate-90 transition-transform" />
                 </div>
                 <p className="text-lg font-bold text-gray-900 mb-2">Build your logic</p>
                 <p className="text-[13px] text-gray-500 font-medium max-w-[200px] leading-relaxed">
                   The full node-based editor will be available once you save the workflow.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkflowPage;
