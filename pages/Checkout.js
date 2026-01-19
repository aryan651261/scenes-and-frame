
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import htm from 'htm';
import { useApp } from '../App.js';
import { mockApi } from '../services/mockApi.js';

const html = htm.bind(React.createElement);

export default function Checkout() {
  const { cart, user, clearCart } = useApp();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mockApi.createOrder({ userId: user.id, items: cart, address, total: 1000 });
    clearCart();
    navigate('/dashboard');
    alert('Acquisition successful.');
  };

  return html`
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="font-serif text-5xl font-black italic text-center mb-12">Finalize specs</h1>
      <form onSubmit=${handleSubmit} className="space-y-8">
        <textarea required value=${address} onChange=${e => setAddress(e.target.value)} placeholder="Destination Coordinates (Address)" className="w-full bg-white border border-gray-200 rounded-3xl p-8 outline-none focus:border-red-600 h-40 font-bold" />
        <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px]">Secure Shipment</button>
      </form>
    </div>
  `;
}
