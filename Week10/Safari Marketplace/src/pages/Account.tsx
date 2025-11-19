import { Routes, Route } from 'react-router-dom';

// Account sub-components (placeholder)
const AccountInfo = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Account Information</h2>
    <p className="text-gray-600">Account info - to be implemented</p>
  </div>
);

const AddressBook = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Address Book</h2>
    <p className="text-gray-600">Address book - to be implemented</p>
  </div>
);

const Orders = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">My Orders</h2>
    <p className="text-gray-600">Orders history - to be implemented</p>
  </div>
);

const Favorites = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
    <p className="text-gray-600">Favorites - to be implemented</p>
  </div>
);

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