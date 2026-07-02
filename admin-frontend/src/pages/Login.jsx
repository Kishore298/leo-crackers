import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { FaUser, FaLock } from 'react-icons/fa';

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
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#D90429]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
            <img 
              src="/assets/leo-logo.png" 
              alt="Leo Crackers Logo" 
              className="relative w-24 h-24 rounded-full bg-white p-2 object-contain grayscale opacity-90 mx-auto shadow-2xl border-2 border-white/10"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-5xl font-brand text-primary mt-4 tracking-normal drop-shadow-sm">
            Leo Crackers
          </h1>
          <p className="text-text-secondary text-sm mt-2 font-bold uppercase tracking-[0.2em]">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-2/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-heading font-black text-white mb-6 text-center">Secure Login</h2>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={onChange}
                  required
                  placeholder="Username"
                  className="w-full pl-12 pr-4 py-3.5 border border-white/5 bg-[#121215] rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-text-secondary transition-all"
                />
              </div>
            </div>
            <div>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3.5 border border-white/5 bg-[#121215] rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-text-secondary transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-fire-gradient text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,102,0,0.3)] hover:shadow-[0_0_30px_rgba(255,102,0,0.5)] transition-all hover:-translate-y-1 text-lg tracking-wider mt-4"
            >
              {isLoading ? 'AUTHENTICATING...' : 'LOGIN TO DASHBOARD'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-text-secondary font-medium">
              Demo access: <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded">admin</span> / <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded">password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;