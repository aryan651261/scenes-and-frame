
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Product } from '../types';
import { mockApi } from '../services/mockApi';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQty } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      // Fix: Add explicit type string[] to uniqueIds to avoid 'unknown' type inference which causes errors when calling mockApi.getProductById
      const uniqueIds: string[] = Array.from(new Set(cart.map(i => i.productId)));
      const results = await Promise.all(uniqueIds.map(id => mockApi.getProductById(id)));
      const map: Record<string, Product> = {};
      results.forEach(p => { if (p) map[p.id] = p; });
      setProducts(map);
      setLoading(false);
    };
    if (cart.length > 0) fetchProducts();
    else setLoading(false);
  }, [cart]);

  const total = cart.reduce((acc, i) => {
    const p = products[i.productId];
    return acc + (p ? p.price * i.quantity : 0);
  }, 0);

  if (loading) return <div className="p-20 text-center">Loading cart...</div>;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="font-serif text-3xl mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any frames to your collection yet.</p>
        <Link to="/" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <h1 className="font-serif text-4xl mb-12">Shopping Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item, idx) => {
            const p = products[item.productId];
            if (!p) return null;
            return (
              <div key={`${item.productId}-${idx}`} className="flex gap-6 p-4 bg-white border border-gray-100 rounded-2xl">
                <div className="w-24 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                  <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-bold text-gray-900">{p.name}</h3>
                      <button onClick={() => removeFromCart(idx)} className="text-gray-400 hover:text-red-600">✕</button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{item.size} • {item.frameType}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateCartQty(idx, -1)} className="w-6 h-6 border rounded-full flex items-center justify-center">-</button>
                      <span className="text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateCartQty(idx, 1)} className="w-6 h-6 border rounded-full flex items-center justify-center">+</button>
                    </div>
                    <div className="font-bold">₹{p.price * item.quantity}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 h-fit space-y-6 sticky top-24">
          <h3 className="font-bold text-lg">Order Summary</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="text-green-600 font-bold uppercase text-[10px]">FREE</span>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            Checkout
          </button>
          <div className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
            Secure Checkout • Pay on Delivery available
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
