
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { mockApi } from '../services/mockApi.js';

const Cart = () => {
  const { cart, removeFromCart, updateCartQty } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const uniqueIds = Array.from(new Set(cart.map(i => i.productId)));
      const results = await Promise.all(uniqueIds.map(id => mockApi.getProductById(id)));
      const map = {};
      results.forEach(p => { if (p) map[p.id] = p; });
      setProducts(map);
      setLoading(false);
    };
    if (cart.length > 0) fetchProducts();
    else setLoading(false);
  }, [cart]);

  const total = cart.reduce((acc, i) => {
    const p = products[i.productId];
    return acc + (p ? p.price * i.quantity : 0);
  }, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-[10px] font-black uppercase tracking-[0.8em] animate-pulse text-gray-300">Synchronizing...</div>
    </div>
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
        <div className="text-8xl mb-12 opacity-10">📦</div>
        <h2 className="font-serif text-5xl font-black italic tracking-tighter mb-6">Collection Empty.</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-12 leading-relaxed">Your curated space awaits its first masterpiece.</p>
        <Link to="/" className="bg-red-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-red-700 transition-all shadow-2xl inline-block">Begin Discovery</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <div className="mb-20">
        <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.6em] mb-4 block">Manifest</span>
        <h1 className="font-serif text-6xl font-black italic tracking-tighter">Your Collection</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item, idx) => {
            const p = products[item.productId];
            if (!p) return null;
            return (
              <div key={`${item.productId}-${idx}`} className="flex flex-col sm:flex-row gap-10 p-8 bg-white border border-gray-100 rounded-[3rem] shadow-sm hover:shadow-xl transition-all">
                <div className="w-full sm:w-40 aspect-[3/4] flex-shrink-0 bg-gray-50 rounded-[2rem] overflow-hidden shadow-md">
                  <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-grow flex flex-col justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-2xl font-black italic tracking-tight text-gray-900">{p.name}</h3>
                      <button onClick={() => removeFromCart(idx)} className="text-gray-300 hover:text-red-600 transition-colors text-2xl">✕</button>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 mt-4 uppercase tracking-[0.4em]">{item.size} • {item.frameType}</p>
                  </div>
                  <div className="flex justify-between items-end mt-10">
                    <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-2 px-6 shadow-inner">
                      <button onClick={() => updateCartQty(idx, -1)} className="text-2xl font-black text-gray-400 hover:text-red-600 transition-colors">−</button>
                      <span className="text-sm font-black">{item.quantity}</span>
                      <button onClick={() => updateCartQty(idx, 1)} className="text-2xl font-black text-gray-400 hover:text-red-600 transition-colors">+</button>
                    </div>
                    <div className="font-black text-2xl tracking-tighter italic">₹{p.price * item.quantity}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#0f0f0f] text-white rounded-[3.5rem] p-12 h-fit space-y-12 sticky top-24 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5">
          <div>
            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.6em] mb-4 block">Summary</span>
            <h3 className="font-serif text-3xl font-black italic tracking-tighter">Order Specs</h3>
          </div>
          <div className="space-y-6 text-xs font-black uppercase tracking-[0.3em]">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-white">₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="text-red-600">Complimentary</span>
            </div>
            <div className="pt-8 border-t border-white/10 flex justify-between text-2xl font-black italic tracking-tighter">
              <span className="text-gray-400">Total</span>
              <span className="text-white">₹{total}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-red-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-red-700 transition-all shadow-2xl"
          >
            Finalize Acquisition
          </button>
          <div className="flex justify-center items-center gap-4 pt-4">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">End-to-End Encryption Secured</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
