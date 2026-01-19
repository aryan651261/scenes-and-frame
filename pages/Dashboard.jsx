
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { OrderStatus } from '../types.js';
import { mockApi } from '../services/mockApi.js';

const Dashboard = () => {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    mockApi.getOrders(user.id).then(setOrders);
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const handleSendMessage = async () => {
    if (!selectedOrder || !msg.trim() || !user) return;
    await mockApi.sendMessage(selectedOrder.id, msg, false, user.id);
    const updatedOrders = await mockApi.getOrders(user.id);
    setOrders(updatedOrders);
    const updatedSelected = updatedOrders.find(o => o.id === selectedOrder.id);
    if (updatedSelected) setSelectedOrder(updatedSelected);
    setMsg('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
        <div>
          <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.6em] mb-4 block">Client Portal 2026</span>
          <h1 className="font-serif text-6xl font-black italic tracking-tighter leading-none">Welcome, {user?.name}</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-6">Your premium archive and consultation history.</p>
        </div>
        <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 hover:bg-red-50 border-2 border-red-100 px-8 py-3 rounded-2xl transition-all">Sign Out</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        {/* Order List */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-300 mb-10">Historical Ledger</h3>
          {orders.length === 0 ? (
            <div className="p-16 bg-gray-50 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Registry Empty.</p>
            </div>
          ) : (
            orders.map(order => (
              <button 
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`w-full text-left p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${selectedOrder?.id === order.id ? 'border-red-600 bg-red-50/50 shadow-2xl scale-105' : 'border-gray-50 hover:border-gray-100 bg-white'}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="font-black text-xl italic tracking-tighter">#{order.id}</span>
                  <span className={`text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] ${order.status === OrderStatus.DELIVERED ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Artifacts</div>
                <div className="font-black text-2xl mt-4 italic tracking-tighter">₹{order.total}</div>
              </button>
            ))
          )}
        </div>

        {/* Details & Chat */}
        <div className="lg:col-span-2 h-full min-h-[700px]">
          {selectedOrder ? (
            <div className="bg-white border border-gray-100 rounded-[3.5rem] overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="p-10 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-3xl font-black italic tracking-tighter">Artifact Manifest</h2>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-[0.4em]">Tracking #{selectedOrder.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-red-600 font-black uppercase tracking-[0.4em] mb-2">Current State</p>
                    <p className="font-black text-2xl italic tracking-tighter">{selectedOrder.status}</p>
                  </div>
              </div>

              <div className="p-10 space-y-10 overflow-y-auto flex-grow max-h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Items</h4>
                        <div className="space-y-4">
                            {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs font-bold uppercase tracking-widest bg-gray-50 p-4 rounded-2xl">
                                <span>{item.product.name} ({item.size}) x{item.quantity}</span>
                                <span className="font-black text-red-600">₹{item.product.price * item.quantity}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Destination</h4>
                        <div className="p-6 bg-gray-50 rounded-2xl text-[10px] font-bold leading-relaxed uppercase tracking-wider text-gray-500">
                            {selectedOrder.address}
                            <div className="mt-4 pt-4 border-t border-gray-100 text-gray-900 font-black">
                                {selectedOrder.phone}
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              {/* Chat UI */}
              <div className="mt-auto border-t border-gray-100 p-10 bg-[#0f0f0f] text-white">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-red-600">Artisan Consultation</h4>
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Secured 2026</span>
                </div>
                <div className="h-64 overflow-y-auto space-y-6 mb-10 pr-4 scroll-smooth">
                  {selectedOrder.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-20">
                        <div className="text-4xl">💬</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Consultation History Blank.</p>
                    </div>
                  ) : (
                    selectedOrder.messages.map(m => (
                      <div key={m.id} className={`flex ${m.isAdmin ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] px-6 py-4 rounded-[2rem] text-xs font-bold uppercase tracking-wider leading-relaxed ${m.isAdmin ? 'bg-white text-gray-900 shadow-xl' : 'bg-red-600 text-white shadow-xl shadow-red-900/20'}`}>
                          {m.text}
                          <div className={`text-[8px] mt-2 font-black ${m.isAdmin ? 'text-gray-400' : 'text-red-200'}`}>
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Consult with our curators..."
                    className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-red-600 focus:bg-white/10 transition-all font-bold"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="bg-red-600 text-white px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-xl"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-4 border-dashed border-gray-50 rounded-[4rem] p-24 text-center">
              <div>
                <div className="text-6xl mb-10 opacity-10">✨</div>
                <h3 className="font-serif text-3xl font-black italic tracking-tighter text-gray-200 mb-4">Focus Required.</h3>
                <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">Select an artifact from the ledger to view its journey.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
