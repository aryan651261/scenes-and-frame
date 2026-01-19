
import { Product, User, Order, OrderStatus, CategoryType, Message } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Godfather Minimalist',
    category: 'Movie',
    price: 1299,
    description: 'A premium minimalist frame celebrating the cinematic masterpiece. Printed on high-quality 300gsm matte paper.',
    images: ['https://picsum.photos/seed/godfather/600/800', 'https://picsum.photos/seed/godfather2/600/800'],
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
    images: ['https://picsum.photos/seed/spirited/600/800'],
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
    images: ['https://picsum.photos/seed/misty/600/800'],
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
    images: ['https://picsum.photos/seed/tokyo/600/800'],
    sizes: ['12x18', '24x36'],
    frameTypes: ['Classic Black', 'Metallic Gold'],
    stock: 45
  }
];

// LocalStorage helpers
const getDB = (key: string, initial: any = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : initial;
};

const setDB = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize DB if empty
if (getDB('sf_products').length === 0) setDB('sf_products', INITIAL_PRODUCTS);

export const mockApi = {
  // Auth
  login: async (email: string): Promise<{ user: User; token: string }> => {
    const users = getDB('sf_users');
    let user = users.find((u: User) => u.email === email);
    if (!user) {
      user = { id: Date.now().toString(), name: email.split('@')[0], email, role: email.includes('admin') ? 'admin' : 'customer' };
      users.push(user);
      setDB('sf_users', users);
    }
    return { user, token: 'fake-jwt-token' };
  },

  // Products
  getProducts: async (category?: CategoryType): Promise<Product[]> => {
    const products = getDB('sf_products');
    if (category) return products.filter((p: Product) => p.category === category);
    return products;
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const products = getDB('sf_products');
    return products.find((p: Product) => p.id === id);
  },

  saveProduct: async (product: Product): Promise<void> => {
    const products = getDB('sf_products');
    const index = products.findIndex((p: Product) => p.id === product.id);
    if (index > -1) products[index] = product;
    else products.push({ ...product, id: Date.now().toString() });
    setDB('sf_products', products);
  },

  deleteProduct: async (id: string): Promise<void> => {
    const products = getDB('sf_products');
    const filtered = products.filter((p: Product) => p.id !== id);
    setDB('sf_products', filtered);
  },

  // Orders
  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    const orders = getDB('sf_orders');
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 900000) + 100000}`,
      userId: orderData.userId!,
      items: orderData.items!,
      total: orderData.total!,
      status: OrderStatus.PLACED,
      address: orderData.address!,
      phone: orderData.phone!,
      createdAt: new Date().toISOString(),
      messages: []
    };
    orders.push(newOrder);
    setDB('sf_orders', orders);
    return newOrder;
  },

  getOrders: async (userId?: string): Promise<Order[]> => {
    const orders = getDB('sf_orders');
    if (userId) return orders.filter((o: Order) => o.userId === userId);
    return orders;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const orders = getDB('sf_orders');
    const index = orders.findIndex((o: Order) => o.id === orderId);
    if (index > -1) orders[index].status = status;
    setDB('sf_orders', orders);
  },

  sendMessage: async (orderId: string, text: string, isAdmin: boolean, senderId: string): Promise<void> => {
    const orders = getDB('sf_orders');
    const index = orders.findIndex((o: Order) => o.id === orderId);
    if (index > -1) {
      const msg: Message = {
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
