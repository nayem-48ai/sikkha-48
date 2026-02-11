import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, resetPassword } from '../services/authService';
import { Mail, Lock, User, UserPlus, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await registerUser(email, password, username);
      } else {
        await loginUser(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message.includes('auth/user-not-found') ? "No account found with this email." : "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) return setError("Please enter your email first.");
    try {
      await resetPassword(email);
      setResetSent(true);
      setError('');
    } catch (err: any) {
      setError("Reset failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px]"></div>

      <div className="glass w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl border-white animate-slide-up relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-[2rem] shadow-2xl mb-6">
            <i className={`fas ${isRegister ? 'fa-user-plus' : 'fa-graduation-cap'} text-3xl`}></i>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{isRegister ? 'Join Sikkha48' : 'Welcome Back'}</h1>
          <p className="text-gray-500 font-bold mt-2">
            {isRegister ? 'Create your student profile today' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-8 flex items-center gap-3 text-sm font-bold border border-red-100 animate-pulse">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {resetSent && (
          <div className="bg-green-50 text-green-700 px-4 py-4 rounded-xl mb-8 flex flex-col gap-2 text-sm font-bold border border-green-100 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> Reset link sent!
            </div>
            <div className="mt-1 p-2 bg-white/50 rounded-lg border border-green-200">
               <p className="text-[10px] text-indigo-900 font-black uppercase tracking-tight leading-relaxed">
                 * Critical: If you don't see it in your <span className="underline decoration-indigo-600 underline-offset-2">Inbox</span>, please check your <span className="text-red-600 bg-red-50 px-1 rounded">SPAM</span> or Junk folder immediately.
               </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div>
              <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-bold text-gray-900 placeholder:text-gray-400 shadow-sm"
                  placeholder="Enter full name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-bold text-gray-900 placeholder:text-gray-400 shadow-sm"
                placeholder="name@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-bold text-gray-900 placeholder:text-gray-400 shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isRegister && (
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={handleForgot}
                className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-[1.5rem] transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] text-lg uppercase flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-indigo-200 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {isRegister ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                {isRegister ? 'Register' : 'Login Now'}
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-10 font-bold">
          {isRegister ? 'Already have an account?' : "Don't have an account?"} {' '}
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(''); setResetSent(false); }}
            className="font-black text-indigo-600 hover:underline"
          >
            {isRegister ? 'Login Here' : 'Create One'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;