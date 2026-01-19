
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { Product } from '../types';
import { mockApi } from '../services/mockApi';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    mockApi.getProducts().then(all => {
      setFeatured(all.filter(p => p.featured).slice(0, 4));
    });
  }, []);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover brightness-[0.4]"
            alt="Cinematic Frame Background"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <div className="inline-block mb-4 px-3 py-1 bg-red-600/20 backdrop-blur-sm border border-red-600/30 rounded-full text-[10px] font-black uppercase tracking-[0.4em]">
            Est. 2026
          </div>
          <h1 className="font-serif text-5xl md:text-8xl mb-6 italic font-black tracking-tighter">Art for the Bold.</h1>
          <p className="text-lg md:text-2xl font-light mb-10 max-w-2xl mx-auto opacity-80 leading-relaxed">
            Curating the finest cinematic frames and high-definition masterpieces for the modern eye.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link 
              to="/category/Movie" 
              className="bg-[#D30000] hover:bg-red-700 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all transform hover:scale-105 shadow-2xl text-xs"
            >
              Shop Movie Frames
            </Link>
            <Link 
              to="/category/Anime" 
              className="bg-white/5 backdrop-blur-md hover:bg-white/10 text-white border border-white/20 px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all text-xs"
            >
              Explore Anime
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-24">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-black italic mb-4">Curated Collections</h2>
          <div className="w-24 h-1 bg-[#D30000] mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map(c => (
            <Link key={c.value} to={`/category/${c.value}`} className="relative group overflow-hidden rounded-3xl aspect-[4/5] shadow-lg">
              <img 
                src={c.img} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt={c.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic">{c.name}</h3>
                <p className="text-[#D30000] text-[10px] font-black mt-2 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-transform">View Collection</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-40">
        <div className="flex items-end justify-between mb-16 border-b border-gray-100 pb-8">
          <div>
            <span className="text-[#D30000] font-black text-[10px] uppercase tracking-[0.5em]">Editor's Selection</span>
            <h2 className="font-serif text-4xl mt-3 font-black italic">Featured Masterpieces</h2>
          </div>
          <Link to="/category/Movie" className="text-gray-400 hover:text-[#D30000] text-[10px] font-black uppercase tracking-widest transition-colors pb-1">View All Frames</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-gray-900 text-white mt-40 py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="group">
            <div className="text-4xl mb-6 transition-transform group-hover:-rotate-12">✨</div>
            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-3">Premium Quality</h4>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">Every frame is crafted with museum-grade archival ink and 300gsm paper.</p>
          </div>
          <div className="group">
            <div className="text-4xl mb-6 transition-transform group-hover:scale-125">🚀</div>
            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-3">Rapid Dispatch</h4>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">Shipped securely to your doorstep within 3-5 business days across the globe.</p>
          </div>
          <div className="group">
            <div className="text-4xl mb-6 transition-transform group-hover:rotate-12">🤝</div>
            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-3">Artisan Support</h4>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">A dedicated concierge team available for all your queries and bespoke orders.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
