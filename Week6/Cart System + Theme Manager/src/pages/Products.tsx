export default function Products() {
  return (
    <div className="min-h-full">
      {/* Hero Section with Purple Gradient */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Products
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Our complete product catalog will be available here soon. Come back on Day 5-7 for the full shopping experience!
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-neutral-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder cards */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-neutral-950 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all animate-pulse">
                <div className="w-full h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3 mb-3"></div>
                <div className="h-6 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded"></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
              Exciting products are coming soon! Stay tuned for our amazing collection.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
              Get Notified
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}


