// Booking System Types

export type SeatStatus = 'available' | 'occupied' | 'selected' | 'reserved'
export type SeatType = 'standard' | 'premium' | 'vip'
export type BookingStep = 'movie-selection' | 'showtime-selection' | 'seat-selection' | 'customer-info' | 'payment' | 'confirmation'

export interface Seat {
  id: string
  row: string
  number: number
  type: SeatType
  status: SeatStatus
  price: number
}

export interface Theatre {
  id: string
  name: string
  location: string
  rows: string[]
  seatsPerRow: number
  seatLayout: Seat[][]
}

export interface Showtime {
  id: string
  movieId: number
  theatreId: string
  date: string
  time: string
  price: {
    standard: number
    premium: number
    vip: number
  }
  availableSeats: number
  totalSeats: number
}

export interface Booking {
  id: string
  movieId: number
  showtimeId: string
  theatreId: string
  selectedSeats: Seat[]
  customerInfo: CustomerInfo
  totalAmount: number
  bookingDate: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface BookingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  paymentMethod: 'card' | 'cash'
  cardDetails?: {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardHolderName: string
  }
}

// Ticket Interface
export interface Ticket {
  id: string
  bookingId: string
  movieTitle: string
  theatreName: string
  showtime: string
  seat: {
    row: string
    number: number
    type: SeatType
  }
  price: number
  qrCode: string
}