
import React from 'react';
import { Link } from 'react-router-dom';
import htm from 'htm';

const html = htm.bind(React.createElement);

export default function ProductCard({ product }) {
  return html`
    <${Link} to="/product/${product.id}" className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-shadow hover:shadow-xl">
        <img src=${product.images[0]} alt=${product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 left-4">
          <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase text-gray-900">
            ${product.category}
          </span>
        </div>
      </div>
      <div className="mt-6 space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 group-hover:text-red-600 transition-colors">
          ${product.name}
        </h3>
        <p className="text-lg font-black text-gray-900">₹${product.price}</p>
      </div>
    </${Link}>
  `;
}
