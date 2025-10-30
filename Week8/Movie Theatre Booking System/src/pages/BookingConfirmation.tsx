import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MockBookingService, type BookingResponse } from '../services/mockBookingService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get('bookingId');
  
  const [booking, setBooking] = useState<BookingResponse['booking'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided');
      setIsLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await MockBookingService.getBooking(bookingId);
        if (response.success && response.booking) {
          setBooking(response.booking);
        } else {
          setError(response.error || 'Booking not found');
        }
      } catch (err) {
        console.error('Failed to load booking details:', err);
        setError('Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Booking not found</h2>
        <p className="text-gray-500 mb-6">{error || 'The booking you are looking for does not exist'}</p>
        <Link 
          to="/movies" 
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block"
        >
          Browse Movies
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          {booking.status === 'confirmed' ? 'Booking Confirmed!' : 'Booking Received!'}
        </h1>
        <p className="text-gray-600">
          {booking.status === 'confirmed' 
            ? 'Your movie tickets have been confirmed' 
            : 'Your booking is being processed'
          }
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
            <p className="text-gray-600">Booking ID: {booking.id}</p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {booking.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Movie & Show Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Movie Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Movie:</span> {booking.movieTitle}</p>
              <p><span className="font-medium">Date:</span> {new Date(booking.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><span className="font-medium">Showtime:</span> {booking.showtime}</p>
              <p><span className="font-medium">Seats:</span> {booking.seats.join(', ')}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {booking.customerInfo.name}</p>
              <p><span className="font-medium">Email:</span> {booking.customerInfo.email}</p>
              <p><span className="font-medium">Phone:</span> {booking.customerInfo.phone}</p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="border-t pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">Payment Information</h3>
              <p className="text-sm text-gray-600">
                Status: <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                  {booking.paymentStatus.toUpperCase()}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">${booking.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">📧 Important Information</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• A confirmation email has been sent to {booking.customerInfo.email}</li>
          <li>• Please arrive at the cinema at least 15 minutes before showtime</li>
          <li>• Show this confirmation on your mobile device at the entrance</li>
          <li>• Tickets can be cancelled up to 2 hours before showtime</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link 
          to="/movies" 
          className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg text-center hover:bg-blue-600 transition-colors"
        >
          Book Another Movie
        </Link>
        <button 
          onClick={() => window.print()} 
          className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Print Ticket
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;