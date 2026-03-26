import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import authService from '../../services/auth.service';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await authService.register({ 
        email, 
        password,
        name: email.split('@')[0] // Default name from email
      });
      navigate(PATHS.LOGIN);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar la cuenta. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white py-12 px-4 shadow-xl shadow-brand-500/5 sm:rounded-xl sm:px-12 border border-gray-100 flex flex-col items-center">
          
          <Link to="/" className="flex justify-center mb-6">
            <img src="/images/logo.png" alt="Fluxa Logo" className="h-[40px] w-auto" />
          </Link>
          
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
            Registrar Cuenta
          </h2>

          <form className="space-y-5 w-full" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Correo <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm" 
                placeholder="Introduce tu correo electrónico" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm" 
                placeholder="Introduce tu contraseña" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Repetir contraseña <span className="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm" 
                placeholder="Introduce tu contraseña" 
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#6366F1] hover:bg-[#5254e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Cargando...' : 'Continuar'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 w-full text-center">
            <p className="text-sm text-[#6366F1]">
              <Link to={PATHS.LOGIN} className="hover:underline">
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300 w-full text-center">
            <p className="text-xs font-medium text-gray-500">
              ©2026 Fluxa experience.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

