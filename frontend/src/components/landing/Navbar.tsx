import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-5 h-5 text-white" 
                stroke="currentColor" 
                strokeWidth="3"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Fluxa</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-brand-600">Home</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Product</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Features</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Use Cases</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Docs</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Pricing</a>
          </div>

          <div>
            <Link
              to={PATHS.LOGIN}
              className="px-6 py-2 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
