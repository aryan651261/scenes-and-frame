
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
        setSelectedSize(data.sizes[0]);
        setSelectedFrame(data.frameTypes[0]);
      }
    });
  }, [id]);

  if (!product) return html`<div className="p-20 text-center uppercase font-black text-xs tracking-widest">Loading artifact...</div>`;

  return html`
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-8">
          <div className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-gray-50 shadow-2xl relative">
            <img src=${product.images[selectedImage]} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col pt-10">
          <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.6em] mb-4">${product.category} Collection</span>
          <h1 className="font-serif text-6xl font-black italic tracking-tighter mb-8 leading-tight">${product.name}</h1>
          <div className="text-4xl font-black mb-12 tracking-tight">₹${product.price}</div>
          <button onClick=${() => { addToCart({ productId: product.id, quantity: qty, size: selectedSize, frameType: selectedFrame }); alert('Added!'); }} className="py-6 bg-red-600 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-red-700 transition-all shadow-2xl">Acquire Masterpiece</button>
        </div>
      </div>
    </div>
  `;
}
