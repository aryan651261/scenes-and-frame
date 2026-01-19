
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { mockApi } from '../services/mockApi.js';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await mockApi.login(email);
      setUser(user);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      alert('Authentication error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-gray-50/50">
      <div className="max-w-xl w-full bg-white border border-gray-100 p-16 rounded-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
        <div className="text-center mb-16">
            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.6em] mb-4 block">{isLogin ? 'Welcome Back' : 'Initiate Membership'}</span>
            <h2 className="font-serif text-5xl font-black italic tracking-tighter">{isLogin ? 'Login' : 'Join'}</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-4">{isLogin ? 'Access your private collection archive' : 'Become a part of the 2026 collective'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {!isLogin && (
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4">Full Identity</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-[1.5rem] px-8 py-5 outline-none transition-all font-bold text-sm"
                placeholder="Ex. Vincent van Gogh"
              />
            </div>
          )}
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4">Digital Registry (Email)</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-[1.5rem] px-8 py-5 outline-none transition-all font-bold text-sm"
              placeholder="curator@scenesframe.com"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4">Secret Phrase</label>
            <input 
              required
              type="password" 
              className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-[1.5rem] px-8 py-5 outline-none transition-all font-bold text-sm"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-red-600 transition-all shadow-2xl disabled:opacity-50 mt-8"
          >
            {loading ? 'Validating...' : (isLogin ? 'Proceed to Vault' : 'Secure Membership')}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{isLogin ? "New to the collective?" : "Already recognized?"}</p>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-red-600 font-black uppercase tracking-[0.3em] text-[10px] hover:underline"
          >
            {isLogin ? 'Create Archive Access' : 'Sign in to Archive'}
          </button>
        </div>
        
        <div className="mt-12 p-8 bg-gray-900 rounded-[2.5rem] text-center border border-white/5">
            <span className="text-[9px] text-red-600 font-black uppercase tracking-[0.5em] block mb-3 underline">Administrator Bypass</span>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed italic">Login with "admin@sf.com" to access the command center.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
