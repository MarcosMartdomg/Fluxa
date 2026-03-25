import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import AuthLayout from '../../components/auth/AuthLayout';
import './RegisterPage.css';

const RegisterPage = () => {
  return (
    <AuthLayout 
      title="Create account" 
      subtitle="Join Fluxa to start automating your workflows"
    >
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <div className="mt-1">
            <input 
              type="text" 
              required 
              className="auth-input" 
              placeholder="John Doe" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email address</label>
          <div className="mt-1">
            <input 
              type="email" 
              required 
              className="auth-input" 
              placeholder="user@example.com" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="mt-1">
            <input 
              type="password" 
              required 
              className="auth-input" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <div>
          <button 
            type="button" 
            className="auth-button"
          >
            Create Account
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to={PATHS.LOGIN} className="font-medium text-brand-600 hover:text-brand-500">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
