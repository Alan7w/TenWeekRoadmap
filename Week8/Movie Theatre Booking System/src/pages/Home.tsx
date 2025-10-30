import { Link } from 'react-router-dom';
import { usePopularMovies } from '../hooks/useMovies';
import { getImageUrl } from '../utils/movie';

const Home = () => {
  const { data: moviesData, isLoading } = usePopularMovies();
  const featuredMovies = moviesData?.results?.slice(1, 4) || [];
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎬 Welcome to Cinema Booking System
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Book your favorite movies with ease. Discover the latest releases, 
          reserve your seats, and enjoy an amazing cinema experience.
        </p>
      </div>

      {/* Featured Movies Section */}
      {!isLoading && featuredMovies.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Movies</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredMovies.map((movie) => (
              <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={movie.poster_path ? getImageUrl(movie.poster_path, 'w342') : 'https://via.placeholder.com/342x513/6B7280/FFFFFF?text=No+Image'}
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">⭐ {movie.vote_average.toFixed(1)}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{movie.overview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">🎥 Latest Movies</h3>
          <p className="text-gray-600 mb-4">
            Discover the newest blockbusters and indie films now showing.
          </p>
          <Link to="/movies" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block">
            Browse Movies
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">🎫 Easy Booking</h3>
          <p className="text-gray-600 mb-4">
            Select your showtime, choose seats, and complete booking in minutes.
          </p>
          <Link to="/booking" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block">
            Book Now
          </Link>
        </div>
      </div>

      <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ready for Movie Night?</h2>
        <p className="mb-6">Join thousands of movie lovers who book with us every day.</p>
        <Link to="/movies" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block">
          Start Booking
        </Link>
      </div>
    </div>
  );
};

export default Home;