
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo, COLORS, CATEGORIES } from './constants';
import { CartItem, Product, User, CategoryType } from './types';
import { mockApi } from './services/mockApi';

// Pages
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

// Context
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  updateCartQty: (index: number, delta: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sf_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sf_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sf_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sf_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
        const existing = prev.findIndex(i => i.productId === item.productId && i.size === item.size && i.frameType === item.frameType);
        if (existing > -1) {
            const next = [...prev];
            next[existing].quantity += item.quantity;
            return next;
        }
        return [...prev, item];
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartQty = (index: number, delta: number) => {
    setCart(prev => {
        const next = [...prev];
        next[index].quantity = Math.max(1, next[index].quantity + delta);
        return next;
    });
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{ user, setUser, cart, addToCart, removeFromCart, clearCart, updateCartQty }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:type" element={<Category />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </AppContext.Provider>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, cart } = useApp();
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          
          <div className="flex items-center gap-6 sm:gap-8 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-red-600 transition-colors hidden sm:block">Home</Link>
            <div className="relative group hidden sm:block">
              <span className="cursor-pointer group-hover:text-red-600 transition-colors">Categories</span>
              <div className="absolute top-full -left-4 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white border border-gray-100 shadow-xl rounded-lg py-2 w-48">
                  {CATEGORIES.map(c => (
                    <Link key={c.value} to={`/category/${c.value}`} className="block px-4 py-2 hover:bg-gray-50 hover:text-red-600">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link to="/cart" className="relative hover:text-red-600 transition-colors">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors">
                {user.role === 'admin' ? 'Admin' : 'Profile'}
              </Link>
            ) : (
              <Link to="/auth" className="bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-4 text-gray-500 text-sm max-w-sm">
              Articulating your space with premium frames, posters, and wall art. Curated for the cinematic eye.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-red-600">Home</Link></li>
              <li><Link to="/cart" className="hover:text-red-600">Cart</Link></li>
              <li><Link to="/auth" className="hover:text-red-600">Login/Join</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="#" className="hover:text-red-600">Shipping Policy</Link></li>
              <li><Link to="#" className="hover:text-red-600">Terms & Conditions</Link></li>
              <li><Link to="#" className="hover:text-red-600">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
          © 2026 Scenes & Frame. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
