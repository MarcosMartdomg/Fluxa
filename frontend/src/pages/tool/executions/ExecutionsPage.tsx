import './ExecutionsPage.css';
import { Play, CheckCircle, XCircle, Clock } from 'lucide-react';

const ExecutionsPage = () => {
  const executions = [
    { id: 'ex_1', workflow: 'Welcome Email', status: 'COMPLETED', started: '2 mins ago', duration: '1.4s' },
    { id: 'ex_2', workflow: 'Shopify Sync', status: 'FAILED', started: '10 mins ago', duration: '0.8s' },
    { id: 'ex_3', workflow: 'Welcome Email', status: 'RUNNING', started: 'Just now', duration: '-' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Executions</h1>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Workflow</th>
              <th className="px-6 py-4">Started</th>
              <th className="px-6 py-4">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {executions.map((ex) => (
              <tr key={ex.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  {ex.status === 'COMPLETED' && <span className="flex items-center gap-2 text-emerald-600"><CheckCircle className="w-4 h-4" /> Success</span>}
                  {ex.status === 'FAILED' && <span className="flex items-center gap-2 text-red-600"><XCircle className="w-4 h-4" /> Failed</span>}
                  {ex.status === 'RUNNING' && <span className="flex items-center gap-2 text-blue-600"><Clock className="w-4 h-4 animate-spin-slow" /> Running</span>}
                </td>
                <td className="px-6 py-4 font-medium">{ex.workflow}</td>
                <td className="px-6 py-4 text-slate-500">{ex.started}</td>
                <td className="px-6 py-4 text-slate-500">{ex.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExecutionsPage;
