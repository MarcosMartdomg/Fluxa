import { Bot } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12 bg-white/50">
      <h1 className="text-[38px] font-bold text-gray-900 mb-14 text-center tracking-tight">
        What would you like to automate?
      </h1>

      <div className="w-full max-w-[720px] bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
          <Bot className="w-4 h-4 text-gray-400" />
          <span className="text-[13px] font-bold text-gray-700">Chatgpt</span>
        </div>
        
        <div className="p-6">
          <textarea
            rows={5}
            className="w-full border-none focus:ring-0 text-gray-500 placeholder-gray-300 resize-none text-[15px] font-medium leading-relaxed"
            placeholder="Describe your automation..."
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


