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

  // Process payment
  static async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    await delay(2000); // Simulate payment processing delay

    const booking = bookings.get(request.bookingId);
    if (!booking) {
      return {
        success: false,
        transactionId: '',
        message: 'Booking not found',
        error: 'BOOKING_NOT_FOUND'
      };
    }

    // Simulate payment failure (5% chance)
    if (Math.random() < 0.05) {
      return {
        success: false,
        transactionId: '',
        message: 'Payment processing failed',
        error: 'PAYMENT_FAILED'
      };
    }

    // Update booking status
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    bookings.set(request.bookingId, booking);

    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    return {
      success: true,
      transactionId,
      message: 'Payment processed successfully'
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

  // Get user bookings (simulate user authentication)
  static async getUserBookings(userEmail: string): Promise<BookingResponse['booking'][]> {
    await delay(800);

    const userBookings = Array.from(bookings.values()).filter(
      (booking): booking is NonNullable<typeof booking> => 
        booking != null && booking.customerInfo.email === userEmail
    );

    return userBookings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Cancel booking
  static async cancelBooking(bookingId: string): Promise<BookingResponse> {
    await delay(1000);

    const booking = bookings.get(bookingId);
    if (!booking) {
      return {
        success: false,
        bookingId: '',
        message: 'Booking not found',
        error: 'BOOKING_NOT_FOUND'
      };
    }

    booking.status = 'cancelled';
    bookings.set(bookingId, booking);

    return {
      success: true,
      bookingId,
      message: 'Booking cancelled successfully',
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