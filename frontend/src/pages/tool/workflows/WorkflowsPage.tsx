import { BarChart3, ChevronDown, Check, Filter, Search, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

const WorkflowsPage = () => {
  const [search, setSearch] = useState('');

  const connections = useMemo(
    () => [
      {
        id: 'gmail',
        name: 'Gmail',
        app: 'Gmail',
        version: 'GoogleGmail@1.21',
        updatedAt: 'Mar 3, 2026',
        color: 'bg-red-100 text-red-600',
      },
      {
        id: 'contacts',
        name: 'Google Contacts',
        app: 'Contacts',
        version: 'GoogleContacts@1.21',
        updatedAt: 'Apr 8, 2026',
        color: 'bg-blue-100 text-blue-600',
      },
      {
        id: 'calendar',
        name: 'Google Calendar',
        app: 'Calendar',
        version: 'GoogleCalendar@2.1',
        updatedAt: 'Mar 13, 2026',
        color: 'bg-emerald-100 text-emerald-600',
      },
      {
        id: 'meet',
        name: 'Google Meet',
        app: 'Meet',
        version: 'GoogleMeet@1.6.1',
        updatedAt: 'Mar 27, 2026',
        color: 'bg-yellow-100 text-yellow-700',
      },
    ],
    [],
  );

  const filteredConnections = useMemo(
    () =>
      connections.filter((connection) =>
        connection.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [connections, search],
  );

  return (
    <div className="px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[34px] font-semibold text-slate-800">Conections</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <BarChart3 className="h-4 w-4" />
            View App Reports
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-[#6366F1] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            <Plus className="h-4 w-4" />
            Add a Connection
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-md border border-[#D8D8FB] bg-[#ECECFE] px-3 py-1.5 text-xs font-medium text-[#6366F1]">
              Conections
            </button>
            <button className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
              Apps
            </button>
            <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
              All Conections
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
              <Filter className="h-3.5 w-3.5" />
              Filters
            </button>
          </div>

          <div className="relative w-full sm:w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name"
              className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-[#6366F1]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-semibold text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">App</th>
                <th className="px-4 py-3">Conection</th>
                <th className="px-4 py-3">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              {filteredConnections.map((connection) => (
                <tr key={connection.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${connection.color}`}
                      >
                        {connection.name[0]}
                      </div>
                      <span className="font-medium text-gray-800">{connection.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{connection.app}</p>
                      <p className="text-xs text-gray-500">{connection.version}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{connection.updatedAt}</td>
                </tr>
              ))}
              {filteredConnections.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
                    No connections match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkflowsPage;
