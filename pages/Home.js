
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import htm from 'htm';
import { CATEGORIES } from '../constants.js';
import { mockApi } from '../services/mockApi.js';
import ProductCard from '../components/ProductCard.js';

const html = htm.bind(React.createElement);

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    mockApi.getProducts().then(all => setFeatured(all.filter(p => p.featured).slice(0, 4)));
  }, []);

  return html`
    <div className="pb-32">
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img src="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover opacity-50 transition-transform duration-[10s] hover:scale-110" alt="Cinematic Backdrop" />
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <div className="inline-block mb-8 px-6 py-2 bg-brand/30 backdrop-blur-md border border-brand/50 rounded-full text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">2026 Collection</div>
          <h1 className="font-serif text-7xl md:text-[10rem] mb-8 italic font-black tracking-tighter leading-[0.9]">Art for the <br/> Visionary.</h1>
          <p className="text-sm md:text-lg font-medium mb-16 max-w-xl mx-auto opacity-70 leading-relaxed uppercase tracking-[0.3em]">Curating premium cinematic frames for the modern eye.</p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <${Link} to="/custom-poster" className="bg-brand text-white px-14 py-6 rounded-full font-black uppercase tracking-[0.4em] transition-all transform hover:scale-105 shadow-[0_20px_60px_-15px_rgba(211,0,0,0.4)] text-[11px]">Create Custom Poster</${Link}>
            <${Link} to="/category/Movie" className="bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white border border-white/20 px-14 py-6 rounded-full font-black uppercase tracking-[0.4em] transition-all text-[11px]">Explore Movies</${Link}>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-40">
        <div className="text-center mb-24">
          <span className="text-brand font-black text-[10px] uppercase tracking-[0.6em] mb-4 block">Collections</span>
          <h2 className="font-serif text-6xl md:text-7xl font-black italic tracking-tighter text-gray-900">Aesthetic Mastery</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          ${CATEGORIES.map(c => html`
            <${Link} key=${c.value} to=${c.custom ? '/custom-poster' : `/category/${c.value}`} className="relative group overflow-hidden rounded-[3rem] aspect-[4/5] shadow-2xl bg-gray-100">
              <img src=${c.img} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt=${c.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-12">
                <h3 className="text-white font-black text-3xl uppercase tracking-tighter italic leading-none group-hover:text-brand transition-colors">${c.name}</h3>
                <p className="text-brand text-[9px] font-black mt-6 uppercase tracking-[0.5em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">${c.custom ? 'Upload Now' : 'Explore Archives'}</p>
              </div>
            </${Link}>
          `)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-56">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 border-b border-gray-100 pb-16 gap-10">
          <div>
            <span className="text-brand font-black text-[10px] uppercase tracking-[0.6em] mb-4 block">Limited Run</span>
            <h2 className="font-serif text-6xl font-black italic tracking-tighter text-gray-900 leading-tight">Trending <br/> Artifacts</h2>
          </div>
          <${Link} to="/category/Movie" className="bg-gray-50 hover:bg-brand/5 text-gray-400 hover:text-brand px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">View All Registry</${Link}>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          ${featured.map(p => html`<${ProductCard} key=${p.id} product=${p} />`)}
        </div>
      </section>
    </div>
  `;
}
