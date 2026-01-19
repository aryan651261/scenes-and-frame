
export type CategoryType = 'Movie' | 'Nature' | 'Anime' | 'Abstract';

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  frameTypes: string[];
  stock: number;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  frameType: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export enum OrderStatus {
  PLACED = 'PLACED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: (CartItem & { product: Product })[];
  total: number;
  status: OrderStatus;
  address: string;
  phone: string;
  createdAt: string;
  messages: Message[];
}
