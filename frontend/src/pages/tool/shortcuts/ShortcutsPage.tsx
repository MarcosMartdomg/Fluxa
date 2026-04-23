import React from 'react';
import { Keyboard } from 'lucide-react';
import { SHORTCUTS_DATA } from '../../../constants/shortcuts';

const ShortcutItem = ({ keys, description }: { keys: string[]; description: string }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <span className="text-[13px] text-gray-500 font-medium">{description}</span>
    <div className="flex items-center gap-1.5">
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <kbd className="px-2 py-1 rounded border border-gray-200 bg-gray-50 text-[10px] font-sans font-bold text-gray-600 min-w-[24px] flex items-center justify-center shadow-sm">
            {key}
          </kbd>
          {index < keys.length - 1 && <span className="text-gray-300 text-[10px]">+</span>}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const ShortcutSection = ({ title, context, children }: { title: string, context: string, children: React.ReactNode }) => (
  <div className="mb-10">
    <div className="px-1 mb-4">
      <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">{title}</h2>
      <p className="text-[10px] text-gray-400 font-medium italic">{context}</p>
    </div>
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden px-5">
      {children}
    </div>
  </div>
);

const ShortcutsPage = () => {
  return (
    <div className="py-12 px-6 max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-5 border border-gray-100">
          <Keyboard className="w-5 h-5 text-gray-400" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Keyboard Shortcuts</h1>
        <p className="text-sm text-gray-400 font-medium max-w-sm">
          A quick reference for essential commands to speed up your workflow.
        </p>
      </div>

      <div className="space-y-2">
        {SHORTCUTS_DATA.map((section) => (
          <ShortcutSection key={section.title} title={section.title} context={section.context}>
            {section.shortcuts.map((shortcut) => (
              <ShortcutItem 
                key={shortcut.description} 
                keys={shortcut.keys} 
                description={shortcut.description} 
              />
            ))}
          </ShortcutSection>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 text-center">
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
          More shortcuts coming soon
        </p>
      </div>
    </div>
  );
};

export default ShortcutsPage;
