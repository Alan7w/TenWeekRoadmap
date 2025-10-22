import React, { useState } from 'react';

const Booking: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<string>('');

  // Mock data for demonstration
  const movie = {
    title: "The Amazing Adventure",
    poster: "https://via.placeholder.com/200x300/4F46E5/FFFFFF?text=Movie",
    genre: "Action",
    rating: "PG-13",
    duration: "2h 15m"
  };

  const showtimes = ["2:00 PM", "5:30 PM", "7:30 PM", "9:15 PM"];
  
  // Generate seat grid
  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 10;
    const seats = [];
    
    for (const row of rows) {
      for (let i = 1; i <= seatsPerRow; i++) {
        seats.push(`${row}${i}`);
      }
    }
    return seats;
  };

  const allSeats = generateSeats();
  const bookedSeats = ['A3', 'A4', 'B5', 'C7', 'C8', 'D2']; // Mock booked seats

  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seat) 
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
  };

  const getSeatStyle = (seat: string) => {
    if (bookedSeats.includes(seat)) {
      return 'bg-red-500 text-white cursor-not-allowed';
    }
    if (selectedSeats.includes(seat)) {
      return 'bg-blue-500 text-white';
    }
    return 'bg-gray-200 hover:bg-gray-300 cursor-pointer';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Your Tickets</h1>
        <p className="text-gray-600">Select showtime and seats for your movie</p>
      </div>

      {/* Movie Info */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex gap-6">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-32 h-48 object-cover rounded"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
            <div className="space-y-1 text-gray-600">
              <p>Genre: {movie.genre}</p>
              <p>Rating: {movie.rating}</p>
              <p>Duration: {movie.duration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Showtime Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Select Showtime</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {showtimes.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedShowtime(time)}
              className={`p-3 rounded border-2 ${
                selectedShowtime === time
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Seat Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Select Seats</h3>
        
        {/* Screen */}
        <div className="text-center mb-6">
          <div className="bg-gray-800 text-white py-2 px-8 rounded-t-lg inline-block">
            SCREEN
          </div>
        </div>

        {/* Seat Grid */}
        <div className="grid grid-cols-10 gap-2 max-w-2xl mx-auto mb-6">
          {allSeats.map((seat) => (
            <button
              key={seat}
              onClick={() => toggleSeat(seat)}
              className={`w-8 h-8 text-xs font-medium rounded ${getSeatStyle(seat)}`}
              disabled={bookedSeats.includes(seat)}
            >
              {seat}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      {(selectedSeats.length > 0 && selectedShowtime) && (
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
          <div className="space-y-2 mb-4">
            <p><strong>Movie:</strong> {movie.title}</p>
            <p><strong>Showtime:</strong> {selectedShowtime}</p>
            <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
            <p><strong>Total:</strong> ${(selectedSeats.length * 15.99).toFixed(2)}</p>
          </div>
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default Booking;