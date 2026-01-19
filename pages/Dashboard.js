
import React, { useEffect, useState } from 'react';
import htm from 'htm';
import { useApp } from '../App.js';
import { mockApi } from '../services/mockApi.js';

const html = htm.bind(React.createElement);

export default function Dashboard() {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) mockApi.getOrders(user.id).then(setOrders);
  }, [user]);

  return html`
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <h1 className="font-serif text-6xl font-black italic tracking-tighter mb-20">Registry: ${user?.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        ${orders.map(o => html`
          <div key=${o.id} className="p-8 bg-white border border-gray-100 rounded-[3rem] shadow-sm">
            <h3 className="font-black text-xl italic tracking-tighter mb-4">Order #${o.id}</h3>
            <p className="text-red-600 font-black uppercase text-[10px] tracking-widest">${o.status}</p>
          </div>
        `)}
      </div>
    </div>
  `;
}
