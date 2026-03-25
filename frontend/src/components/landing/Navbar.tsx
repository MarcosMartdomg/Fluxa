import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const navItems = [
    'Home', 'Product', 'Features', 'Use Cases', 'Docs', 'Pricing'
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Fluxa Logo" className="h-10 w-auto" />
            <span className="text-2xl font-black text-gray-900 tracking-tight">Fluxa</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item);
                }}
                className={`nav-link ${activeTab === item ? 'active' : ''}`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to={PATHS.LOGIN}
              className="login-btn"
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
