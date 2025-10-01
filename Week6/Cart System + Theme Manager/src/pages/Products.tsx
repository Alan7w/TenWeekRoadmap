import { products } from '../data/products';
import { useCart } from '../contexts/useCart';

export default function Products() {
  const { items, addItem, removeItem } = useCart();

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
              Browse our collection of high-quality products
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-neutral-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const isInCart = items.some(item => item.id === product.id);
              
              return (
                <div key={product.id} className="bg-white dark:bg-neutral-950 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="w-full h-48 mb-4 relative overflow-hidden rounded-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-neutral-900 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-neutral-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => isInCart ? removeItem(product.id) : addItem(product)}
                      className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${isInCart 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                    >
                      {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}


