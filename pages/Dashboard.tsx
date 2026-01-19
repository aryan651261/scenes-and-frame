
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Order, OrderStatus } from '../types';
import { mockApi } from '../services/mockApi';

const Dashboard: React.FC = () => {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="font-serif text-4xl mb-2">Welcome, {user?.name}</h1>
          <p className="text-gray-400 text-sm">Your premium frame collection dashboard.</p>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">Logout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Order List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-6">Recent Orders</h3>
          {orders.length === 0 ? (
            <div className="p-8 bg-gray-50 rounded-2xl text-center text-gray-400 text-sm">No orders yet.</div>
          ) : (
            orders.map(order => (
              <button 
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`w-full text-left p-6 rounded-2xl border transition-all ${selectedOrder?.id === order.id ? 'border-red-600 bg-red-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
              >
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-sm">#{order.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Items</div>
                <div className="font-bold mt-2">₹{order.total}</div>
              </button>
            ))
          )}
        </div>

        {/* Order Details & Chat */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col">
              <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">Order Details</h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">#{selectedOrder.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Status</p>
                    <p className="font-bold text-red-600">{selectedOrder.status}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.product.name} ({item.size}) x {item.quantity}</span>
                        <span className="font-bold">₹{item.product.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat UI */}
              <div className="mt-auto border-t border-gray-50 p-8 bg-gray-50/30">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Concierge Chat</h4>
                <div className="h-64 overflow-y-auto space-y-4 mb-6 pr-2">
                  {selectedOrder.messages.length === 0 ? (
                    <p className="text-center text-gray-300 text-xs py-10">Start a conversation with our concierge team.</p>
                  ) : (
                    selectedOrder.messages.map(m => (
                      <div key={m.id} className={`flex ${m.isAdmin ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.isAdmin ? 'bg-white border border-gray-100 text-gray-900' : 'bg-red-600 text-white'}`}>
                          {m.text}
                          <div className={`text-[10px] mt-1 ${m.isAdmin ? 'text-gray-400' : 'text-red-200'}`}>
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-grow bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-600"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center">
              <div>
                <div className="text-4xl mb-4">🖼️</div>
                <p className="text-gray-400">Select an order to view tracking details and chat with support.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
