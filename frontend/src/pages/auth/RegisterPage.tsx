import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">Create account</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="user@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="••••••••" />
          </div>
          <button type="button" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2 rounded-lg transition-colors">
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to={PATHS.LOGIN} className="text-brand-600 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
