
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { mockApi } from '../services/mockApi';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await mockApi.login(email);
      setUser(user);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-100 p-10 rounded-3xl shadow-sm">
        <h2 className="font-serif text-3xl mb-2 text-center">{isLogin ? 'Welcome Back' : 'Join the Collective'}</h2>
        <p className="text-center text-gray-400 text-sm mb-10">{isLogin ? 'Sign in to access your collection' : 'Create an account for premium updates'}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-transparent focus:border-red-600 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all"
                placeholder="Leonardo da Vinci"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-transparent focus:border-red-600 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all"
              placeholder="leo@sf.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input 
              required
              type="password" 
              className="w-full bg-gray-50 border border-transparent focus:border-red-600 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-400">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-red-600 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-red-50 rounded-xl text-center">
            <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Dev Tip</p>
            <p className="text-[10px] text-red-400 mt-1 uppercase">Use "admin@sf.com" to login as admin</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
