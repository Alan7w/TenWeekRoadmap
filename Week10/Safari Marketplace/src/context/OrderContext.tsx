import { createContext, useState, useEffect } from 'react';
import type { Order, OrderItem, Address, CartItem } from '../types';
import { STORAGE_KEYS } from '../types';

interface OrderContextType {
  orders: Order[];
  createOrder: (
    items: CartItem[],
    shippingAddress: Address,
    paymentMethod: 'card' | 'delivery',
    subtotal: number,
    deliveryFee: number,
    discount: number,
    total: number,
    isGift: boolean,
    userId: string
  ) => string;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
  updateOrderStatus: (orderId: string, status: 'delivered' | 'shipped' | 'awaiting') => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export { OrderContext };

interface OrderProviderProps {
  children: React.ReactNode;
}

const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  // Initialize orders with data from localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (error) {
        console.error('Error parsing saved orders:', error);
        return [];
      }
    }
    return [];
  });

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  const createOrder = (
    items: CartItem[],
    shippingAddress: Address,
    paymentMethod: 'card' | 'delivery',
    subtotal: number,
    deliveryFee: number,
    discount: number,
    total: number,
    isGift: boolean,
    userId: string
  ): string => {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Convert cart items to order items
    const orderItems: OrderItem[] = items.map((cartItem) => ({
      id: `orderitem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId: cartItem.productId,
      product: cartItem.product,
      quantity: cartItem.quantity,
      selectedSize: cartItem.selectedSize,
      selectedColor: cartItem.selectedColor,
      unitPrice: cartItem.product.price,
      totalPrice: cartItem.product.price * cartItem.quantity,
    }));

    const newOrder: Order = {
      id: orderId,
      userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      discount,
      total,
      status: 'awaiting',
      isGift,
      orderDate: new Date().toISOString(),
      trackingNumber: `SAF${Date.now().toString().slice(-8)}`,
    };

    setOrders(prevOrders => [...prevOrders, newOrder]);
    return orderId;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const getUserOrders = (userId: string): Order[] => {
    return orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  };

  const updateOrderStatus = (orderId: string, status: 'delivered' | 'shipped' | 'awaiting') => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const value = {
    orders,
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;