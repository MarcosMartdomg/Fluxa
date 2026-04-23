import React from 'react';
import { BookOpen } from 'lucide-react';

const DocSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-12">
    <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] mb-4 px-1">{title}</h2>
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden px-6 py-2">
      {children}
    </div>
  </div>
);

const DocItem = ({ title, description, badge }: { title: string, description: string, badge?: string }) => (
  <div className="py-4 border-b border-gray-100 last:border-0">
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-[13px] font-bold text-gray-900">{title}</h3>
      {badge && (
        <span className="text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100">
          {badge}
        </span>
      )}
    </div>
    <p className="text-[12px] text-gray-500 font-medium leading-relaxed">{description}</p>
  </div>
);

const DocumentationPage = () => {
  return (
    <div className="py-12 px-6 max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-5 border border-gray-100">
          <BookOpen className="w-5 h-5 text-gray-400" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Documentation</h1>
        <p className="text-sm text-gray-400 font-medium max-w-sm">
          A quick guide to understanding and using Fluxa automation.
        </p>
      </div>

      <div className="space-y-2">
        <DocSection title="Overview">
          <div className="py-4">
            <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
              Fluxa is a visual automation tool that allows you to connect different apps and automate repetitive tasks without writing code. You build "Workflows" by dragging and dropping blocks (nodes) into a canvas.
            </p>
          </div>
        </DocSection>

        <DocSection title="How it works">
          <DocItem title="1. Trigger" description="The starting event. Defines when the workflow runs (e.g., via Webhook)." />
          <DocItem title="2. Actions" description="A sequence of steps that process data or interact with external services." />
          <DocItem title="3. Execution" description="The automated process where Fluxa runs each action sequentially." />
          <DocItem title="4. Logs" description="A detailed history of every run, showing successes and failures." />
        </DocSection>

        <DocSection title="Creating a Workflow">
          <div className="py-4 space-y-3">
            {[
              'Create a project from the dashboard',
              'Open the builder and add a new node',
              'Choose an action (e.g. Email or HTTP)',
              'Configure the action in the right panel',
              'Test the flow by clicking "Ejecutar"'
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-[13px] text-gray-500 font-medium">
                <span className="w-5 h-5 flex items-center justify-center bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-400 shrink-0">{i+1}</span>
                {step}
              </div>
            ))}
          </div>
        </DocSection>

        <DocSection title="Node States">
          <div className="py-4 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sin Config</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sin Conexión</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Listo</span>
            </div>
          </div>
        </DocSection>

        <DocSection title="Capabilities">
          <DocItem title="Working Now" description="Builder, Manual Execution, HTTP Actions, Delay, Logs." />
          <DocItem title="Coming Soon" description="Scheduling, Conditional Logic, Slack/Discord, Variables." badge="Roadmap" />
        </DocSection>

        <DocSection title="Real Example">
          <div className="py-4">
            <div className="text-[13px] text-gray-500 font-medium space-y-1">
              <p className="flex items-center gap-2">Trigger <span className="text-gray-300">→</span> Webhook Lead</p>
              <p className="flex items-center gap-2">Action <span className="text-gray-300">→</span> Wait 5 minutes</p>
              <p className="flex items-center gap-2">Action <span className="text-gray-300">→</span> Send Slack Alert</p>
            </div>
          </div>
        </DocSection>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 text-center">
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
          Fluxa v0.1.0 • Built for speed
        </p>
      </div>
    </div>
  );
};

export default DocumentationPage;
