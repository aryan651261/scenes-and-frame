
import React, { useState, useEffect } from 'react';
import htm from 'htm';
import { mockApi } from '../services/mockApi.js';
import { useApp } from '../App.js';

const html = htm.bind(React.createElement);

export default function Dashboard() {
  const { user, setUser } = useApp();
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [msg, setMsg] = useState('');

  const refresh = () => mockApi.getOrders(user?.id).then(setOrders);
  useEffect(() => { refresh(); }, [user]);

  const send = () => {
    if (!msg.trim()) return;
    mockApi.sendMessage(activeOrder.id, msg, false, user.id).then(() => { setMsg(''); refresh(); mockApi.getOrders(user.id).then(os => setActiveOrder(os.find(x => x.id === activeOrder.id))); });
  };

  return html`
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <div className="flex justify-between items-end mb-20 border-b border-gray-100 pb-12">
        <div className="flex flex-col gap-2">
          <span className="text-brand font-black text-[10px] uppercase tracking-[0.5em]">Private Access</span>
          <h1 className="font-serif text-6xl font-black italic tracking-tighter">Client Archive</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-4">Welcome back, Curator ${user?.name}</p>
        </div>
        <button onClick=${() => { setUser(null); }} className="text-gray-400 hover:text-brand font-black uppercase text-[10px] tracking-widest pb-2 underline">Sign Out</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="w-full lg:w-1/3 space-y-6">
          <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-300 mb-10">Historical Ledger</h3>
          ${orders.map(o => html`
            <div key=${o.id} onClick=${() => setActiveOrder(o)} className=${`p-8 rounded-[2.5rem] border transition-all cursor-pointer ${activeOrder?.id === o.id ? 'border-brand bg-brand/5' : 'border-gray-50 bg-white hover:border-gray-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="font-black italic tracking-tighter text-xl text-gray-900">#${o.id}</span>
                <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-full">${o.status}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Acquisition Value: ₹${o.total}</p>
            </div>
          `)}
        </div>

        <div className="flex-grow bg-gray-50 rounded-[4rem] p-12 min-h-[600px] flex flex-col border border-gray-100 shadow-inner">
          ${activeOrder ? html`
            <div className="flex flex-col h-full">
              <div className="mb-10 flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-3xl font-black italic tracking-tighter text-gray-900 mb-2">Registry Tracking</h3>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Manifest ID: ${activeOrder.id}</p>
                </div>
                <div className="text-right">
                  <span className="text-brand font-black text-[10px] uppercase tracking-[0.4em] block mb-2">State</span>
                  <p className="font-serif text-2xl font-black italic tracking-tighter text-gray-900">${activeOrder.status}</p>
                </div>
              </div>
              <div className="flex-grow overflow-y-auto space-y-6 pr-4 mb-10">
                ${activeOrder.messages.map(m => html`
                  <div key=${m.id} className=${`flex ${m.isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <div className=${`max-w-[85%] px-6 py-4 rounded-3xl text-xs font-bold leading-relaxed shadow-sm ${m.isAdmin ? 'bg-white text-gray-900 border border-gray-100' : 'bg-brand text-white'}`}>
                      ${m.text}
                      <span className="block text-[8px] mt-2 opacity-40 uppercase font-black">${m.isAdmin ? 'Curator Team' : 'You'}</span>
                    </div>
                  </div>
                `)}
              </div>
              <div className="mt-auto pt-8 border-t border-gray-200/50 flex gap-4">
                <input value=${msg} onChange=${e => setMsg(e.target.value)} onKeyPress=${e => e.key === 'Enter' && send()} placeholder="Consult with curators..." className="flex-grow bg-white rounded-2xl px-6 py-5 text-xs font-bold shadow-sm outline-none focus:ring-2 focus:ring-brand/10 transition-all" />
                <button onClick=${send} className="bg-gray-900 text-white px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand transition-all">Send</button>
              </div>
            </div>
          ` : html`
            <div className="h-full flex items-center justify-center text-center opacity-30">
              <p className="font-black text-[10px] uppercase tracking-[0.6em]">Select an order to begin consultation</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
