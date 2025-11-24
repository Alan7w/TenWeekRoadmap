import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth, useOrder } from '../context';
import { Button } from '../components/ui';

// Account sub-components
const AccountInfo = () => {
  const { user } = useAuth();
  
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <div className="p-3 bg-gray-50 rounded-md">{user?.firstName}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <div className="p-3 bg-gray-50 rounded-md">{user?.lastName}</div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="p-3 bg-gray-50 rounded-md">{user?.email}</div>
        </div>
      </div>
    </div>
  );
};

const AddressBook = () => {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Address Book</h2>
      <p className="text-gray-600">Address management will be available soon.</p>
    </div>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const { getUserOrders } = useOrder();
  
  const orders = user ? getUserOrders(user.id) : [];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Delivered</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Shipped</span>;
      case 'awaiting':
        return <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">Processing</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{status}</span>;
    }
  };
  
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        <Link to="/clothes">
          <Button className="bg-safari-pink hover:bg-safari-pink-dark text-white">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">My Orders</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <div key={order.id} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Items */}
              <div className="lg:col-span-1">
                {order.items.slice(0, 1).map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.selectedSize} • {item.selectedColor}
                      </p>
                      <p className="text-sm text-gray-500">₦ {item.unitPrice.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                      {order.items.length > 1 && (
                        <p className="text-sm text-gray-500 mt-1">+{order.items.length - 1} more item(s)</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Details */}
              <div className="lg:col-span-1 space-y-2">
                <div>
                  <h4 className="font-medium text-gray-900">Payment details</h4>
                  <p className="text-sm text-gray-600">Items total: ₦ {order.subtotal.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Delivery fee: ₦ {order.deliveryFee.toLocaleString()}</p>
                  <p className="text-sm font-medium">TOTAL: ₦ {order.total.toLocaleString()}</p>
                </div>
                
                <div className="pt-2">
                  <h4 className="font-medium text-gray-900">Delivery method</h4>
                  <p className="text-sm text-gray-600">{order.paymentMethod === 'delivery' ? 'Door delivery' : 'Card payment'}</p>
                </div>
              </div>
              
              {/* Order Status & Actions */}
              <div className="lg:col-span-1 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Shipping address</h4>
                  <div className="text-sm text-gray-600">
                    <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {getStatusBadge(order.status)}
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-safari-pink border-safari-pink hover:bg-safari-pink"
                    >
                      ORDER AGAIN
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 border-gray-300 hover:bg-gray-100"
                    >
                      REQUEST A RETURN
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500 pt-2">
                    <p>Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p>Placed: {new Date(order.orderDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</p>
                    {order.trackingNumber && (
                      <p>Tracking: {order.trackingNumber}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Favorites = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
      <p className="text-gray-600 mb-4">Access your favorites from the dedicated favorites page.</p>
      <Button
        onClick={() => navigate('/favorites')}
        className="bg-safari-pink hover:bg-safari-pink-dark text-white"
      >
        View Favorites
      </Button>
    </div>
  );
};

const Account: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  const navigationItems = [
    { path: '/account', label: 'Account Information' },
    { path: '/account/address-book', label: 'Address Book' },
    { path: '/account/orders', label: 'My Orders' },
    { path: '/account/favorites', label: 'My Favorites' },
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <h1 className="text-xl font-bold text-gray-900 mb-6">ACCOUNT DASHBOARD</h1>
              
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.path ||
                    (item.path === '/account' && location.pathname === '/account');
                  
                  return (
                    <Button
                      key={item.path}
                      variant='ghost'
                      onClick={() => navigate(item.path)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-pink-500'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span></span>
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:cursor-pointer hover:bg-red-50 w-full transition-colors"
                >
                  <span className="text-lg">🚪</span>
                  <span>SIGN OUT</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route index element={<AccountInfo />} />
              <Route path="address-book" element={<AddressBook />} />
              <Route path="orders" element={<Orders />} />
              <Route path="favorites" element={<Favorites />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;