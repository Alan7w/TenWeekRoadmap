import type { Booking, Seat, Showtime, CustomerInfo, Ticket } from '../types'
import { generateId } from '../utils'
import { STORAGE_KEYS, BOOKING_CONFIG } from '../constants'

/**
 * Booking Service - handles all booking-related operations
 * Since this is a demo app, all data is stored in localStorage
 */
export class BookingService {
  /**
   * Generate sample showtimes for a movie
   */
  static generateShowtimes(movieId: number): Showtime[] {
    const today = new Date()
    const showtimes: Showtime[] = []
    
    // Generate showtimes for next 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date(today)
      date.setDate(today.getDate() + day)
      
      const times = ['10:00', '13:30', '16:45', '19:20', '22:00']
      
      times.forEach(time => {
        showtimes.push({
          id: generateId(),
          movieId,
          theatreId: 'theatre-1',
          date: date.toISOString().split('T')[0],
          time,
          price: {
            standard: 12.99,
            premium: 16.99,
            vip: 24.99
          },
          availableSeats: Math.floor(Math.random() * 40) + 80, // 80-120 available seats
          totalSeats: 120
        })
      })
    }
    
    return showtimes
  }

  /**
   * Reserve seats temporarily (for booking flow)
   */
  static reserveSeats(seats: Seat[], duration: number = BOOKING_CONFIG.SEAT_HOLD_TIME): void {
    const reservationData = {
      seats: seats.map(seat => seat.id),
      expiresAt: Date.now() + duration,
      reservationId: generateId()
    }
    
    localStorage.setItem(STORAGE_KEYS.SELECTED_SEATS, JSON.stringify(reservationData))
  }

  /**
   * Release reserved seats
   */
  static releaseSeats(): void {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_SEATS)
  }

  /**
   * Check if seats are still reserved
   */
  static areSeatsReserved(): boolean {
    const reservationData = localStorage.getItem(STORAGE_KEYS.SELECTED_SEATS)
    if (!reservationData) return false
    
    try {
      const data = JSON.parse(reservationData)
      return Date.now() < data.expiresAt
    } catch {
      return false
    }
  }

  /**
   * Create a new booking
   */
  static async createBooking(
    movieId: number,
    showtimeId: string,
    selectedSeats: Seat[],
    customerInfo: CustomerInfo
  ): Promise<Booking> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate occasional booking failure (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Booking failed due to a system error. Please try again.')
    }
    
    const booking: Booking = {
      id: generateId(),
      movieId,
      showtimeId,
      theatreId: 'theatre-1',
      selectedSeats,
      customerInfo,
      totalAmount: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    }
    
    // Save booking to localStorage
    this.saveBooking(booking)
    
    // Release seat reservation
    this.releaseSeats()
    
    return booking
  }

  /**
   * Save booking to localStorage
   */
  static saveBooking(booking: Booking): void {
    const existingBookings = this.getBookings()
    existingBookings.push(booking)
    localStorage.setItem(STORAGE_KEYS.BOOKING_STATE, JSON.stringify(existingBookings))
  }

  /**
   * Get all bookings from localStorage
   */
  static getBookings(): Booking[] {
    const bookingsData = localStorage.getItem(STORAGE_KEYS.BOOKING_STATE)
    if (!bookingsData) return []
    
    try {
      return JSON.parse(bookingsData)
    } catch {
      return []
    }
  }

  /**
   * Get booking by ID
   */
  static getBooking(bookingId: string): Booking | null {
    const bookings = this.getBookings()
    return bookings.find(booking => booking.id === bookingId) || null
  }

  /**
   * Generate tickets for a booking
   */
  static generateTickets(booking: Booking): Ticket[] {
    return booking.selectedSeats.map(seat => ({
      id: generateId(),
      bookingId: booking.id,
      movieTitle: `Movie ${booking.movieId}`, // In real app, fetch movie title
      theatreName: 'Cinema Plus Theatre 1',
      showtime: '19:20', // In real app, get from showtime
      seat: {
        row: seat.row,
        number: seat.number,
        type: seat.type
      },
      price: seat.price,
      qrCode: this.generateQRCode(booking.id, seat.id)
    }))
  }

  /**
   * Generate QR code data for ticket
   */
  static generateQRCode(bookingId: string, seatId: string): string {
    // In a real app, this would generate actual QR code data
    return `TICKET-${bookingId}-${seatId}-${Date.now()}`
  }

  /**
   * Cancel booking
   */
  static cancelBooking(bookingId: string): boolean {
    const bookings = this.getBookings()
    const bookingIndex = bookings.findIndex(b => b.id === bookingId)
    
    if (bookingIndex === -1) return false
    
    bookings[bookingIndex].status = 'cancelled'
    localStorage.setItem(STORAGE_KEYS.BOOKING_STATE, JSON.stringify(bookings))
    
    return true
  }

  /**
   * Validate booking form data
   */
  static validateBookingForm(data: CustomerInfo): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (!data.firstName.trim()) {
      errors.push('First name is required')
    }
    
    if (!data.lastName.trim()) {
      errors.push('Last name is required')
    }
    
    if (!data.email.trim()) {
      errors.push('Email is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address')
    }
    
    if (!data.phone.trim()) {
      errors.push('Phone number is required')
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(data.phone)) {
      errors.push('Please enter a valid phone number')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Clear all booking data (for testing/demo)
   */
  static clearAllBookings(): void {
    localStorage.removeItem(STORAGE_KEYS.BOOKING_STATE)
    localStorage.removeItem(STORAGE_KEYS.SELECTED_SEATS)
  }
}