
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import htm from 'htm';
import { mockApi } from '../services/mockApi.js';
import { useApp } from '../App.js';

const html = htm.bind(React.createElement);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFrame, setSelectedFrame] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    mockApi.getProductById(id).then(data => {
      if (data) {
        setProduct(data);
        setSelectedSize(data.sizes[0] || '8x10');
        setSelectedFrame(data.frameTypes[0] || 'Classic Black');
      }
    });
  }, [id]);

  if (!product) return html`<div className="p-20 text-center uppercase font-black text-[10px] tracking-[0.8em] animate-pulse">Synchronizing Artifact...</div>`;

  return html`
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <div className="space-y-10 sticky top-32">
          <div className="aspect-[3/4] rounded-[4rem] overflow-hidden bg-gray-50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative group">
            <img src=${product.images[selectedImage]} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            ${product.offerText && html`
               <div className="absolute top-10 right-10">
                 <div className="bg-brand text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">
                    ${product.offerText}
                 </div>
               </div>
            `}
          </div>
          <div className="flex gap-6 justify-center">
            ${product.images.map((img, idx) => html`
              <button 
                key=${idx}
                onClick=${() => setSelectedImage(idx)}
                className=${`w-24 h-24 rounded-3xl overflow-hidden border-4 transition-all duration-500 ${selectedImage === idx ? 'border-brand shadow-xl scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                <img src=${img} className="w-full h-full object-cover" />
              </button>
            `)}
          </div>
        </div>
        
        <div className="flex flex-col pt-10">
          <div className="space-y-2 mb-10">
            <span className="text-brand font-black text-[10px] uppercase tracking-[0.6em]">${product.category} Collection</span>
            <h1 className="font-serif text-7xl font-black italic tracking-tighter leading-none text-gray-900">${product.name}</h1>
          </div>
          
          <div className="flex items-baseline gap-6 mb-16">
            <div className="text-5xl font-black tracking-tighter italic">₹${product.price}</div>
            ${product.offerText && html`
               <div className="text-brand font-black text-[11px] uppercase tracking-[0.3em] animate-pulse">
                 // ${product.offerText}
               </div>
            `}
          </div>
          
          <div className="space-y-16">
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.4em] mb-8 text-gray-300">Specifications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Dimensions</p>
                  <div className="flex flex-wrap gap-3">
                    ${product.sizes.map(s => html`
                      <button 
                        key=${s}
                        onClick=${() => setSelectedSize(s)}
                        className=${`px-8 py-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedSize === s ? 'border-brand bg-brand/5 text-brand shadow-lg' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                      >${s}</button>
                    `)}
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Frame Aesthetic</p>
                  <div className="flex flex-wrap gap-3">
                    ${product.frameTypes.map(ft => html`
                      <button 
                        key=${ft}
                        onClick=${() => setSelectedFrame(ft)}
                        className=${`px-8 py-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedFrame === ft ? 'border-brand bg-brand/5 text-brand shadow-lg' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                      >${ft}</button>
                    `)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-300">Manifesto</h4>
               <p className="text-gray-500 text-sm font-medium leading-[2.2] uppercase tracking-wider max-w-xl">
                 ${product.description}
               </p>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row gap-6">
              <button 
                onClick=${() => { addToCart({ productId: product.id, quantity: qty, size: selectedSize, frameType: selectedFrame }); alert('Artifact secured in collection.'); }} 
                className="flex-grow py-8 border-4 border-gray-900 text-gray-900 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-[11px] hover:bg-gray-900 hover:text-white transition-all duration-500"
              >
                Add to Registry
              </button>
              <button 
                onClick=${() => { addToCart({ productId: product.id, quantity: qty, size: selectedSize, frameType: selectedFrame }); navigate('/cart'); }}
                className="flex-grow py-8 bg-brand text-white rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-[11px] hover:bg-red-700 transition-all duration-500 shadow-[0_20px_50px_-15px_rgba(211,0,0,0.4)]"
              >
                Immediate Acquisition
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
