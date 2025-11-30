import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth, useOrder } from '../context';
import { Button, Input, Confirmation } from '../components/ui';
import type { Address } from '../types';

// Account sub-components
const AccountInfo = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmation, setConfirmation] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState(() => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth || '',
    newsletterSubscription: user?.newsletterSubscription || false,
  }));
  
  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
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
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation logic:
    // 1. If user enters currentPassword but no newPassword, that's fine, no need for validation
    // 2. If user enters newPassword or confirmPassword, they must provide currentPassword
    // 3. All password fields must be valid if changing password
    const isChangingPassword = formData.newPassword || formData.confirmPassword;
    
    if (isChangingPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      } else {
        // Verify current password matches user's actual password
        if (user && formData.currentPassword !== user.password) {
          newErrors.currentPassword = 'Current password is incorrect';
        }
      }
      
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your new password';
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      // Check if new password is same as current
      if (formData.newPassword && formData.newPassword === formData.currentPassword) {
        newErrors.newPassword = 'New password must be different from current password';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!validateForm()) {
      setConfirmation({ message: 'Please fix the errors below', type: 'error' });
      return;
    }
    
    try {
      // Prepare update data
      const updateData: Partial<typeof user> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender as 'male' | 'female' | 'other',
        dateOfBirth: formData.dateOfBirth,
        newsletterSubscription: formData.newsletterSubscription,
      };
      
      // If changing password, include new password
      const isChangingPassword = formData.newPassword || formData.confirmPassword;
      if (isChangingPassword && formData.newPassword) {
        updateData.password = formData.newPassword;
      }
      
      // Update user data
      updateUser(updateData);
      
      setIsEditing(false);
      
      let successMessage = 'Account information updated successfully!';
      if (isChangingPassword) {
        successMessage += ' Password changed successfully.';
      }
      setConfirmation({ message: successMessage, type: 'success' });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
    } catch {
      setConfirmation({ message: 'Failed to update account information', type: 'error' });
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      gender: user?.gender || '',
      dateOfBirth: user?.dateOfBirth || '',
      newsletterSubscription: user?.newsletterSubscription || false,
    });
    setErrors({});
  };
  
  return (
    <>
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-8">User Information</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
              {isEditing ? (
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md text-gray-900">{user?.firstName}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
              {isEditing ? (
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md text-gray-900">{user?.lastName}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md text-gray-900">{user?.email}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-safari-pink focus:border-safari-pink"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                  {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of birth</label>
              {isEditing ? (
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                  {user?.dateOfBirth ? user.dateOfBirth : 'Not specified'}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Password Section */}
          <div className="space-y-6">
            {isEditing && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
                  <Input
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    error={errors.currentPassword}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
                  <Input
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    error={errors.newPassword}
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm new password"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Newsletter Subscription */}
        {isEditing && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="newsletterSubscription"
                checked={formData.newsletterSubscription}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-safari-pink focus:ring-safari-pink"
              />
              <span className="text-sm text-gray-700">Newsletter subscription</span>
            </label>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-4">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-safari-pink hover:bg-safari-pink-dark text-white"
            >
              Edit Information
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                className="bg-safari-pink hover:bg-safari-pink-dark text-white"
              >
                SAVE CHANGES
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </>
          )}
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
    </>
  );
};


const AddressBook = () => {
  const { user, updateUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>(user?.addresses || []);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Form state for new/editing address
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    isDefault: false,
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      isDefault: false,
    });
    setErrors({});
  };
  
  const handleAddNew = () => {
    setIsAddingNew(true);
    resetForm();
  };
  
  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
  };
  
  const handleSave = () => {
    if (!validateForm()) {
      setConfirmation({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }
    
    try {
      const newAddress: Address = {
        id: editingId || `addr_${Date.now()}`,
        ...formData,
      };
      
      let updatedAddresses: Address[];
      
      if (editingId) {
        // Editing existing address
        updatedAddresses = addresses.map(addr => 
          addr.id === editingId ? newAddress : addr
        );
      } else {
        // Adding new address
        updatedAddresses = [...addresses, newAddress];
      }
      
      // If setting as default, unset other default addresses
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === newAddress.id
        }));
      }
      
      setAddresses(updatedAddresses);
      
      // Update user data
      if (user) {
        updateUser({ addresses: updatedAddresses });
      }
      
      setIsAddingNew(false);
      setEditingId(null);
      resetForm();
      
      setConfirmation({ 
        message: editingId ? 'Address updated successfully!' : 'Address added successfully!', 
        type: 'success' 
      });
      
    } catch {
      setConfirmation({ message: 'Failed to save address', type: 'error' });
    }
  };
  
  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    resetForm();
  };
  
  const handleDelete = (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);
      
      if (user) {
        updateUser({ addresses: updatedAddresses });
      }
      
      setConfirmation({ message: 'Address deleted successfully!', type: 'success' });
    }
  };
  
  const isFormVisible = isAddingNew || editingId;
  
  return (
    <>
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-8">Address Book</h2>
        
        {/* Default Address Display */}
        {addresses.length > 0 && !isFormVisible && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Default Shipping Address</h3>
            {addresses.find(addr => addr.isDefault) ? (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                {(() => {
                  const defaultAddr = addresses.find(addr => addr.isDefault)!;
                  return (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{defaultAddr.firstName} {defaultAddr.lastName}</p>
                          <p className="text-gray-600">{defaultAddr.street}</p>
                          <p className="text-gray-600">{defaultAddr.city}, {defaultAddr.state}</p>
                          <p className="text-gray-600">{defaultAddr.country}</p>
                          <p className="text-gray-600">{defaultAddr.phone}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant='outline'
                            onClick={() => handleEdit(defaultAddr)}
                            className="text-safari-pink hover:text-safari-pink-dark text-sm font-medium"
                          >
                            Edit
                          </Button>
                          <Button
                            variant='ghost'
                            onClick={() => handleDelete(defaultAddr.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <p className="text-gray-500 italic">No default address set</p>
            )}
          </div>
        )}
        
        {/* Add New Address Button */}
        {!isFormVisible && (
          <div className="mb-6">
            <Button
              onClick={handleAddNew}
              className="bg-safari-pink hover:bg-safari-pink-dark text-white"
            >
              ADD NEW ADDRESS
            </Button>
          </div>
        )}
        
        {/* Address Form */}
        {isFormVisible && (
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-6">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name *"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
              />
              
              <Input
                label="Last Name *"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
              />
              
              <div className="md:col-span-2">
                <Input
                  label="Street Address *"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  error={errors.street}
                />
              </div>
              
              <Input
                label="City *"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={errors.city}
              />
              
              <Input
                label="State/Province *"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                error={errors.state}
              />
              
              <Input
                label="Postal Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
              />
              
              <Input
                label="Country *"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                error={errors.country}
              />
              
              <Input
                label="Phone Number *"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
              />
            </div>
            
            <div className="mt-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-safari-pink focus:ring-safari-pink"
                />
                <span className="text-sm text-gray-700">Set as default address</span>
              </label>
            </div>
            
            <div className="mt-8 flex space-x-4">
              <Button
                onClick={handleSave}
                className="bg-safari-pink hover:bg-safari-pink-dark text-white"
              >
                {editingId ? 'UPDATE ADDRESS' : 'ADD ADDRESS'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {/* All Addresses List */}
        {addresses.length > 0 && !isFormVisible && (
          <div>
            <h3 className="text-lg font-semibold mb-4">All Addresses</h3>
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border border-gray-200 rounded-lg p-4 ${
                    address.isDefault ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-medium">{address.firstName} {address.lastName}</p>
                        {address.isDefault && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{address.street}</p>
                      <p className="text-gray-600">{address.city}, {address.state}</p>
                      <p className="text-gray-600">{address.country}</p>
                      <p className="text-gray-600">{address.phone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant='outline'
                        onClick={() => handleEdit(address)}
                        className="text-safari-pink hover:text-safari-pink-dark text-sm font-medium"
                      >
                        Edit
                      </Button>
                      <Button
                        variant='ghost'
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {addresses.length === 0 && !isFormVisible && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No addresses saved yet.</p>
            <Button
              onClick={handleAddNew}
              className="bg-safari-pink hover:bg-safari-pink-dark text-white"
            >
              Add Your First Address
            </Button>
          </div>
        )}
      </div>
      
      {/* Confirmation Notification */}
      {confirmation && (
        <Confirmation
          message={confirmation.message}
          type={confirmation.type}
          onClose={() => setConfirmation(null)}
        />
      )}
    </>
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
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

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
                  <span></span>
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