// Core product category types
export type ProductCategory = 'clothes' | 'shoes' | 'accessories';

// Order status
export type OrderStatus = 'delivered' | 'shipped' | 'awaiting';

// Size types for different categories
export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type ShoeSize = 
  | '35' | '36' | '37' | '38' | '39' | '40' | '41' | '42' | '43' | '44' | '45'
  | '35.5' | '36.5' | '37.5' | '38.5' | '39.5' | '40.5' | '41.5' | '42.5' | '43.5' | '44.5';

// Color types
export type ProductColor = 
  | 'beige' | 'blue' | 'black' | 'orange' | 'green' | 'brown' 
  | 'purple' | 'gold' | 'taupe' | 'white' | 'pink' | 'red' | 'grey' | 'gray';

// Main Product interface
export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  subcategory: string;
  image: string;
  images?: string[]; // Additional product images
  sizes: (ClothingSize | ShoeSize)[];
  colors: ProductColor[];
  description: string;
  inStock: boolean;
  featured?: boolean; // For home page featured products
}

// User interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  addresses: Address[];
  newsletterSubscription: boolean;
  createdAt: string;
}

// Address interface
export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

// Cart item interface
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize: ClothingSize | ShoeSize;
  selectedColor: ProductColor;
  addedAt: string;
}

// Favorites item interface
export interface FavoriteItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

// Order interface
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'card' | 'delivery';
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  isGift: boolean;
  orderDate: string;
  deliveryDate?: string;
  trackingNumber?: string;
}

// Order item interface
export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize: ClothingSize | ShoeSize;
  selectedColor: ProductColor;
  unitPrice: number;
  totalPrice: number;
}

// Filter interfaces for product filtering
export interface ProductFilters {
  category?: ProductCategory;
  subcategories: string[];
  sizes: (ClothingSize | ShoeSize)[];
  colors: ProductColor[];
  priceRange: {
    min: number;
    max: number;
  };
  inStock: boolean;
}

// Sort options for product listing
export type ProductSortOption = 
  | 'most-popular'
  | 'price-low-high'
  | 'price-high-low'
  | 'newest'
  | 'name-a-z'
  | 'name-z-a';

// Auth context interface
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'addresses'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

// Cart context interface
export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: ClothingSize | ShoeSize, color: ProductColor, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

// Favorites context interface
export interface FavoritesContextType {
  items: FavoriteItem[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

// API response types (for future use)
// export interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;
//   error?: string;
// }

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined;
}

export const STORAGE_KEYS = {
  AUTH: 'safari_auth',
  CART: 'safari_cart',
  FAVORITES: 'safari_favorites',
  USERS: 'safari_users',
  ORDERS: 'safari_orders',
} as const;

export const CATEGORIES = {
  CLOTHES: 'clothes' as const,
  SHOES: 'shoes' as const,
  ACCESSORIES: 'accessories' as const,
};

export const ORDER_STATUSES = {
  DELIVERED: 'delivered' as const,
  SHIPPED: 'shipped' as const,
  AWAITING: 'awaiting' as const,
} as const;