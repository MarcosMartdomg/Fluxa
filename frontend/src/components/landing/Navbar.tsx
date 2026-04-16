import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github } from 'lucide-react';
import { PATHS } from '../../routes/paths';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Product', path: PATHS.PRODUCT },
    { name: 'Features', path: PATHS.FEATURES },
    { name: 'Use Cases', path: PATHS.USE_CASES }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-gray-100/50">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="Fluxa Logo" className="h-[28px] w-auto" />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/MarcosMartdomg/Fluxa"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
              aria-label="GitHub Repository"
            >
              <Github size={20} />
            </a>
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
