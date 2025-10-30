import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMovieDetails } from '../hooks/useMovies';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { getImageUrl } from '../utils/movie';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const movieId = searchParams.get('movie');
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Fetch movie details if movieId is provided
  const { data: movie, isLoading, error } = useMovieDetails(
    movieId ? parseInt(movieId) : 0,
    !!movieId
  );

  // Generate dates for the next 7 days
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  const availableDates = generateDates();

  // Set default date to today
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0].value);
    }
  }, [availableDates, selectedDate]);

  // Mock showtimes based on selected date
  const showtimes = ["2:00 PM", "5:30 PM", "7:30 PM", "9:15 PM"];

  // Show loading state
  if (movieId && isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error state
  if (movieId && error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Movie not found</h2>
        <p className="text-gray-500 mb-6">The selected movie could not be loaded</p>
        <button 
          onClick={() => navigate('/movies')} 
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Browse Movies
        </button>
      </div>
    );
  }

  // Show movie selection if no movie is selected
  if (!movieId || !movie) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Select a Movie</h2>
        <p className="text-gray-500 mb-6">Please select a movie from our collection to book tickets</p>
        <button 
          onClick={() => navigate('/movies')} 
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Browse Movies
        </button>
      </div>
    );
  }
  
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
            src={movie.poster_path ? getImageUrl(movie.poster_path, 'w342') : 'https://via.placeholder.com/200x300/6B7280/FFFFFF?text=No+Image'} 
            alt={movie.title}
            className="w-32 h-48 object-cover rounded"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
            <div className="space-y-1 text-gray-600">
              <p>Genres: {movie.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
              <p>Rating: ⭐ {movie.vote_average.toFixed(1)}/10</p>
              <p>Duration: {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</p>
              <p>Release: {new Date(movie.release_date).getFullYear()}</p>
            </div>
            <p className="mt-3 text-gray-700">{movie.overview}</p>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Select Date</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {availableDates.map((date) => (
            <button
              key={date.value}
              onClick={() => {
                setSelectedDate(date.value);
                setSelectedShowtime(''); // Reset showtime when date changes
              }}
              className={`p-3 rounded border-2 text-center ${
                selectedDate === date.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {date.label}
            </button>
          ))}
        </div>
      </div>

      {/* Showtime Selection */}
      {selectedDate && (
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
      )}

      {/* Seat Selection */}
      {selectedDate && selectedShowtime && (
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
      )}

      {/* Booking Summary */}
      {(selectedSeats.length > 0 && selectedShowtime && selectedDate) && (
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
          <div className="space-y-2 mb-4">
            <p><strong>Movie:</strong> {movie.title}</p>
            <p><strong>Date:</strong> {availableDates.find(d => d.value === selectedDate)?.label}</p>
            <p><strong>Showtime:</strong> {selectedShowtime}</p>
            <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
            <p><strong>Price per ticket:</strong> $15.99</p>
            <p><strong>Total:</strong> ${(selectedSeats.length * 15.99).toFixed(2)}</p>
          </div>
          <div className="flex gap-3">
            <button 
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
              onClick={() => {
                // Add to cart functionality (simple alert for now)
                alert(`Added ${selectedSeats.length} seats to cart for ${movie.title}`);
              }}
            >
              Add to Cart
            </button>
            <button 
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
              onClick={() => {
                // Direct booking - navigate to customer info form
                const bookingData = {
                  movieId: movie.id,
                  movieTitle: movie.title,
                  date: selectedDate,
                  showtime: selectedShowtime,
                  seats: selectedSeats,
                  totalAmount: selectedSeats.length * 15.99
                };
                
                // Store booking data in session storage for the customer info form
                sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
                
                // Navigate to customer info form (we'll create this next)
                window.location.href = '/booking/customer-info';
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;