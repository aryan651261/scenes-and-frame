
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product, CategoryType } from '../types';
import { mockApi } from '../services/mockApi';
import ProductCard from '../components/ProductCard';
import { SIZES, FRAME_TYPES } from '../constants';

const Category: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    size: 'All',
    frameType: 'All'
  });

  useEffect(() => {
    mockApi.getProducts(type as CategoryType).then(data => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-serif text-4xl mb-2">{type} Collection</h1>
        <p className="text-gray-500 text-sm">Discover our handpicked {type?.toLowerCase()} frames.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Sort By</h4>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-600"
            >
              <option value="default">Default</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Price Range</h4>
            <div className="space-y-4">
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="100"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }))}
                className="w-full accent-red-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹0</span>
                <span>Max: ₹{filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Size</h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilters(p => ({ ...p, size: 'All' }))}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${filters.size === 'All' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                All
              </button>
              {SIZES.map(s => (
                <button 
                  key={s}
                  onClick={() => setFilters(p => ({ ...p, size: s }))}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${filters.size === s ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Frame Type</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="radio" 
                  checked={filters.frameType === 'All'} 
                  onChange={() => setFilters(p => ({ ...p, frameType: 'All' }))}
                  className="accent-red-600"
                />
                All Types
              </label>
              {FRAME_TYPES.map(ft => (
                <label key={ft} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    checked={filters.frameType === ft} 
                    onChange={() => setFilters(p => ({ ...p, frameType: ft }))}
                    className="accent-red-600"
                  />
                  {ft}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <p className="text-gray-400">No products found matching your filters.</p>
              <button 
                onClick={() => { setFilters({ priceRange: [0, 5000], size: 'All', frameType: 'All' }); setSortBy('default'); }}
                className="mt-4 text-red-600 font-bold text-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
