import type { Seat, SeatType } from '../types'
import { THEATRE_CONFIG } from '../constants'

/**
 * Generate seat ID from row and number
 */
export const generateSeatId = (row: string, number: number): string => {
  return `${row}${number.toString().padStart(2, '0')}`
}

/**
 * Parse seat ID to get row and number
 */
export const parseSeatId = (seatId: string): { row: string; number: number } => {
  const row = seatId.slice(0, 1)
  const number = parseInt(seatId.slice(1), 10)
  return { row, number }
}

/**
 * Generate initial theatre layout
 */
export const generateTheatreLayout = (): Seat[][] => {
  const layout: Seat[][] = []
  
  THEATRE_CONFIG.ROWS.forEach((row, rowIndex) => {
    const seatRow: Seat[] = []
    
    for (let seatNumber = 1; seatNumber <= THEATRE_CONFIG.SEATS_PER_ROW; seatNumber++) {
      const seatId = generateSeatId(row, seatNumber)
      
      // Determine seat type based on position
      let seatType: SeatType = 'standard'
      if (rowIndex >= 7) { // Last 3 rows are VIP
        seatType = 'vip'
      } else if (seatNumber >= 4 && seatNumber <= 9) { // Middle seats are premium
        seatType = 'premium'
      }
      
      // Randomly make some seats occupied (for demo)
      const isOccupied = Math.random() < 0.15 // 15% chance of being occupied
      
      seatRow.push({
        id: seatId,
        row,
        number: seatNumber,
        type: seatType,
        status: isOccupied ? 'occupied' : 'available',
        price: THEATRE_CONFIG.SEAT_TYPES[seatType.toUpperCase() as keyof typeof THEATRE_CONFIG.SEAT_TYPES].price
      })
    }
    
    layout.push(seatRow)
  })
  
  return layout
}

/**
 * Calculate total price for selected seats
 */
export const calculateTotalPrice = (seats: Seat[]): number => {
  return seats.reduce((total, seat) => total + seat.price, 0)
}

/**
 * Get seat display name (e.g., "A5")
 */
export const getSeatDisplayName = (seat: Seat): string => {
  return `${seat.row}${seat.number}`
}

/**
 * Group seats by row for display
 */
export const groupSeatsByRow = (seats: Seat[]): Record<string, Seat[]> => {
  return seats.reduce((groups, seat) => {
    if (!groups[seat.row]) {
      groups[seat.row] = []
    }
    groups[seat.row].push(seat)
    return groups
  }, {} as Record<string, Seat[]>)
}

/**
 * Get available seats count for a showtime
 */
export const getAvailableSeatsCount = (seatLayout: Seat[][]): number => {
  return seatLayout.flat().filter(seat => seat.status === 'available').length
}

/**
 * Format showtime for display
 */
export const formatShowtime = (date: string, time: string): string => {
  const showDate = new Date(date)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  let dateStr = ''
  if (showDate.toDateString() === today.toDateString()) {
    dateStr = 'Today'
  } else if (showDate.toDateString() === tomorrow.toDateString()) {
    dateStr = 'Tomorrow'
  } else {
    dateStr = showDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }
  
  return `${dateStr} at ${time}`
}