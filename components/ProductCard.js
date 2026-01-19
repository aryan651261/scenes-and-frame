
import React from 'react';
import { Link } from 'react-router-dom';
import htm from 'htm';

const html = htm.bind(React.createElement);

export default function ProductCard({ product }) {
  return html`
    <${Link} to="/product/${product.id}" className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-sm transition-all duration-700 hover:shadow-2xl hover:scale-[1.02]">
        <img src=${product.images[0]} alt=${product.name} className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
        
        <!-- Offer Badge -->
        ${product.offerText && html`
          <div className="absolute top-6 right-6 z-10">
            <div className="bg-brand text-white px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.3em] shadow-2xl animate-pulse">
              ${product.offerText}
            </div>
          </div>
        `}

        <div className="absolute top-6 left-6">
          <span className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase text-gray-900 shadow-sm">
            ${product.category}
          </span>
        </div>
      </div>
      <div className="mt-8 space-y-2 px-2">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 group-hover:text-brand transition-colors">
          ${product.name}
        </h3>
        <div className="flex items-center gap-4">
          <p className="text-xl font-black text-gray-900 italic tracking-tighter">₹${product.price}</p>
        </div>
      </div>
    </${Link}>
  `;
}
