import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Loading } from '../components';

// Account sub-components
const AccountInfo = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading account data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loading text="Loading account info..." size="md" />
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Account Information</h2>
      <p className="text-gray-600">Account info - to be implemented</p>
    </div>
  );
};

const AddressBook = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading address data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loading text="Loading addresses..." size="md" />
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Address Book</h2>
      <p className="text-gray-600">Address book - to be implemented</p>
    </div>
  );
};

const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading orders data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loading text="Loading orders..." size="md" />
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <p className="text-gray-600">Orders history - to be implemented</p>
    </div>
  );
};

const Favorites = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading favorites data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loading text="Loading favorites..." size="md" />
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
      <p className="text-gray-600">Favorites - to be implemented</p>
    </div>
  );
};

const Account: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="w-64">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Dashboard</h1>
          <nav className="space-y-2">
            <div className="text-gray-600">Navigation - to be implemented</div>
          </nav>
        </aside>
        
        <main className="flex-1">
          <Routes>
            <Route index element={<AccountInfo />} />
            <Route path="address-book" element={<AddressBook />} />
            <Route path="orders" element={<Orders />} />
            <Route path="favorites" element={<Favorites />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Account;