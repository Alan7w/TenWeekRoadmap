import { useState, useEffect } from 'react';
import { Loading } from '../components';

const Cart: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading cart data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <Loading text="Loading your cart..." size="lg" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
      <p className="text-gray-600">Cart page - to be implemented with cart items and checkout</p>
    </div>
  );
};

export default Cart;