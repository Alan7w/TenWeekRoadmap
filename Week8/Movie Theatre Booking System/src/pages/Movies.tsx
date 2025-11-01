import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopularMovies100, useMovieSearch, useGenres, useDiscoverMovies100 } from '../hooks/useMovies';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SimpleMovieCard } from '../components/movie/SimpleMovieCard';
import { getImageUrl } from '../utils/movie';
import type { Movie } from '../types';

const Movies = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search query for suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch genres
  const { data: genresData, isLoading: genresLoading } = useGenres();
  const genres = genresData?.genres || [];

  // Determine which data source to use based on filters
  const hasFilters = Boolean((selectedGenre || selectedRating) && !debouncedSearchQuery);
  
  // Popular movies (default view) - 100 movies per page
  const { data: popularData, isLoading: popularLoading, error: popularError } = usePopularMovies100(currentPage, !hasFilters);
  
  // Filtered movies (genre and/or rating) - 100 movies per page
  const { data: filteredData, isLoading: filteredLoading, error: filteredError } = useDiscoverMovies100(
    { 
      page: currentPage, 
      genre: selectedGenre || undefined,
      rating: selectedRating || undefined
    },
    hasFilters
  );
  
  // Use search for suggestions only
  const { data: searchSuggestions, isLoading: suggestionsLoading } = useMovieSearch(
    debouncedSearchQuery, 
    1, 
    debouncedSearchQuery.length >= 2
  );

  // Select appropriate data source
  const data = hasFilters ? filteredData : popularData;
  const isLoading = hasFilters ? filteredLoading : popularLoading;
  const error = hasFilters ? filteredError : popularError;

  const movies = data?.results || [];
  // For popular movies, skip first movie (broken image issue), for filtered movies show all
  const displayMovies = hasFilters ? movies : movies.slice(1);
  const suggestions = searchSuggestions?.results?.slice(0, 8) || []; // Limit to 8 suggestions

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (data && currentPage < data.total_pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && data && page <= data.total_pages) {
      setCurrentPage(page);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length >= 2);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          selectMovie(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const selectMovie = (movie: Movie) => {
    // Show the selected movie card on the page
    setSelectedMovie(movie);
  };

  const handleSuggestionClick = (movie: Movie) => {
    selectMovie(movie);
    setShowSuggestions(false);
    setSearchQuery(movie.title);
  };

  const handleBookNow = (movie: Movie) => {
    // Navigate to booking page with selected movie
    navigate(`/booking?movieId=${movie.id}`);
  };

  const clearSelectedMovie = () => {
    setSelectedMovie(null);
    setSearchQuery('');
  };

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId === selectedGenre ? '' : genreId);
    setCurrentPage(1); // Reset to page 1 when changing genre
    setSelectedMovie(null); // Clear selected movie
  };

  const clearGenreFilter = () => {
    setSelectedGenre('');
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {selectedGenre ? 'Movies by Genre' : 'Popular Movies'}
        </h1>
        <p className="text-gray-600">
          {selectedGenre 
            ? `Browse movies in the ${genres.find(g => g.id.toString() === selectedGenre)?.name || 'selected'} genre`
            : 'Discover the most popular movies from TMDB'
          }
        </p>
      </div>

      {/* Search Input with Autocomplete */}
      <div className="mb-6">
        <div className="max-w-md mx-auto relative" ref={searchContainerRef}>
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Loading indicator for suggestions */}
          {suggestionsLoading && debouncedSearchQuery.length >= 2 && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
              {suggestions.map((movie, index) => (
                <div
                  key={movie.id}
                  onClick={() => handleSuggestionClick(movie)}
                  className={`flex items-center p-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                    selectedSuggestionIndex === index ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <img
                    src={movie.poster_path ? getImageUrl(movie.poster_path, 'w92') : 'https://via.placeholder.com/92x138/6B7280/FFFFFF?text=No+Image'}
                    alt={movie.title}
                    className="w-12 h-18 object-cover rounded mr-3 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{movie.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'} • 
                      ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{movie.overview}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results message */}
          {showSuggestions && debouncedSearchQuery.length >= 2 && suggestions.length === 0 && !suggestionsLoading && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 p-4 text-center text-gray-500 z-50">
              No movies found for "{debouncedSearchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Genre Filter Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter by Genre:</h3>
          {selectedGenre && (
            <button
              onClick={clearGenreFilter}
              className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full transition-colors"
            >
              Clear Filter ×
            </button>
          )}
        </div>
        {genresLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            Loading genres...
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id.toString())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === genre.id.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter by Rating:</h3>
          {selectedRating && (
            <button
              onClick={() => setSelectedRating(null)}
              className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full transition-colors"
            >
              Clear Filter ×
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRating(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedRating
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Any Rating
          </button>
          {[9, 8, 7, 6, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedRating === rating
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {rating}+ ⭐
            </button>
          ))}
        </div>
      </div>

      {/* Selected Movie Card */}
      {selectedMovie && (
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Selected Movie</h2>
            <button
              onClick={clearSelectedMovie}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={selectedMovie.poster_path ? getImageUrl(selectedMovie.poster_path, 'w342') : 'https://via.placeholder.com/342x513/6B7280/FFFFFF?text=No+Image'}
                alt={selectedMovie.title}
                className="w-full max-w-sm rounded-lg shadow-md"
              />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedMovie.title}</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-600">
                  {selectedMovie.release_date ? new Date(selectedMovie.release_date).getFullYear() : 'N/A'}
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  ⭐ {selectedMovie.vote_average ? selectedMovie.vote_average.toFixed(1) : 'N/A'}
                </span>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">{selectedMovie.overview}</p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => handleBookNow(selectedMovie)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Book Now
                </button>
                <button
                  onClick={clearSelectedMovie}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Back to Movies
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load More / Pagination Controls */}
      {data && data.total_pages > 1 && (
        <div className="mb-6 flex justify-center items-center gap-4 bg-white p-4 rounded-lg shadow">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Page</span>
            <input
              type="number"
              min="1"
              max={data.total_pages}
              value={currentPage}
              onChange={handlePageInput}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
            />
            <span className="text-gray-600">of {data.total_pages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= data.total_pages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next →
          </button>
        </div>
      )}

      {displayMovies.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No movies found</h2>
          <p className="text-gray-500">Try refreshing the page</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
          {displayMovies.map((movie: Movie) => (
            <SimpleMovieCard key={movie.id} movie={movie} className="text-sm" />
          ))}
        </div>
      )}

      {/* Bottom Pagination Controls - Duplicate */}
      {data && data.total_pages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4 bg-white p-4 rounded-lg shadow">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Page</span>
            <input
              type="number"
              min="1"
              max={data.total_pages}
              value={currentPage}
              onChange={handlePageInput}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
            />
            <span className="text-gray-600">of {data.total_pages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= data.total_pages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next →
          </button>
        </div>
      )}

      {/* Results info */}
      {data && (
        <div className="mt-8 text-center text-gray-600">
          <p>Showing {displayMovies.length} of {data.total_results.toLocaleString()} movies (up to 100 per page)</p>
          <p>Page {data.page} of {data.total_pages.toLocaleString()}</p>
          {selectedGenre && (
            <p className="text-sm mt-1">
              Filtered by: {genres.find(g => g.id.toString() === selectedGenre)?.name}
            </p>
          )}
          {selectedRating && (
            <p className="text-sm mt-1">
              Minimum rating: {selectedRating}+ ⭐
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Movies;