import { NavLink } from 'react-router-dom';
import { useCart } from '../contexts/useCart';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart();
  const TAX_RATE = 0.08; // 8% tax rate
  const SHIPPING_FEE = 5.99;

  // Calculate cart totals
  const subtotal = getTotalPrice();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + (items.length > 0 ? SHIPPING_FEE : 0);

  return (
    <div className="min-h-full">
      {/* Hero Section with Purple Gradient */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <p className="text-xl text-blue-100">
              {items.length === 0 ? 'Your cart is empty' : `You have ${items.length} item${items.length === 1 ? '' : 's'} in your cart`}
            </p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12 bg-neutral-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="bg-white dark:bg-neutral-950 rounded-xl p-8 shadow-sm">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                  Your cart is empty
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <NavLink
                  to="/products"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 cursor-pointer"
                >
                  Browse Products
                </NavLink>
              </div>
            ) : (
              <div>
                {/* Cart Items */}
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {items.map((item) => (
                    <div key={item.id} className="py-6 flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="ml-6 flex-1">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{item.name}</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">${item.price.toFixed(2)}</p>
                        <div className="mt-2 flex items-center">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="mx-4 text-neutral-900 dark:text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-6 text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="ml-6">
                        <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Shipping</span>
                      <span>${SHIPPING_FEE.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 flex justify-between font-semibold text-lg text-neutral-900 dark:text-white">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 cursor-pointer">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


