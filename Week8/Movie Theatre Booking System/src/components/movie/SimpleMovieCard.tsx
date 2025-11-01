import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/movie';
import type { Movie } from '../../types';

interface SimpleMovieCardProps {
  movie: Movie;
  className?: string;
}

export const SimpleMovieCard = ({ movie, className = '' }: SimpleMovieCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="relative">
        <img 
          src={movie.poster_path ? getImageUrl(movie.poster_path, 'w342') : '/placeholder-movie.jpg'}
          alt={movie.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/342x513/6B7280/FFFFFF?text=No+Image';
          }}
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{movie.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          Release: {new Date(movie.release_date).getFullYear()}
        </p>
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{movie.overview}</p>
        <div className="flex gap-2">
          <Link 
            to={`/movies/${movie.id}`}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition-colors"
          >
            View Details
          </Link>
          <Link 
            to={`/booking?movieId=${movie.id}`}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded text-center hover:bg-green-600 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};