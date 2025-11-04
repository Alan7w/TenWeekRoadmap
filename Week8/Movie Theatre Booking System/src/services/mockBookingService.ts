// Mock booking service to simulate backend API calls

// Types for booking service
export interface BookingRequest {
  movieId: number;
  movieTitle: string;
  date: string;
  showtime: string;
  seats: string[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  totalAmount: number;
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  message: string;
  booking?: BookingRequest & {
    id: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    createdAt: string;
    paymentStatus: 'paid' | 'pending' | 'failed';
  };
  error?: string;
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal';
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    holderName: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
  error?: string;
}

// Mock database (in real app, this would be actual database calls)
const bookings: Map<string, BookingResponse['booking']> = new Map();

// Generate unique booking ID
const generateBookingId = (): string => {
  return `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock booking service
export class MockBookingService {
  // Submit booking
  static async createBooking(request: BookingRequest): Promise<BookingResponse> {
    await delay(1500); // Simulate API call delay

    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      return {
        success: false,
        bookingId: '',
        message: 'Booking failed due to seat unavailability',
        error: 'SEATS_UNAVAILABLE'
      };
    }

    // Generate booking
    const bookingId = generateBookingId();
    const booking = {
      ...request,
      id: bookingId,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending' as const,
    };

    // Save to mock database
    bookings.set(bookingId, booking);

    return {
      success: true,
      bookingId,
      message: 'Booking created successfully',
      booking
    };
  }

  // Get booking details
  static async getBooking(bookingId: string): Promise<BookingResponse> {
    await delay(500);

    const booking = bookings.get(bookingId);
    if (!booking) {
      return {
        success: false,
        bookingId: '',
        message: 'Booking not found',
        error: 'BOOKING_NOT_FOUND'
      };
    }

    return {
      success: true,
      bookingId,
      message: 'Booking retrieved successfully',
      booking
    };
  }
}

// Utility functions
export const calculateTotalAmount = (seats: string[], pricePerSeat: number = 15.99): number => {
  return seats.length * pricePerSeat;
};

export const formatBookingDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const generateBookingSummary = (booking: BookingRequest) => {
  return {
    ...booking,
    formattedDate: formatBookingDate(booking.date),
    totalAmount: calculateTotalAmount(booking.seats),
    seatCount: booking.seats.length,
  };
};