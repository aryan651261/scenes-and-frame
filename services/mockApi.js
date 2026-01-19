
const getDB = (key, initial = []) => JSON.parse(localStorage.getItem(key) || JSON.stringify(initial));
const setDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const INITIAL_PRODUCTS = [
  { id: '1', name: 'Batman: The Dark Knight', category: 'Superhero', price: 1899, description: 'Iconic cinematic shot of the caped crusader.', images: ['https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=800&q=80'], sizes: ['12x18', '24x36'], frameTypes: ['Classic Black'], stock: 12, featured: true },
  { id: '2', name: 'Porsche 911 GT3', category: 'Car', price: 1549, description: 'Engineered for speed, framed for aesthetics.', images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'], sizes: ['12x18'], frameTypes: ['Metallic Gold'], stock: 25, featured: true }
];

if (!localStorage.getItem('sf_products')) setDB('sf_products', INITIAL_PRODUCTS);

export const mockApi = {
  login: async (email) => {
    const users = getDB('sf_users');
    let user = users.find(u => u.email === email);
    if (!user) {
      user = { id: Date.now().toString(), name: email.split('@')[0], email, role: email === 'admin@sf.com' ? 'admin' : 'customer' };
      users.push(user);
      setDB('sf_users', users);
    }
    return { user, token: 'fake_jwt_2026' };
  },

  getProducts: async (category) => {
    const p = getDB('sf_products');
    return category ? p.filter(x => x.category === category) : p;
  },

  getProductById: async (id) => getDB('sf_products').find(x => x.id === id),

  saveProduct: async (p) => {
    const products = getDB('sf_products');
    const idx = products.findIndex(x => x.id === p.id);
    if (idx > -1) products[idx] = p; else products.push({ ...p, id: Date.now().toString() });
    setDB('sf_products', products);
  },

  deleteProduct: async (id) => {
    setDB('sf_products', getDB('sf_products').filter(x => x.id !== id));
  },

  createOrder: async (data) => {
    const orders = getDB('sf_orders');
    const newOrder = { ...data, id: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, status: 'PLACED', createdAt: new Date().toISOString(), messages: [] };
    orders.push(newOrder);
    setDB('sf_orders', orders);
    return newOrder;
  },

  getOrders: async (uid) => {
    const orders = getDB('sf_orders');
    return uid ? orders.filter(o => o.userId === uid) : orders;
  },

  updateOrderStatus: async (id, status) => {
    const orders = getDB('sf_orders');
    const idx = orders.findIndex(x => x.id === id);
    if (idx > -1) orders[idx].status = status;
    setDB('sf_orders', orders);
  },

  sendMessage: async (oid, text, isAdmin, sid) => {
    const orders = getDB('sf_orders');
    const idx = orders.findIndex(x => x.id === oid);
    if (idx > -1) {
      orders[idx].messages.push({ id: Date.now().toString(), text, isAdmin, senderId: sid, timestamp: new Date().toISOString() });
      setDB('sf_orders', orders);
    }
  },

  // Custom Poster APIs
  submitCustomPoster: async (data) => {
    const posters = getDB('sf_custom_posters');
    const newPoster = { ...data, id: `CUST-${Date.now()}`, status: 'Submitted', createdAt: new Date().toISOString() };
    posters.push(newPoster);
    setDB('sf_custom_posters', posters);
    return newPoster;
  },

  getCustomPosters: async () => getDB('sf_custom_posters'),

  updateCustomPosterStatus: async (id, status) => {
    const posters = getDB('sf_custom_posters');
    const idx = posters.findIndex(x => x.id === id);
    if (idx > -1) posters[idx].status = status;
    setDB('sf_custom_posters', posters);
  }
};
