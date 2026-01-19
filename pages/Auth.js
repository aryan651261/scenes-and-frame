
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import htm from 'htm';
import { useApp } from '../App.js';
import { mockApi } from '../services/mockApi.js';

const html = htm.bind(React.createElement);

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user } = await mockApi.login(email);
    setUser(user);
    navigate(user.role === 'admin' ? '/admin' : '/dashboard');
  };

  return html`
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-gray-50/50">
      <div className="max-w-xl w-full bg-white p-16 rounded-[4rem] shadow-2xl relative overflow-hidden border border-gray-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
        <h2 className="font-serif text-5xl font-black italic tracking-tighter text-center mb-12">${isLogin ? 'Login' : 'Join'}</h2>
        <form onSubmit=${handleSubmit} className="space-y-8">
          <input required type="email" value=${email} onChange=${e => setEmail(e.target.value)} className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-[1.5rem] px-8 py-5 outline-none transition-all font-bold text-sm" placeholder="curator@scenesframe.com" />
          <button type="submit" className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-red-600 transition-all shadow-2xl">Proceed to Vault</button>
        </form>
        <button onClick=${() => setIsLogin(!isLogin)} className="w-full mt-8 text-red-600 font-black uppercase tracking-[0.3em] text-[10px]">${isLogin ? 'Create Archive Access' : 'Sign in to Archive'}</button>
      </div>
    </div>
  `;
}
