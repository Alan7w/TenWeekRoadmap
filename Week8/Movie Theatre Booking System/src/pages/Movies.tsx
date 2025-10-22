import React from 'react';

const Movies: React.FC = () => {
  // Mock movie data for demonstration
  const movies = [
    {
      id: 1,
      title: "The Amazing Adventure",
      poster: "https://via.placeholder.com/300x450/4F46E5/FFFFFF?text=Movie+1",
      genre: "Action",
      rating: "PG-13",
      duration: "2h 15m"
    },
    {
      id: 2,
      title: "Romance in Paris",
      poster: "https://via.placeholder.com/300x450/EC4899/FFFFFF?text=Movie+2",
      genre: "Romance",
      rating: "PG",
      duration: "1h 45m"
    },
    {
      id: 3,
      title: "Space Odyssey",
      poster: "https://via.placeholder.com/300x450/10B981/FFFFFF?text=Movie+3",
      genre: "Sci-Fi",
      rating: "PG-13",
      duration: "2h 30m"
    },
    {
      id: 4,
      title: "Comedy Central",
      poster: "https://via.placeholder.com/300x450/F59E0B/FFFFFF?text=Movie+4",
      genre: "Comedy",
      rating: "R",
      duration: "1h 30m"
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Now Showing</h1>
        <p className="text-gray-600">Discover the latest movies in theaters</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src={movie.poster} 
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Genre: {movie.genre}</p>
                <p>Rating: {movie.rating}</p>
                <p>Duration: {movie.duration}</p>
              </div>
              <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
                Book Tickets
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">More Movies Coming Soon</h2>
        <p className="text-gray-600 mb-6">Stay tuned for upcoming releases and special screenings</p>
        <button className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
          View Coming Soon
        </button>
      </div>
    </div>
  );
};

export default Movies;