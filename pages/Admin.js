
import React, { useEffect, useState } from 'react';
import htm from 'htm';
import { mockApi } from '../services/mockApi.js';

const html = htm.bind(React.createElement);

export default function Admin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    mockApi.getOrders().then(setOrders);
  }, []);

  return html`
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <h1 className="font-serif text-6xl font-black italic tracking-tighter mb-20 uppercase">HQ Command</h1>
      <div className="space-y-6">
        ${orders.map(o => html`
          <div key=${o.id} className="p-8 bg-white border border-gray-100 rounded-[3.5rem] flex justify-between items-center shadow-lg">
            <span className="font-black italic tracking-tighter text-2xl">#${o.id}</span>
            <span className="text-red-600 font-black uppercase text-[10px] tracking-[0.4em]">${o.status}</span>
          </div>
        `)}
      </div>
    </div>
  `;
}
