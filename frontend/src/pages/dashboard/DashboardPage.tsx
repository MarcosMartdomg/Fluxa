import { Zap, Play, CheckCircle, Clock } from 'lucide-react';

const DashboardPage = () => {
  const stats = [
    { name: 'Total Workflows', value: '12', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Triggers', value: '8', icon: Play, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Succeeded (24h)', value: '1,284', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Avg. Execution', value: '1.2s', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.name}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Executions</h2>
          <div className="text-sm text-slate-500">List of recent workflow runs...</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Popular Workflows</h2>
          <div className="text-sm text-slate-500">Most active automations...</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
