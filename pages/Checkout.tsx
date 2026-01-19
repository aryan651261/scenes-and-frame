
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { mockApi } from '../services/mockApi';
import { Product } from '../types';

const Checkout: React.FC = () => {
  const { cart, user, clearCart } = useApp();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (cart.length === 0) navigate('/');
    const fetchProducts = async () => {
      // Fix: Add explicit type string[] to uniqueIds to avoid 'unknown' type inference in Array.from, fixing parameter errors in map
      const uniqueIds: string[] = Array.from(new Set(cart.map(i => i.productId)));
      const results = await Promise.all(uniqueIds.map(id => mockApi.getProductById(id)));
      const map: Record<string, Product> = {};
      results.forEach(p => { if (p) map[p.id] = p; });
      setProducts(map);
    };
    fetchProducts();
  }, [cart, navigate]);

  const total = cart.reduce((acc, i) => {
    const p = products[i.productId];
    return acc + (p ? p.price * i.quantity : 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        alert('Please login to place an order');
        navigate('/auth');
        return;
    }
    setPlacing(true);
    
    const orderItems = cart.map(i => ({ ...i, product: products[i.productId] }));
    
    await mockApi.createOrder({
        userId: user.id,
        items: orderItems,
        total,
        address,
        phone
    });

    setTimeout(() => {
        clearCart();
        navigate('/dashboard');
        alert('Order placed successfully! 🎁');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl mb-8 text-center">Complete Your Order</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="font-bold text-lg mb-6">Delivery Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Shipping Address</label>
              <textarea 
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address, Street, City, ZIP"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-red-600 h-32"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
              <input 
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXXXXXXX"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-red-600"
              />
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h4 className="font-bold text-sm mb-2">Payment Method</h4>
              <div className="flex items-center gap-3">
                <input type="radio" checked readOnly className="accent-red-600" />
                <span className="text-sm font-medium">Cash on Delivery (COD)</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wide">Currently we only support COD for premium safety.</p>
            </div>

            <button 
                type="submit"
                disabled={placing}
                className={`w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all ${placing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {placing ? 'Processing...' : `Place Order • ₹${total}`}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl h-fit">
          <h3 className="font-bold text-lg mb-6">Order Summary</h3>
          <div className="space-y-4">
            {cart.map((item, idx) => {
              const p = products[item.productId];
              if (!p) return null;
              return (
                <div key={idx} className="flex gap-4 text-sm">
                  <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                    <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-gray-400 text-xs">Qty: {item.quantity} • {item.size}</div>
                  </div>
                  <div className="font-bold">₹{p.price * item.quantity}</div>
                </div>
              );
            })}
            <div className="pt-4 border-t border-gray-200 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
