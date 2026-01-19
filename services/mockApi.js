
export const OrderStatus = Object.freeze({
  PLACED: 'PLACED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
});

const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'The Godfather Minimalist',
    category: 'Movie',
    price: 1299,
    description: 'A premium minimalist frame celebrating the cinematic masterpiece.',
    images: ['https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80'],
    sizes: ['12x18', '24x36'],
    frameTypes: ['Classic Black', 'Natural Oak'],
    stock: 50,
    featured: true
  },
  {
    id: '2',
    name: 'Spirited Away Bathhouse',
    category: 'Anime',
    price: 1499,
    description: 'The iconic bathhouse in vibrant colors.',
    images: ['https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80'],
    sizes: ['12x18', '24x36'],
    frameTypes: ['Sleek White', 'Natural Oak'],
    stock: 30,
    featured: true
  }
];

const getDB = (key, initial = []) => JSON.parse(localStorage.getItem(key) || JSON.stringify(initial));
const setDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));

if (!localStorage.getItem('sf_products')) setDB('sf_products', INITIAL_PRODUCTS);

export const mockApi = {
  login: async (email) => {
    const users = getDB('sf_users');
    let user = users.find(u => u.email === email);
    if (!user) {
      user = { id: Date.now().toString(), name: email.split('@')[0], email, role: email.includes('admin') ? 'admin' : 'customer' };
      users.push(user);
      setDB('sf_users', users);
    }
    return { user };
  },
  getProducts: async (category) => {
    const products = getDB('sf_products');
    return category ? products.filter(p => p.category === category) : products;
  },
  getProductById: async (id) => getDB('sf_products').find(p => p.id === id),
  getOrders: async (userId) => {
    const orders = getDB('sf_orders');
    return userId ? orders.filter(o => o.userId === userId) : orders;
  },
  createOrder: async (orderData) => {
    const orders = getDB('sf_orders');
    const newOrder = { ...orderData, id: Math.random().toString(36).substr(2, 9), status: 'PLACED', createdAt: new Date().toISOString() };
    orders.push(newOrder);
    setDB('sf_orders', orders);
    return newOrder;
  }
};
