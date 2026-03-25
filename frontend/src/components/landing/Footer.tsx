import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="3">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Fluxa</span>
            </div>
            <p className="text-sm font-bold text-gray-900 mb-2">
              Automatización inteligente <br /> basada en eventos.
            </p>
            <p className="text-xs text-gray-400">Fluxa 2025</p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-gray-600 hover:text-brand-600">Product</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-brand-600">Features</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-brand-600">Use Cases</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Docs</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-gray-600 hover:text-brand-600">Docs</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-brand-600">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Prueba en el móvil</h4>
            <div className="space-y-3">
              <button className="flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors w-full max-w-[140px]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0v-8.1zm10.749-1.48L24 0v11.551h-13.251V1.969zM24 12.449V24l-13.251-1.899v-9.652H24zM9.75 21.84L0 20.551v-8.1h9.75v9.39z"/></svg>
                Windows
              </button>
              <button className="flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors w-full max-w-[140px]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.039 2.48-4.5 2.597-4.584-1.429-2.08-3.623-2.325-4.415-2.376-1.688-.143-3.025 1.053-3.896 1.053zM14.931 3.64c.78-1.004 1.284-2.37 1.141-3.74-1.182.046-2.616.791-3.46 1.77-.753.858-1.415 2.263-1.234 3.606 1.3.104 2.637-.702 3.553-1.636z"/></svg>
                macOS
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[10px] text-white/80 font-medium">
          <span>©2025 Fluxa experience.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Legal</a>
            <span className="opacity-30">|</span>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
