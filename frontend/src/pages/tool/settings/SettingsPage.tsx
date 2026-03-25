import './SettingsPage.css';
import { User, Shield, Bell, Key } from 'lucide-react';

const SettingsPage = () => {
  const sections = [
    { name: 'Profile', icon: User, desc: 'Update your personal information' },
    { name: 'Security', icon: Shield, desc: 'Manage your password and security settings' },
    { name: 'Notifications', icon: Bell, desc: 'Choose what you want to be notified about' },
    { name: 'API Keys', icon: Key, desc: 'Manage access keys for third-party integrations' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
      
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button key={section.name} className="w-full text-left bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 transition-colors">
                  <Icon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-brand-600 transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{section.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{section.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsPage;
