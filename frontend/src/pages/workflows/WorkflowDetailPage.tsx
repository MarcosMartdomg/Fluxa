import { ArrowLeft, Play, Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const WorkflowDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={PATHS.WORKFLOWS} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Welcome Email</h1>
            <p className="text-sm text-slate-500">ID: {id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button className="p-2 text-red-500 hover:text-red-700 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Play className="w-4 h-4 fill-white" />
            Run Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-semibold mb-6">Workflow Canvas</h3>
            {/* Workflow steps visualization placeholder */}
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold">T</div>
                <div>
                  <p className="font-medium">Trigger: Webhook</p>
                  <p className="text-sm text-orange-600">Endpoint active</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200 mx-auto"></div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white font-bold">A</div>
                <div>
                  <p className="font-medium">Action: Send Email</p>
                  <p className="text-sm text-blue-600">Postmark Template</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-semibold mb-4">Configuration</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last run</span>
                <span>2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Created</span>
                <span>Mar 24, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetailPage;
