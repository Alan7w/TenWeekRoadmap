import { NavLink } from 'react-router-dom';

export default function Cart() {
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
              Manage your selected items and proceed to checkout
            </p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12 bg-neutral-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="bg-white dark:bg-neutral-950 rounded-xl p-8 shadow-sm">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                </svg>
              </div>
              <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Your cart is empty</h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
                Cart functionality will be implemented on Day 5. Start shopping to add items here and experience our seamless checkout process!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NavLink
                  to="/products"
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Start Shopping
                </NavLink>
                <NavLink
                  to="/"
                  className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
                >
                  Back to Home
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


