import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { BookingProvider } from './contexts/BookingContext';

// Import pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import CustomerInfo from './pages/CustomerInfo';

import './App.css';

function App() {
  return (
    <Router>
      <BookingProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<div>Movie Details (Coming Soon)</div>} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/customer-info" element={<CustomerInfo />} />
            <Route path="/booking/confirmation" element={<BookingConfirmation />} />
          </Routes>
        </Layout>
      </BookingProvider>
    </Router>
  );
}

export default App;