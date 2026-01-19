
import { OrderStatus } from '../types.js';

const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'The Godfather Minimalist',
    category: 'Movie',
    price: 1299,
    description: 'A premium minimalist frame celebrating the cinematic masterpiece. Printed on high-quality 300gsm matte paper.',
    images: ['https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80'],
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
    description: 'The iconic bathhouse in vibrant colors. A must-have for Ghibli fans.',
    images: ['https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80'],
    sizes: ['12x18', '24x36'],
    frameTypes: ['Sleek White', 'Natural Oak'],
    stock: 30,
    featured: true
  },
  {
    id: '3',
    name: 'Misty Forest Pines',
    category: 'Nature',
    price: 899,
    description: 'Breathe life into your room with this calming forest scene.',
    images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80'],
    sizes: ['8x10', '12x18'],
    frameTypes: ['Classic Black'],
    stock: 100,
    featured: true
  },
  {
    id: '4',
    name: 'Neon Tokyo Night',
    category: 'Movie',
    price: 1199,
    description: 'Cyberpunk aesthetics captured in a high-quality frame.',
    images: ['https://images.unsplash.com/photo-1542204113-e9352628944f?auto=format&fit=crop&w=800&q=80'],
    sizes: ['12x18', '24x36'],
    frameTypes: ['Classic Black', 'Metallic Gold'],
    stock: 45
  }
];

const getDB = (key, initial = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : initial;
};

const setDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

if (getDB('sf_products').length === 0) setDB('sf_products', INITIAL_PRODUCTS);

export const mockApi = {
  login: async (email) => {
    const users = getDB('sf_users');
    let user = users.find((u) => u.email === email);
    if (!user) {
      user = { id: Date.now().toString(), name: email.split('@')[0], email, role: email.includes('admin') ? 'admin' : 'customer' };
      users.push(user);
      setDB('sf_users', users);
    }
    return { user, token: 'fake-jwt-token' };
  },

  getProducts: async (category) => {
    const products = getDB('sf_products');
    if (category) return products.filter((p) => p.category === category);
    return products;
  },

  getProductById: async (id) => {
    const products = getDB('sf_products');
    return products.find((p) => p.id === id);
  },

  saveProduct: async (product) => {
    const products = getDB('sf_products');
    const index = products.findIndex((p) => p.id === product.id);
    if (index > -1) products[index] = product;
    else products.push({ ...product, id: Date.now().toString() });
    setDB('sf_products', products);
  },

  deleteProduct: async (id) => {
    const products = getDB('sf_products');
    const filtered = products.filter((p) => p.id !== id);
    setDB('sf_products', filtered);
  },

  createOrder: async (orderData) => {
    const orders = getDB('sf_orders');
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 900000) + 100000}`,
      userId: orderData.userId,
      items: orderData.items,
      total: orderData.total,
      status: OrderStatus.PLACED,
      address: orderData.address,
      phone: orderData.phone,
      createdAt: new Date().toISOString(),
      messages: []
    };
    orders.push(newOrder);
    setDB('sf_orders', orders);
    return newOrder;
  },

  getOrders: async (userId) => {
    const orders = getDB('sf_orders');
    if (userId) return orders.filter((o) => o.userId === userId);
    return orders;
  },

  updateOrderStatus: async (orderId, status) => {
    const orders = getDB('sf_orders');
    const index = orders.findIndex((o) => o.id === orderId);
    if (index > -1) orders[index].status = status;
    setDB('sf_orders', orders);
  },

  sendMessage: async (orderId, text, isAdmin, senderId) => {
    const orders = getDB('sf_orders');
    const index = orders.findIndex((o) => o.id === orderId);
    if (index > -1) {
      const msg = {
        id: Date.now().toString(),
        senderId,
        text,
        timestamp: new Date().toISOString(),
        isAdmin
      };
      orders[index].messages.push(msg);
      setDB('sf_orders', orders);
    }
  }
};
