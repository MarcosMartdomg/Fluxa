import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const CreateWorkflowPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={PATHS.WORKFLOWS} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Workflow</h1>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Create
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Workflow Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-brand-500" 
              placeholder="e.g. Sync Shopify to Slack"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-brand-500" 
              placeholder="What does this workflow do?"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4">Workflow Logic</h3>
          <div className="p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400">
            <Plus className="w-8 h-8 mb-2" />
            <p>Add your first trigger to start building</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Need this because I'm using it before it's defined in the snippet
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default CreateWorkflowPage;
