import React from 'react';

const Cart: React.FC = () => {
  // Mock cart data for demonstration
  const cartItems = [
    {
      id: 1,
      movieTitle: "The Amazing Adventure",
      showtime: "7:30 PM",
      date: "Oct 21, 2025",
      seats: ["A5", "A6"],
      price: 15.99
    },
    {
      id: 2,
      movieTitle: "Romance in Paris",
      showtime: "9:15 PM",
      date: "Oct 22, 2025",
      seats: ["B8", "B9"],
      price: 15.99
    }
  ];

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.seats.length), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
        <p className="text-gray-600">Review your movie selections before checkout</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some movie tickets to get started!</p>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
            Browse Movies
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.movieTitle}</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>📅 {item.date} at {item.showtime}</p>
                      <p>🎫 Seats: {item.seats.join(", ")}</p>
                      <p>💰 ${item.price} × {item.seats.length} tickets</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">${(item.price * item.seats.length).toFixed(2)}</p>
                    <button className="text-red-500 hover:text-red-700 mt-2">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total</span>
              <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600">
                Continue Shopping
              </button>
              <button className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;