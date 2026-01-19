
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import htm from 'htm';
import { useApp } from '../App.js';
import { mockApi } from '../services/mockApi.js';

const html = htm.bind(React.createElement);

export default function Cart() {
  const { cart, removeFromCart } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const ids = Array.from(new Set(cart.map(i => i.productId)));
      const res = await Promise.all(ids.map(id => mockApi.getProductById(id)));
      const map = {};
      res.forEach(p => { if (p) map[p.id] = p; });
      setProducts(map);
    };
    if (cart.length > 0) fetch();
  }, [cart]);

  if (cart.length === 0) return html`
    <div className="max-w-7xl mx-auto px-4 py-40 text-center">
      <h2 className="font-serif text-5xl font-black italic tracking-tighter mb-6">Archive Empty.</h2>
      <${Link} to="/" className="bg-red-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px]">Begin Discovery</${Link}>
    </div>
  `;

  return html`
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <h1 className="font-serif text-6xl font-black italic tracking-tighter mb-20">Your Collection</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        <div className="lg:col-span-2 space-y-8">
          ${cart.map((item, idx) => {
            const p = products[item.productId];
            if (!p) return null;
            return html`
              <div key=${idx} className="flex gap-10 p-8 bg-white border border-gray-100 rounded-[3rem] shadow-sm">
                <img src=${p.images[0]} className="w-40 aspect-[3/4] rounded-[2rem] object-cover shadow-md" />
                <div className="flex-grow flex flex-col justify-between py-2">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-serif text-2xl font-black italic tracking-tight">${p.name}</h3>
                      <button onClick=${() => removeFromCart(idx)} className="text-gray-300 hover:text-red-600">✕</button>
                    </div>
                  </div>
                  <div className="font-black text-2xl italic tracking-tighter">₹${p.price * item.quantity}</div>
                </div>
              </div>
            `;
          })}
        </div>
        <button onClick=${() => navigate('/checkout')} className="h-fit bg-red-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl">Finalize Acquisition</button>
      </div>
    </div>
  `;
}
