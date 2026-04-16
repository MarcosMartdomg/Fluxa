import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Folder, 
  Activity, 
  Zap, 
  Clock, 
  ArrowRight,
  Command,
  HelpCircle,
  Layout,
  Wrench
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

interface SearchResult {
  id: string;
  name: string;
  category: 'Projects' | 'Workflows' | 'Executions' | 'Actions' | 'Help';
  path: string;
  description?: string;
}

const MOCK_DATA: SearchResult[] = [
  { id: 'p1', name: 'Email Automation', category: 'Projects', path: '/tool/projects/p1', description: 'Main workspace for sales team' },
  { id: 'p2', name: 'Customer Support', category: 'Projects', path: '/tool/projects/p2', description: 'Internal ticket management' },
  { id: 'w1', name: 'Sync Gmail to Sheets', category: 'Workflows', path: '/tool/workflows/w1', description: 'Active • 4 steps' },
  { id: 'w2', name: 'Slack Notification', category: 'Workflows', path: '/tool/workflows/w2', description: 'Paused • 2 steps' },
  { id: 'e1', name: 'Success: Gmail Sync', category: 'Executions', path: '/tool/executions/e1', description: 'Completed 2m ago' },
  { id: 'e2', name: 'Failed: Webhook Handler', category: 'Executions', path: '/tool/executions/e2', description: 'Failed 15m ago' },
  { id: 'a1', name: 'Send Email', category: 'Actions', path: '#', description: 'Gmail Integration' },
  { id: 'a2', name: 'Create Trello Card', category: 'Actions', path: '#', description: 'Trello Integration' },
  { id: 'h1', name: 'Getting Started Guide', category: 'Help', path: '#', description: 'Documentation' },
  { id: 'h2', name: 'Keyboard Shortcuts', category: 'Help', path: '#', description: 'Documentation' },
];

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) return MOCK_DATA.slice(0, 6); // Show "Recent" if query is empty
    return MOCK_DATA.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle global shortcut (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle keyboard navigation within dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredResults.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          navigate(filteredResults[selectedIndex].path);
          setIsOpen(false);
          inputRef.current?.blur();
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, navigate]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex-1 flex justify-center px-4 max-w-xl mx-auto relative hidden md:flex" ref={containerRef}>
      <div className={clsx(
        "w-full flex items-center gap-2 px-3 h-9 bg-gray-50 border rounded-lg transition-all duration-200 group relative z-50",
        "focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50 focus-within:bg-white",
        !isOpen && "border-gray-100 hover:bg-gray-100 hover:border-gray-200",
        isOpen && "border-indigo-400 ring-2 ring-indigo-50 bg-white"
      )}>
        <Search className={clsx(
          "w-4 h-4 transition-colors",
          isOpen ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-600"
        )} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          placeholder="Search for anything..."
          className="flex-1 bg-transparent border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-0 text-sm font-medium text-gray-800 placeholder-gray-400 p-0"
        />
        {!isOpen && (
          <div className="flex items-center gap-1 opacity-60">
            <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-sans">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-sans">K</kbd>
          </div>
        )}
        {isOpen && query && (
          <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
          <div className="max-h-[400px] overflow-y-auto py-2 scrollbar-thin">
            {filteredResults.length > 0 ? (
              <div className="flex flex-col">
                {query === '' && (
                  <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Recently opened
                  </div>
                )}

                {filteredResults.map((result, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = {
                    Projects: Folder,
                    Workflows: Zap,
                    Executions: Activity,
                    Actions: Wrench,
                    Help: HelpCircle
                  }[result.category] || Layout;

                  return (
                    <button
                      key={result.id}
                      className={clsx(
                        "flex items-center px-3 py-2.5 mx-2 rounded-lg text-left transition-all group",
                        isSelected ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50 text-gray-700"
                      )}
                      onClick={() => {
                        navigate(result.path);
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className={clsx(
                        "w-8 h-8 rounded-md flex items-center justify-center mr-3 transition-colors",
                        isSelected ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm truncate">{result.name}</span>
                        </div>
                        <div className={clsx(
                          "text-[11px] truncate",
                          isSelected ? "text-indigo-500/80" : "text-gray-400"
                        )}>
                          {result.category} • {result.description}
                        </div>
                      </div>

                      {isSelected && (
                        <ArrowRight className="w-3.5 h-3.5 ml-2 text-indigo-400 animate-in slide-in-from-left-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <Search className="w-8 h-8 text-gray-200 mb-2" />
                <p className="text-gray-900 text-sm font-semibold">No results for "{query}"</p>
                <p className="text-gray-400 text-xs mt-1">Try another search term.</p>
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="bg-gray-50/50 px-4 py-2 border-t border-gray-100 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[9px] text-gray-500 shadow-sm leading-none">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[9px] text-gray-500 shadow-sm leading-none">↓</kbd>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[9px] text-gray-500 shadow-sm leading-none whitespace-nowrap">Enter</kbd>
              <span className="text-[10px] text-gray-400 font-medium">Open</span>
            </div>
            <div className="ml-auto opacity-40">
              <Zap className="w-3 h-3 text-indigo-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
