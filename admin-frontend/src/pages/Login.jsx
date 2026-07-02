import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { FaFire, FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { username, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || admin) navigate('/');
    dispatch(reset());
  }, [admin, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); dispatch(login({ username, password })); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fire-gradient relative overflow-hidden">
      {/* Background flame orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-dark/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-4 shadow-primary-lg backdrop-blur-sm border border-white/30">
            <FaFire className="text-4xl text-white animate-bounce-subtle" />
          </div>
          <h1 className="text-5xl font-brand font-normal text-white tracking-normal text-center">
            Leo Crackers
          </h1>
          <p className="text-white/70 text-sm mt-1 font-semibold uppercase tracking-widest">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8">
          <h2 className="text-2xl font-heading font-bold text-primary mb-6 text-center">Welcome Back</h2>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Username</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={onChange}
                  required
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 border border-border bg-surface-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-text placeholder-text-secondary/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 border border-border bg-surface-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-text placeholder-text-secondary/50"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-fire text-lg uppercase tracking-wider mt-2"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-xs text-text-secondary mt-6">
            Default: <span className="font-mono font-bold text-primary">admin / password123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;