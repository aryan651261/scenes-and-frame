
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { mockApi } from '../services/mockApi';
import { useApp } from '../App';
import { SIZES, FRAME_TYPES } from '../constants';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
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

  if (loading) return <div className="p-20 text-center text-gray-400">Loading masterpiece...</div>;
  if (!product) return <div className="p-20 text-center text-red-600">Frame not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
            <img 
              src={product.images[selectedImage]} 
              className="w-full h-full object-cover"
              alt={product.name}
            />
          </div>
          <div className="flex gap-4">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-red-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <span className="text-red-600 font-bold text-xs uppercase tracking-widest mb-2">{product.category} Collection</span>
          <h1 className="font-serif text-4xl mb-4">{product.name}</h1>
          <div className="text-2xl font-bold mb-8">₹{product.price}</div>
          
          <div className="space-y-8 flex-grow">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Select Size</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button 
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-6 py-2 rounded-lg border text-sm transition-all ${selectedSize === s ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-200 hover:border-gray-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Select Frame Type</h4>
              <div className="grid grid-cols-2 gap-2">
                {product.frameTypes.map(ft => (
                  <button 
                    key={ft}
                    onClick={() => setSelectedFrame(ft)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all text-left ${selectedFrame === ft ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-200 hover:border-gray-400'}`}
                  >
                    {ft}
                  </button>
                ))}
              </div>
            </div>

            <div>
                <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Quantity</h4>
                <div className="flex items-center gap-4">
                    <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                    <span className="font-bold w-4 text-center">{qty}</span>
                    <button onClick={() => setQty(q => q+1)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
                </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-4">Description</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <button 
                onClick={handleAddToCart}
                className="py-4 border border-red-600 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
            >
              Add to Cart
            </button>
            <button 
                onClick={handleBuyNow}
                className="py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
