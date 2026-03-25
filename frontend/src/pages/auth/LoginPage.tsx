import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import AuthLayout from '../../components/auth/AuthLayout';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your account to continue"
    >
      <form className="space-y-6">
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
            Sign In
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to={PATHS.REGISTER} className="font-medium text-brand-600 hover:text-brand-500">
            Register now
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
