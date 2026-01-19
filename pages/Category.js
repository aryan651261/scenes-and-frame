
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import htm from 'htm';
import { mockApi } from '../services/mockApi.js';
import ProductCard from '../components/ProductCard.js';
import { SIZES, FRAME_TYPES } from '../constants.js';

const html = htm.bind(React.createElement);

export default function Category() {
  const { type } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({ priceRange: [0, 5000], size: 'All', frameType: 'All' });

  useEffect(() => {
    mockApi.getProducts(type).then(data => {
      setProducts(data);
      setFilteredProducts(data);
    });
  }, [type]);

  useEffect(() => {
    let result = products.filter(p => {
      const matchPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      const matchSize = filters.size === 'All' || p.sizes.includes(filters.size);
      const matchFrame = filters.frameType === 'All' || p.frameTypes.includes(filters.frameType);
      return matchPrice && matchSize && matchFrame;
    });
    if (sortBy === 'low-high') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'high-low') result.sort((a, b) => b.price - a.price);
    setFilteredProducts(result);
  }, [filters, sortBy, products]);

  return html`
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <div className="mb-20 border-b border-gray-100 pb-12">
        <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">2026 Collection</span>
        <h1 className="font-serif text-6xl font-black italic tracking-tighter">${type} Frames</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-12">
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 text-gray-900">Sort By</h4>
            <select value=${sortBy} onChange=${(e) => setSortBy(e.target.value)} className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-red-600 shadow-sm transition-all">
              <option value="default">Default Order</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 text-gray-900">Dimensions</h4>
            <div className="flex flex-wrap gap-3">
              ${['All', ...SIZES].map(s => html`
                <button key=${s} onClick=${() => setFilters(f => ({ ...f, size: s }))} className=${`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.size === s ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>${s}</button>
              `)}
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            ${filteredProducts.map(p => html`<${ProductCard} key=${p.id} product=${p} />`)}
          </div>
        </div>
      </div>
    </div>
  `;
}
