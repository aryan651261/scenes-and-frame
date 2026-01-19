
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import htm from 'htm';
import { Logo, CATEGORIES, SIZES, FRAME_TYPES } from '../constants.js';
import { mockApi } from '../services/mockApi.js';
import { useApp } from '../App.js';

const html = htm.bind(React.createElement);

const AdminSidebar = () => html`
  <div className="w-72 bg-gray-900 text-white min-h-screen flex flex-col p-8 fixed">
    <div className="mb-16"><${Logo} light /></div>
    <nav className="flex flex-col gap-2 flex-grow">
      <${Link} to="/admin" className="px-6 py-4 hover:bg-white/5 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest">Dashboard</${Link}>
      <${Link} to="/admin/products" className="px-6 py-4 hover:bg-white/5 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest">Inventory</${Link}>
      <${Link} to="/admin/orders" className="px-6 py-4 hover:bg-white/5 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest">Client Orders</${Link}>
      <${Link} to="/admin/custom-posters" className="px-6 py-4 hover:bg-white/5 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest">Bespoke Submissions</${Link}>
    </nav>
    <${Link} to="/" className="mt-auto px-6 py-4 text-brand text-[10px] font-black uppercase tracking-[0.3em] hover:underline">Exit Portal</${Link}>
  </div>
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, custom: 0 });
  useEffect(() => {
    mockApi.getProducts().then(p => mockApi.getOrders().then(o => mockApi.getCustomPosters().then(c => setStats({ products: p.length, orders: o.length, custom: c.length }))));
  }, []);

  return html`
    <div className="p-12 space-y-12">
      <div className="flex flex-col gap-2">
        <span className="text-brand font-black text-[10px] uppercase tracking-[0.5em]">Command Center</span>
        <h1 className="font-serif text-5xl font-black italic tracking-tighter text-gray-900">Operations Overview</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
          <h3 className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-6">Total Stock Variants</h3>
          <p className="font-serif text-7xl font-black italic tracking-tighter text-gray-900">${stats.products}</p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
          <h3 className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-6">Order Volume</h3>
          <p className="font-serif text-7xl font-black italic tracking-tighter text-brand">${stats.orders}</p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
          <h3 className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-6">Bespoke Requests</h3>
          <p className="font-serif text-7xl font-black italic tracking-tighter text-gray-900">${stats.custom}</p>
        </div>
      </div>
    </div>
  `;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const refresh = () => mockApi.getProducts().then(setProducts);
  useEffect(() => { refresh(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditing({ ...editing, images: [reader.result] });
      reader.readAsDataURL(file);
    }
  };

  const save = (e) => {
    e.preventDefault();
    mockApi.saveProduct(editing).then(() => { setEditing(null); refresh(); });
  };

  return html`
    <div className="p-12 space-y-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <span className="text-brand font-black text-[10px] uppercase tracking-[0.5em]">Inventory System</span>
          <h1 className="font-serif text-5xl font-black italic tracking-tighter text-gray-900">Product Archive</h1>
        </div>
        <button onClick=${() => setEditing({ name: '', price: 0, category: 'Movie', images: [''], description: '', sizes: [], frameTypes: [], stock: 0 })} className="bg-brand text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition-all">+ Add Masterpiece</button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        ${products.map(p => html`
          <div key=${p.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg flex items-center justify-between group hover:shadow-2xl transition-all">
            <div className="flex items-center gap-8">
              <img src=${p.images[0]} className="w-20 h-28 object-cover rounded-xl shadow-md" />
              <div>
                <h3 className="font-serif text-2xl font-black italic tracking-tight">${p.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">${p.category} • ₹${p.price} • ${p.stock} units</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick=${() => setEditing(p)} className="text-gray-400 hover:text-brand font-black text-[10px] uppercase tracking-widest">Edit</button>
              <button onClick=${() => mockApi.deleteProduct(p.id).then(refresh)} className="text-gray-200 hover:text-red-600 font-black text-[10px] uppercase tracking-widest">Purge</button>
            </div>
          </div>
        `)}
      </div>

      ${editing && html`
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-white rounded-[3.5rem] w-full max-w-2xl p-16 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="font-serif text-4xl font-black italic mb-10">Specs Configuration</h2>
            <form onSubmit=${save} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-3">Title</label>
                <input required value=${editing.name} onChange=${e => setEditing({...editing, name: e.target.value})} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold" />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-3">Category</label>
                <select value=${editing.category} onChange=${e => setEditing({...editing, category: e.target.value})} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold">
                  ${CATEGORIES.filter(c => !c.custom).map(c => html`<option value=${c.value}>${c.name}</option>`)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-3">Price (₹)</label>
                <input type="number" value=${editing.price} onChange=${e => setEditing({...editing, price: parseInt(e.target.value)})} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-3">Product Image Upload</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
                    ${editing.images[0] ? html`<img src=${editing.images[0]} className="w-full h-full object-cover" />` : html`<span className="text-2xl opacity-10">📷</span>`}
                  </div>
                  <input type="file" accept="image/*" onChange=${handleFileChange} className="text-[9px] font-black uppercase tracking-widest" />
                </div>
              </div>
              <div className="md:col-span-2 flex gap-4 mt-6">
                <button type="submit" className="flex-grow bg-brand text-white py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest">Commit to Registry</button>
                <button type="button" onClick=${() => setEditing(null)} className="px-10 py-5 border border-gray-100 rounded-[2rem] font-black uppercase text-[10px] tracking-widest">Discard</button>
              </div>
            </form>
          </div>
        </div>
      `}
    </div>
  `;
};

const AdminOrders = () => {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [msg, setMsg] = useState('');

  const refresh = () => mockApi.getOrders().then(setOrders);
  useEffect(() => { refresh(); }, []);

  const send = () => {
    if (!msg.trim()) return;
    mockApi.sendMessage(activeChat.id, msg, true, user.id).then(() => { setMsg(''); refresh(); mockApi.getOrders().then(os => setActiveChat(os.find(x => x.id === activeChat.id))); });
  };

  return html`
    <div className="p-12 space-y-12 flex h-screen">
      <div className="w-1/2 space-y-12 overflow-y-auto pr-10">
        <div className="flex flex-col gap-2">
          <span className="text-brand font-black text-[10px] uppercase tracking-[0.5em]">Logistics Portal</span>
          <h1 className="font-serif text-5xl font-black italic tracking-tighter text-gray-900">Registry Ledger</h1>
        </div>
        <div className="space-y-6">
          ${orders.map(o => html`
            <div key=${o.id} onClick=${() => setActiveChat(o)} className=${`p-8 rounded-[2.5rem] border transition-all cursor-pointer ${activeChat?.id === o.id ? 'border-brand bg-brand/5 shadow-2xl scale-[1.02]' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
              <div className="flex justify-between items-center mb-6">
                <span className="font-serif text-2xl font-black italic tracking-tighter">#${o.id}</span>
                <select onClick=${e => e.stopPropagation()} value=${o.status} onChange=${e => mockApi.updateOrderStatus(o.id, e.target.value).then(refresh)} className="text-[9px] font-black uppercase tracking-widest bg-gray-50 rounded-full px-4 py-2 border-none">
                  <option value="PLACED">Placed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Asset Value: ₹${o.total}</div>
            </div>
          `)}
        </div>
      </div>
      <div className="w-1/2 bg-gray-50 rounded-[4rem] p-10 flex flex-col border border-gray-100 shadow-inner">
        ${activeChat ? html`
          <div className="flex flex-col h-full">
            <h3 className="font-serif text-3xl font-black italic tracking-tighter mb-8">Consultation: ${activeChat.id}</h3>
            <div className="flex-grow overflow-y-auto space-y-4 pr-4 pb-10">
              ${activeChat.messages.map(m => html`
                <div key=${m.id} className=${`flex ${m.isAdmin ? 'justify-end' : 'justify-start'}`}>
                  <div className=${`max-w-[85%] px-6 py-4 rounded-3xl text-xs font-bold ${m.isAdmin ? 'bg-brand text-white' : 'bg-white text-gray-900 shadow-md'}`}>
                    ${m.text}
                  </div>
                </div>
              `)}
            </div>
            <div className="mt-auto flex gap-4 pt-6">
              <input value=${msg} onChange=${e => setMsg(e.target.value)} onKeyPress=${e => e.key === 'Enter' && send()} placeholder="Admin response..." className="flex-grow bg-white rounded-2xl px-6 py-4 text-xs font-bold shadow-sm" />
              <button onClick=${send} className="bg-gray-900 text-white px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest">Send</button>
            </div>
          </div>
        ` : html`
          <div className="h-full flex items-center justify-center text-center">
            <p className="text-gray-300 font-black text-[10px] uppercase tracking-[0.5em]">Select an artifact to begin consultation</p>
          </div>
        `}
      </div>
    </div>
  `;
};

const AdminCustomPosters = () => {
  const [posters, setPosters] = useState([]);
  const refresh = () => mockApi.getCustomPosters().then(setPosters);
  useEffect(() => { refresh(); }, []);

  const handleStatusChange = (id, status) => {
    mockApi.updateCustomPosterStatus(id, status).then(refresh);
  };

  return html`
    <div className="p-12 space-y-12 overflow-y-auto h-screen">
      <div className="flex flex-col gap-2">
        <span className="text-brand font-black text-[10px] uppercase tracking-[0.5em]">Bespoke Management</span>
        <h1 className="font-serif text-5xl font-black italic tracking-tighter text-gray-900">Custom Submissions</h1>
      </div>

      <div className="grid grid-cols-1 gap-10">
        ${posters.map(p => html`
          <div key=${p.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-64 aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl bg-gray-50 flex-shrink-0">
              <img src=${p.image} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-3xl font-black italic tracking-tighter">${p.id}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Submitted by: ${p.userEmail}</p>
                </div>
                <select 
                  value=${p.status} 
                  onChange=${e => handleStatusChange(p.id, e.target.value)} 
                  className="bg-gray-50 border-none rounded-full px-6 py-3 text-[9px] font-black uppercase tracking-widest shadow-sm outline-none"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Overlay Typography</h4>
                <p className="font-serif text-2xl font-black italic text-gray-900">${p.customText || 'No text provided.'}</p>
              </div>

              <div className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                Created on: ${new Date(p.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        `)}
      </div>

      ${posters.length === 0 && html`
        <div className="p-32 text-center opacity-10">
          <p className="text-5xl">📫</p>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-8">No bespoke submissions yet.</p>
        </div>
      `}
    </div>
  `;
};

export default function AdminPortal() {
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/auth');
  }, [user]);

  if (!user || user.role !== 'admin') return null;

  return html`
    <div className="flex bg-white min-h-screen">
      <${AdminSidebar} />
      <div className="ml-72 flex-grow">
        <${Routes}>
          <${Route} path="/" element=${html`<${AdminDashboard} />`} />
          <${Route} path="/products" element=${html`<${AdminProducts} />`} />
          <${Route} path="/orders" element=${html`<${AdminOrders} />`} />
          <${Route} path="/custom-posters" element=${html`<${AdminCustomPosters} />`} />
        </${Routes}>
      </div>
    </div>
  `;
}
