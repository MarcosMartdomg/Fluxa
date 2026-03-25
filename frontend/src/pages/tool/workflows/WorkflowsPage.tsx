import { Plus, GitMerge, MoreVertical } from 'lucide-react';
import './WorkflowsPage.css';
import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const WorkflowsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Workflows</h1>
          <p className="text-sm text-slate-500">Manage and monitor your automated sequences</p>
        </div>
        <Link
          to={PATHS.CREATE_WORKFLOW}
          className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Workflow
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
                <GitMerge className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              </div>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Customer Welcome Email</h3>
            <p className="text-sm text-slate-500 mb-4">Triggers when a new user registers on the platform.</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                Active
              </span>
              <Link to={`/workflows/${i}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowsPage;
