
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import htm from 'htm';
import { Logo, CATEGORIES } from './constants.js';
import { mockApi } from './services/mockApi.js';

// Pages
import Home from './pages/Home.js';
import Category from './pages/Category.js';
import ProductDetail from './pages/ProductDetail.js';
import Cart from './pages/Cart.js';
import Checkout from './pages/Checkout.js';
import Auth from './pages/Auth.js';
import Dashboard from './pages/Dashboard.js';
import Admin from './pages/Admin.js';

const html = htm.bind(React.createElement);
const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const Layout = ({ children }) => {
  const { user, cart } = useApp();
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return html`
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <${Link} to="/">
            <${Logo} />
          </${Link}>
          
          <div className="flex items-center gap-6 sm:gap-8 text-sm font-medium text-gray-700">
            <${Link} to="/" className="hover:text-red-600 transition-colors hidden sm:block text-xs font-black uppercase tracking-widest">Home</${Link}>
            <div className="relative group hidden sm:block">
              <span className="cursor-pointer group-hover:text-red-600 transition-colors text-xs font-black uppercase tracking-widest">Categories</span>
              <div className="absolute top-full -left-4 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white border border-gray-100 shadow-xl rounded-lg py-2 w-48 overflow-hidden">
                  ${CATEGORIES.map(c => html`
                    <${Link} key=${c.value} to="/category/${c.value}" className="block px-4 py-2 hover:bg-gray-50 hover:text-red-600 text-xs font-bold uppercase tracking-wider">
                      ${c.name}
                    </${Link}>
                  `)}
                </div>
              </div>
            </div>
            
            <${Link} to="/cart" className="relative hover:text-red-600 transition-colors text-xs font-black uppercase tracking-widest">
              Cart
              ${cartCount > 0 && html`
                <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                  ${cartCount}
                </span>
              `}
            </${Link}>
            
            ${user ? html`
              <${Link} to=${user.role === 'admin' ? '/admin' : '/dashboard'} className="bg-gray-900 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition-all text-[10px] font-black uppercase tracking-widest">
                ${user.role === 'admin' ? 'Admin' : 'Profile'}
              </${Link}>
            ` : html`
              <${Link} to="/auth" className="bg-gray-900 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition-all text-[10px] font-black uppercase tracking-widest">
                Login
              </${Link}>
            `}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        ${children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <${Logo} />
            <p className="mt-6 text-gray-500 text-xs font-medium leading-relaxed max-w-xs uppercase tracking-wider">
              Articulating your space with premium frames, posters, and wall art. Curated for the cinematic eye.
            </p>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-900 mb-6">Quick Links</h4>
            <ul className="space-y-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <li><${Link} to="/" className="hover:text-red-600">Home</${Link}></li>
              <li><${Link} to="/cart" className="hover:text-red-600">Cart</${Link}></li>
              <li><${Link} to="/auth" className="hover:text-red-600">Login/Join</${Link}></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-900 mb-6">Support</h4>
            <ul className="space-y-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <li><${Link} to="#" className="hover:text-red-600">Shipping Policy</${Link}></li>
              <li><${Link} to="#" className="hover:text-red-600">Terms & Conditions</${Link}></li>
              <li><${Link} to="#" className="hover:text-red-600">Contact Us</${Link}></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-100 text-center text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
          © 2026 Scenes & Frame. All rights reserved.
        </div>
      </footer>
    </div>
  `;
};

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('sf_user') || 'null'));
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('sf_cart') || '[]'));

  useEffect(() => localStorage.setItem('sf_user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('sf_cart', JSON.stringify(cart)), [cart]);

  const addToCart = (item) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.productId === item.productId && i.size === item.size && i.frameType === item.frameType);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += item.quantity;
        return next;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (index) => setCart(prev => prev.filter((_, i) => i !== index));
  const clearCart = () => setCart([]);
  const updateCartQty = (index, delta) => setCart(prev => {
    const next = [...prev];
    next[index].quantity = Math.max(1, next[index].quantity + delta);
    return next;
  });

  return html`
    <${AppContext.Provider} value=${{ user, setUser, cart, addToCart, removeFromCart, clearCart, updateCartQty }}>
      <${Router}>
        <${Layout}>
          <${Routes}>
            <${Route} path="/" element=${html`<${Home} />`} />
            <${Route} path="/category/:type" element=${html`<${Category} />`} />
            <${Route} path="/product/:id" element=${html`<${ProductDetail} />`} />
            <${Route} path="/cart" element=${html`<${Cart} />`} />
            <${Route} path="/checkout" element=${html`<${Checkout} />`} />
            <${Route} path="/auth" element=${html`<${Auth} />`} />
            <${Route} path="/dashboard" element=${html`<${Dashboard} />`} />
            <${Route} path="/admin" element=${html`<${Admin} />`} />
          </${Routes}>
        </${Layout}>
      </${Router}>
    </${AppContext.Provider}>
  `;
}
