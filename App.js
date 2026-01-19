
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import htm from 'htm';
import { Logo, CATEGORIES } from './constants.js';
import { mockApi } from './services/mockApi.js';

// User Portal Pages
import Home from './pages/Home.js';
import Category from './pages/Category.js';
import ProductDetail from './pages/ProductDetail.js';
import Cart from './pages/Cart.js';
import Checkout from './pages/Checkout.js';
import Auth from './pages/Auth.js';
import Dashboard from './pages/Dashboard.js';
import CustomPoster from './pages/CustomPoster.js';

// Admin Portal Pages
import AdminPortal from './pages/AdminPortal.js';

const html = htm.bind(React.createElement);
const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const UserLayout = ({ children }) => {
  const { user, cart } = useApp();
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return html`
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <${Link} to="/"><${Logo} /></${Link}>
          <div className="flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
            <${Link} to="/" className="hover:text-brand transition-colors">Home</${Link}>
            <div className="relative group">
              <span className="cursor-pointer group-hover:text-brand transition-colors">Collections</span>
              <div className="absolute top-full -left-4 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl py-3 w-56 overflow-hidden">
                  ${CATEGORIES.map(c => html`
                    <${Link} key=${c.value} to=${c.custom ? '/custom-poster' : `/category/${c.value}`} className="block px-6 py-3 hover:bg-gray-50 hover:text-brand transition-colors font-bold tracking-widest">
                      ${c.name}
                    </${Link}>
                  `)}
                </div>
              </div>
            </div>
            <${Link} to="/cart" className="relative hover:text-brand transition-colors">
              Cart ${cartCount > 0 && html`<span className="absolute -top-3 -right-3 bg-brand text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">${cartCount}</span>`}
            </${Link}>
            ${user ? html`
              <${Link} to=${user.role === 'admin' ? '/admin' : '/dashboard'} className="bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-brand transition-all">
                ${user.role === 'admin' ? 'HQ Admin' : 'Archive'}
              </${Link}>
            ` : html`
              <${Link} to="/auth" className="bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-brand transition-all">Login</${Link}>
            `}
          </div>
        </div>
      </nav>
      <main className="flex-grow">${children}</main>
      <footer className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <${Logo} />
            <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-xs uppercase tracking-widest">Crafting cinematic atmospheres since 2026. Every frame tells a story.</p>
          </div>
          <div className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <h4 className="text-gray-900 mb-2">Navigation</h4>
            <${Link} to="/" className="hover:text-brand">Home</${Link}>
            <${Link} to="/cart" className="hover:text-brand">Shopping Cart</${Link}>
            <${Link} to="/auth" className="hover:text-brand">Client Access</${Link}>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            <h4 className="text-gray-900 mb-2">Portal Access</h4>
            <${Link} to="/auth" className="hover:text-brand block mb-4">Admin Command Center</${Link}>
            <p className="mt-8 opacity-40">© 2026 Scenes and Frame. All rights reserved.</p>
          </div>
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

  const addToCart = (item) => setCart(prev => {
    const idx = prev.findIndex(i => i.productId === item.productId && i.size === item.size);
    if (idx > -1) { let next = [...prev]; next[idx].quantity += item.quantity; return next; }
    return [...prev, item];
  });

  const removeFromCart = (index) => setCart(prev => prev.filter((_, i) => i !== index));
  const clearCart = () => setCart([]);
  const updateCartQty = (idx, delta) => setCart(prev => {
    const next = [...prev]; next[idx].quantity = Math.max(1, next[idx].quantity + delta); return next;
  });

  return html`
    <${AppContext.Provider} value=${{ user, setUser, cart, addToCart, removeFromCart, clearCart, updateCartQty }}>
      <${Router}>
        <${Routes}>
          <${Route} path="/admin/*" element=${html`<${AdminPortal} />`} />
          <${Route} path="*" element=${html`
            <${UserLayout}>
              <${Routes}>
                <${Route} path="/" element=${html`<${Home} />`} />
                <${Route} path="/category/:type" element=${html`<${Category} />`} />
                <${Route} path="/product/:id" element=${html`<${ProductDetail} />`} />
                <${Route} path="/cart" element=${html`<${Cart} />`} />
                <${Route} path="/checkout" element=${html`<${Checkout} />`} />
                <${Route} path="/auth" element=${html`<${Auth} />`} />
                <${Route} path="/dashboard" element=${html`<${Dashboard} />`} />
                <${Route} path="/custom-poster" element=${html`<${CustomPoster} />`} />
              </${Routes}>
            </${UserLayout}>
          `} />
        </${Routes}>
      </${Router}>
    </${AppContext.Provider}>
  `;
}
