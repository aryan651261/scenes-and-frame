
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockApi } from '../services/mockApi.js';
import ProductCard from '../components/ProductCard.jsx';
import { SIZES, FRAME_TYPES } from '../constants.jsx';

const Category = () => {
  const { type } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    size: 'All',
    frameType: 'All'
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <div className="mb-20 border-b border-gray-100 pb-12">
        <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">2026 Collection</span>
        <h1 className="font-serif text-6xl font-black italic tracking-tighter">{type} Frames</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-4">Discover our handpicked {type?.toLowerCase()} cinematic scenes.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-12">
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 text-gray-900">Sort By</h4>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-red-600 shadow-sm transition-all"
            >
              <option value="default">Default Order</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 text-gray-900">Price Ceiling (₹{filters.priceRange[1]})</h4>
            <div className="space-y-6">
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="100"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }))}
                className="w-full accent-red-600 h-1"
              />
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>₹0</span>
                <span>₹5,000</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 text-gray-900">Dimensions</h4>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setFilters(p => ({ ...p, size: 'All' }))}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.size === 'All' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                All
              </button>
              {SIZES.map(s => (
                <button 
                  key={s}
                  onClick={() => setFilters(p => ({ ...p, size: s }))}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.size === s ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 text-gray-900">Frame Style</h4>
            <div className="space-y-4">
              <label className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest cursor-pointer group">
                <input 
                  type="radio" 
                  checked={filters.frameType === 'All'} 
                  onChange={() => setFilters(p => ({ ...p, frameType: 'All' }))}
                  className="accent-red-600 w-4 h-4"
                />
                <span className="group-hover:text-red-600 transition-colors">All Styles</span>
              </label>
              {FRAME_TYPES.map(ft => (
                <label key={ft} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest cursor-pointer group">
                  <input 
                    type="radio" 
                    checked={filters.frameType === ft} 
                    onChange={() => setFilters(p => ({ ...p, frameType: ft }))}
                    className="accent-red-600 w-4 h-4"
                  />
                  <span className="group-hover:text-red-600 transition-colors">{ft}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
              <div className="text-5xl mb-6 grayscale opacity-20">🖼️</div>
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[11px]">No matching frames found.</p>
              <button 
                onClick={() => { setFilters({ priceRange: [0, 5000], size: 'All', frameType: 'All' }); setSortBy('default'); }}
                className="mt-8 text-red-600 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-red-50 px-8 py-3 rounded-xl transition-all"
              >
                Reset Curators Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
