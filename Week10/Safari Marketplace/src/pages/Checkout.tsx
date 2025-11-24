import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useCart, useOrder } from '../context';
import { Button, Input, Confirmation } from '../components/ui';
import type { Address } from '../types';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();
  const { createOrder } = useOrder();
  
  const [confirmation, setConfirmation] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Shipping form state
  const [shippingData, setShippingData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: '',
    state: '',
    city: '',
    phone: '',
    setAsDefault: false,
  });
  
  // Payment and delivery state
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'delivery'>('card');
  const [isGift, setIsGift] = useState(false);
  
  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Calculate totals
  const subtotal = useMemo(() => getCartTotal(), [getCartTotal]);
  const deliveryFee = deliveryMethod === 'express' ? 15000 : 2000;
  const discount = 1000;
  const total = subtotal + deliveryFee - discount;
  
  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, items.length, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!shippingData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingData.email.trim()) newErrors.email = 'Email is required';
    if (!shippingData.address.trim()) newErrors.address = 'Address is required';
    if (!shippingData.state.trim()) newErrors.state = 'State/Province is required';
    if (!shippingData.city.trim()) newErrors.city = 'City is required';
    if (!shippingData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shippingData.email && !emailRegex.test(shippingData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      setConfirmation({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }
    
    if (!user) {
      setConfirmation({ message: 'You must be logged in to place an order', type: 'error' });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create shipping address
      const shippingAddress: Address = {
        id: `addr_${Date.now()}`,
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        street: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        zipCode: '', 
        country: 'Nigeria', // Default country
        phone: shippingData.phone,
        isDefault: shippingData.setAsDefault,
      };
      
      // Create order
      const orderId = createOrder(
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        deliveryFee,
        discount,
        total,
        isGift,
        user.id
      );
      
      clearCart();

      setConfirmation({ message: 'Order placed successfully!', type: 'success' });
      
      // Navigate to success page or account orders
      setTimeout(() => {
        navigate('/account/orders', { 
          state: { 
            orderId, 
            message: 'Your order has been placed successfully!' 
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error placing order:', error);
      setConfirmation({ message: 'Failed to place order. Please try again.', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!user || items.length === 0) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">1</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <Input
                    name="firstName"
                    value={shippingData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <Input
                    name="lastName"
                    value={shippingData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                    placeholder="Enter last name"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={shippingData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <Input
                    name="address"
                    value={shippingData.address}
                    onChange={handleInputChange}
                    error={errors.address}
                    placeholder="Enter full address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province *
                  </label>
                  <Input
                    name="state"
                    value={shippingData.state}
                    onChange={handleInputChange}
                    error={errors.state}
                    placeholder="Enter state/province"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <Input
                    name="city"
                    value={shippingData.city}
                    onChange={handleInputChange}
                    error={errors.city}
                    placeholder="Enter city"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <Input
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="setAsDefault"
                      checked={shippingData.setAsDefault}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-safari-pink focus:ring-safari-pink"
                    />
                    <span className="text-sm text-gray-600">Set as default shipping address</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Delivery Method Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">2</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Delivery method</h2>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="standard"
                    checked={deliveryMethod === 'standard'}
                    onChange={(e) => setDeliveryMethod(e.target.value as 'standard')}
                    className="text-safari-pink focus:ring-safari-pink"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">₦ 2,000</span>
                      <span className="text-gray-600">Delivery fee</span>
                    </div>
                    <div className="text-sm text-gray-500">Door delivery</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="express"
                    checked={deliveryMethod === 'express'}
                    onChange={(e) => setDeliveryMethod(e.target.value as 'express')}
                    className="text-safari-pink focus:ring-safari-pink"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">₦ 15,000</span>
                      <span className="text-gray-600">Express delivery</span>
                    </div>
                    <div className="text-sm text-gray-500">Same day delivery</div>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Payment Methods Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">3</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                    className="text-safari-pink focus:ring-safari-pink mt-1"
                  />
                  <div>
                    <div className="font-medium mb-1">Pay with card</div>
                    <div className="text-sm text-gray-600">(Get 5% off total price and money back guarantee)</div>
                    <div className="text-sm text-gray-500 mt-2">You are not required to input your personal information here.</div>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="delivery"
                    checked={paymentMethod === 'delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'delivery')}
                    className="text-safari-pink focus:ring-safari-pink mt-1"
                  />
                  <div>
                    <div className="font-medium mb-1">Pay on delivery</div>
                    <div className="text-sm text-gray-600">
                      <div>• Everyone that you see your order POD payment option are delivery</div>
                      <div>• You have up to make payment before opening package</div>
                      <div>• You pay to our agent, they only accept card/account if shipping on delivery</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Gift Option */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Is this a gift?</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsGift(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isGift
                        ? 'bg-safari-pink text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setIsGift(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      !isGift
                        ? 'bg-safari-pink text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
              {isGift && (
                <p className="mt-3 text-sm text-gray-600">
                  A complimentary gift receipt will be included in the package, and prices will be hidden on the receipt.
                </p>
              )}
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">ORDER SUMMARY</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.selectedSize} • Color: {item.selectedColor}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium">
                          ₦ {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Totals */}
              <div className="space-y-3 py-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cart sub-total</span>
                  <span className="font-medium">₦ {subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Card discount</span>
                  <span className="text-green-600">- ₦ {discount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery fee</span>
                  <span className="font-medium">₦ {deliveryFee.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                  <span>TOTAL</span>
                  <span className="text-safari-pink">₦ {total.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full mt-6 bg-safari-pink hover:bg-safari-pink-dark text-white font-medium py-3"
              >
                {isProcessing ? 'PROCESSING...' : 'PLACE ORDER'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Notification */}
      {confirmation && (
        <Confirmation
          message={confirmation.message}
          type={confirmation.type}
          onClose={() => setConfirmation(null)}
        />
      )}
    </div>
  );
};

export default Checkout;