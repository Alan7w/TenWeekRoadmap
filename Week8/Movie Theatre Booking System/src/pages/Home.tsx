import React from 'react';

const Home: React.FC = () => {
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

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">🎥 Latest Movies</h3>
          <p className="text-gray-600 mb-4">
            Discover the newest blockbusters and indie films now showing.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Browse Movies
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">🎫 Easy Booking</h3>
          <p className="text-gray-600 mb-4">
            Select your showtime, choose seats, and complete booking in minutes.
          </p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Book Now
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">🛒 Manage Cart</h3>
          <p className="text-gray-600 mb-4">
            Review your selections and complete your movie booking.
          </p>
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            View Cart
          </button>
        </div>
      </div>

      <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ready for Movie Night?</h2>
        <p className="mb-6">Join thousands of movie lovers who book with us every day.</p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Start Booking
        </button>
      </div>
    </div>
  );
};

export default Home;