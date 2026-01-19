
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi.js';
import { useApp } from '../App.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFrame, setSelectedFrame] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      mockApi.getProductById(id).then(data => {
        if (data) {
          setProduct(data);
          setSelectedSize(data.sizes[0]);
          setSelectedFrame(data.frameTypes[0]);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      quantity: qty,
      size: selectedSize,
      frameType: selectedFrame
    });
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-[10px] font-black uppercase tracking-[0.8em] animate-pulse text-gray-300">Curating Masterpiece...</div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 font-black uppercase tracking-widest text-xs">Frame Not Found.</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Images */}
        <div className="space-y-8">
          <div className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-gray-50 shadow-2xl relative">
            <img 
              src={product.images[selectedImage]} 
              className="w-full h-full object-cover transition-all duration-1000"
              alt={product.name}
            />
            <div className="absolute top-8 left-8">
                <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.4em] px-4 py-2 rounded-full shadow-xl">Hand-Pick 2026</span>
            </div>
          </div>
          <div className="flex gap-6 justify-center">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all transform hover:scale-105 ${selectedImage === idx ? 'border-red-600 shadow-xl' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col pt-10">
          <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.6em] mb-4">{product.category} Collection</span>
          <h1 className="font-serif text-6xl font-black italic tracking-tighter mb-8 leading-tight">{product.name}</h1>
          <div className="text-4xl font-black mb-12 tracking-tight">₹{product.price}</div>
          
          <div className="space-y-12 flex-grow">
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 text-gray-400">Dimensions</h4>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(s => (
                  <button 
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-8 py-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedSize === s ? 'border-red-600 bg-red-50 text-red-600 shadow-md' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 text-gray-400">Frame Aesthetics</h4>
              <div className="grid grid-cols-2 gap-3">
                {product.frameTypes.map(ft => (
                  <button 
                    key={ft}
                    onClick={() => setSelectedFrame(ft)}
                    className={`px-6 py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all text-left ${selectedFrame === ft ? 'border-red-600 bg-red-50 text-red-600 shadow-md' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                  >
                    {ft}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-12 pt-4">
                <div>
                    <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-4 text-gray-400">Quantity</h4>
                    <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-2 px-6 shadow-inner">
                        <button onClick={() => setQty(q => Math.max(1, q-1))} className="text-2xl font-black text-gray-400 hover:text-red-600 transition-colors">−</button>
                        <span className="font-black text-xl w-6 text-center">{qty}</span>
                        <button onClick={() => setQty(q => q+1)} className="text-2xl font-black text-gray-400 hover:text-red-600 transition-colors">+</button>
                    </div>
                </div>
            </div>

            <div className="pt-4">
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-4 text-gray-400">Synopsis</h4>
              <p className="text-gray-500 text-sm font-medium leading-[2] uppercase tracking-wider">{product.description}</p>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-6">
            <button 
                onClick={handleAddToCart}
                className="py-6 border-4 border-gray-900 text-gray-900 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-gray-900 hover:text-white transition-all shadow-xl"
            >
              Add to Collection
            </button>
            <button 
                onClick={handleBuyNow}
                className="py-6 bg-red-600 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-red-700 transition-all shadow-2xl"
            >
              Immediate Acquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
