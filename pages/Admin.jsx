
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { OrderStatus } from '../types.js';
import { mockApi } from '../services/mockApi.js';
import { CATEGORIES, SIZES, FRAME_TYPES } from '../constants.jsx';

const Admin = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('products');
  const [activeChat, setActiveChat] = useState(null);
  const [adminMsg, setAdminMsg] = useState('');
  
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    refreshData();
  }, [user, navigate]);

  const refreshData = async () => {
    const p = await mockApi.getProducts();
    const o = await mockApi.getOrders();
    setProducts(p);
    setOrders(o);
    if (activeChat) {
        const updated = o.find(ord => ord.id === activeChat.id);
        if (updated) setActiveChat(updated);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    await mockApi.saveProduct(editingProduct);
    refreshData();
    setEditingProduct(null);
  };

  const handleUpdateStatus = async (orderId, status) => {
    await mockApi.updateOrderStatus(orderId, status);
    refreshData();
  };

  const handleReply = async () => {
    if (!activeChat || !adminMsg.trim() || !user) return;
    await mockApi.sendMessage(activeChat.id, adminMsg, true, user.id);
    setAdminMsg('');
    refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="font-serif text-4xl mb-2 font-black italic uppercase tracking-tighter">Command Center</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Scenes & Frame HQ • 2026</p>
        </div>
        <div className="bg-gray-100 p-1 rounded-2xl flex gap-1 shadow-inner">
          <button 
            onClick={() => setView('products')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'products' ? 'bg-white text-gray-900 shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setView('orders')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'orders' ? 'bg-white text-gray-900 shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Orders & Chat
          </button>
        </div>
      </div>

      {view === 'products' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-400">Warehouse Status</h3>
              <button 
                onClick={() => setEditingProduct({ name: '', price: 0, category: 'Movie', images: ['https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80'], sizes: SIZES, frameTypes: FRAME_TYPES, description: '', stock: 10 })}
                className="bg-red-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg"
              >
                + Create Masterpiece
              </button>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-400 uppercase text-[9px] tracking-[0.3em] font-black border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5">Piece</th>
                            <th className="px-8 py-5 text-center">Price</th>
                            <th className="px-8 py-5 text-center">Stock</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50/50 group transition-colors">
                                <td className="px-8 py-4 flex items-center gap-4">
                                    <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                        <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900">{p.name}</span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{p.category}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-center font-black text-gray-900">₹{p.price}</td>
                                <td className="px-8 py-4 text-center">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{p.stock} units</span>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <button onClick={() => setEditingProduct(p)} className="text-red-600 font-black text-[10px] uppercase tracking-widest hover:underline mr-4">Edit</button>
                                    <button onClick={() => mockApi.deleteProduct(p.id).then(refreshData)} className="text-gray-300 hover:text-red-600 transition-colors text-[10px] font-black uppercase">Del</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          <div>
            {editingProduct && (
              <div className="bg-white border border-gray-100 p-10 rounded-3xl shadow-2xl sticky top-24 border-t-4 border-t-red-600">
                <h3 className="font-serif text-2xl mb-8 italic font-black text-gray-900">Edit Frame</h3>
                <form onSubmit={handleSaveProduct} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Title</label>
                    <input 
                      required
                      value={editingProduct.name}
                      onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent focus:border-red-600 rounded-xl px-4 py-3 text-sm outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Price (₹)</label>
                      <input 
                        type="number"
                        value={editingProduct.price}
                        onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})}
                        className="w-full bg-gray-50 border border-transparent focus:border-red-600 rounded-xl px-4 py-3 text-sm outline-none font-black"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Stock</label>
                      <input 
                        type="number"
                        value={editingProduct.stock}
                        onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                        className="w-full bg-gray-50 border border-transparent focus:border-red-600 rounded-xl px-4 py-3 text-sm outline-none font-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Category</label>
                    <select 
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent focus:border-red-600 rounded-xl px-4 py-3 text-sm outline-none font-bold"
                    >
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg text-[11px]">Save Piece</button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="w-full py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600">Cancel</button>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-6">Dispatch Queue</h3>
            {orders.map(order => (
              <div 
                key={order.id} 
                className={`bg-white border p-8 rounded-3xl shadow-sm space-y-6 transition-all cursor-pointer ${activeChat?.id === order.id ? 'border-red-600 ring-2 ring-red-50' : 'border-gray-100 hover:border-gray-200'}`}
                onClick={() => setActiveChat(order)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-black text-xl text-gray-900">#{order.id}</span>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <select 
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="text-[10px] font-black bg-gray-100 border-none rounded-lg px-4 py-2 outline-none uppercase tracking-widest shadow-sm"
                  >
                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[9px] text-gray-400 uppercase mb-1">Customer ID</p>
                    <p className="text-gray-800 truncate">{order.userId}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[9px] text-gray-400 uppercase mb-1">Total</p>
                    <p className="text-red-600">₹{order.total}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                <img src={item.product.images[0]} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <button className="text-[10px] font-black text-red-600 uppercase tracking-widest group">
                        Manage Chat <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
                    </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            {activeChat ? (
              <div className="bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
                <div className="p-8 bg-gray-900 text-white">
                    <div className="flex justify-between items-center">
                        <h4 className="font-serif text-2xl italic font-black tracking-tighter">Order #{activeChat.id}</h4>
                        <button onClick={() => setActiveChat(null)} className="text-white/40 hover:text-white">✕</button>
                    </div>
                </div>

                <div className="flex-grow p-8 overflow-y-auto space-y-6 bg-gray-50/30">
                    {activeChat.messages.length === 0 ? (
                        <div className="text-center py-10 text-gray-300 text-xs italic">No messages yet.</div>
                    ) : (
                        activeChat.messages.map(m => (
                            <div key={m.id} className={`flex ${m.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-5 py-3 rounded-2xl shadow-sm text-sm ${m.isAdmin ? 'bg-red-600 text-white' : 'bg-white border border-gray-100'}`}>
                                    <p>{m.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-8 border-t border-gray-100">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={adminMsg}
                            onChange={(e) => setAdminMsg(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                            placeholder="Reply..."
                            className="flex-grow bg-gray-50 border border-transparent focus:border-red-600 rounded-xl px-4 py-3 text-sm outline-none"
                        />
                        <button onClick={handleReply} className="bg-gray-900 text-white px-6 rounded-xl font-black uppercase text-[10px]">Reply</button>
                    </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
                <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Select an Order to Chat</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
