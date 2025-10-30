import { usePopularMovies } from '../hooks/useMovies';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SimpleMovieCard } from '../components/movie/SimpleMovieCard';
import type { Movie } from '../types';

const Movies = () => {
  const { data, isLoading, error } = usePopularMovies();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Failed to load movies</h2>
        <p className="text-gray-500 mb-6">There was an error fetching movies from TMDB API</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const movies = data?.results || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Popular Movies</h1>
        <p className="text-gray-600">Discover the most popular movies from TMDB</p>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No movies found</h2>
          <p className="text-gray-500">Try refreshing the page</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie: Movie) => (
            <SimpleMovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* Pagination info */}
      {data && (
        <div className="mt-8 text-center text-gray-600">
          <p>Showing {movies.length} of {data.total_results} movies</p>
          <p>Page {data.page} of {data.total_pages}</p>
        </div>
      )}
    </div>
  );
};

export default Movies;