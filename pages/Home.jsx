
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants.jsx';
import { mockApi } from '../services/mockApi.js';
import ProductCard from '../components/ProductCard.jsx';

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    mockApi.getProducts().then(all => {
      setFeatured(all.filter(p => p.featured).slice(0, 4));
    });
  }, []);

  return (
    <div className="pb-32">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover brightness-[0.35]"
            alt="Cinematic Frame Background"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <div className="inline-block mb-6 px-4 py-1.5 bg-red-600/20 backdrop-blur-sm border border-red-600/40 rounded-full text-[9px] font-black uppercase tracking-[0.5em]">
            Est. 2026
          </div>
          <h1 className="font-serif text-6xl md:text-9xl mb-8 italic font-black tracking-tighter leading-none">Art for the Bold.</h1>
          <p className="text-base md:text-xl font-medium mb-12 max-w-2xl mx-auto opacity-70 leading-relaxed uppercase tracking-[0.2em]">
            Curating the finest cinematic frames for the modern eye.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/category/Movie" 
              className="bg-[#D30000] hover:bg-red-700 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] transition-all transform hover:scale-105 shadow-2xl text-[10px]"
            >
              Shop Movie Frames
            </Link>
            <Link 
              to="/category/Anime" 
              className="bg-white/5 backdrop-blur-md hover:bg-white/10 text-white border border-white/20 px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] transition-all text-[10px]"
            >
              Explore Anime
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-32">
        <div className="text-center mb-20">
          <span className="text-[#D30000] font-black text-[10px] uppercase tracking-[0.6em] mb-4 block">Collections</span>
          <h2 className="font-serif text-5xl md:text-6xl font-black italic tracking-tighter">Curated Masterpieces</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {CATEGORIES.map(c => (
            <Link key={c.value} to={`/category/${c.value}`} className="relative group overflow-hidden rounded-[2.5rem] aspect-[4/5] shadow-xl">
              <img 
                src={c.img} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                alt={c.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10">
                <h3 className="text-white font-black text-3xl uppercase tracking-tighter italic leading-none">{c.name}</h3>
                <p className="text-[#D30000] text-[9px] font-black mt-4 uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">View Collection</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-48">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 border-b border-gray-100 pb-10 gap-8">
          <div>
            <span className="text-[#D30000] font-black text-[10px] uppercase tracking-[0.6em] mb-4 block">Limited Run</span>
            <h2 className="font-serif text-5xl font-black italic tracking-tight">Trending Frames</h2>
          </div>
          <Link to="/category/Movie" className="bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-[#D30000] px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">View All 2026 Collection</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Aesthetic Section */}
      <section className="bg-[#0a0a0a] text-white mt-48 py-32 px-4 rounded-[4rem] mx-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full text-red-600 fill-current">
                <path d="M 0 100 Q 50 0 100 100 T 200 100" />
            </svg>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-24 relative z-10">
          <div className="group text-center md:text-left">
            <div className="text-5xl mb-10 transition-transform group-hover:-rotate-12 duration-500">✨</div>
            <h4 className="font-black text-[11px] uppercase tracking-[0.4em] mb-6 text-red-600">Premium Quality</h4>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-loose">Every frame is crafted with museum-grade archival ink and 300gsm paper.</p>
          </div>
          <div className="group text-center md:text-left">
            <div className="text-5xl mb-10 transition-transform group-hover:scale-125 duration-500">🚀</div>
            <h4 className="font-black text-[11px] uppercase tracking-[0.4em] mb-6 text-red-600">Rapid Dispatch</h4>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-loose">Shipped securely to your doorstep within 3-5 business days across the globe.</p>
          </div>
          <div className="group text-center md:text-left">
            <div className="text-5xl mb-10 transition-transform group-hover:rotate-12 duration-500">🤝</div>
            <h4 className="font-black text-[11px] uppercase tracking-[0.4em] mb-6 text-red-600">Artisan Support</h4>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-loose">A dedicated concierge team available for all your queries and bespoke orders.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
