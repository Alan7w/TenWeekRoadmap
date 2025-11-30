import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { mockProducts } from '../data/products';
import { formatCurrency } from '../utils';
import type { Product } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const featuredProducts = mockProducts.filter(product => product.featured).slice(0, 12);

  // Hero slides data
  const heroSlides = [
    {
      id: 1,
      title: 'Elegance',
      subtitle: 'Explore our collection',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop&crop=faces',
      bgColor: 'from-safari-pink to-pink-400'
    },
    {
      id: 2,
      title: 'Style',
      subtitle: 'Discover your look',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop&crop=faces',
      bgColor: 'from-purple-400 to-purple-500'
    },
    {
      id: 3,
      title: 'Fashion',
      subtitle: 'Latest trends',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&crop=faces',
      bgColor: 'from-blue-400 to-blue-500'
    }
  ];

  // Slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/${category}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`h-full bg-linear-to-br ${slide.bgColor} relative`}>
              {/* Hero Content */}
              <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* Left Side - Text */}
                <div className="w-1/2 z-10">
                  <h1 className="text-9xl font-bold text-white/20 stroke-2 stroke-white mb-8">
                    {slide.title}
                  </h1>
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                    <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-white/80 stroke-2 stroke-white">
                      Safari
                    </h1>
                  </div>
                </div>

                {/* Right Side - Image */}
                <div className="w-1/2 h-full relative">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute right-0 top-0 h-full w-auto object-cover object-center"
                  />
                  {/* Slideshow Dots */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-white scale-125' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Explore Collection button */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-20">
                <button
                  onClick={() => handleCategoryClick('clothes')}
                  className="text-white text-lg font-medium hover:text-pink-500 hover:cursor-pointer transition-colors flex flex-col items-center group"
                >
                  <span className="mb-2">{slide.subtitle}</span>
                  <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center group-hover:border-pink-500 transition-colors">
                    <svg 
                      className="w-3 h-3 text-white group-hover:text-pink-500 transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Shop Your Style Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Shop your style</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae gravida cursus adipiscing 
              viverra at tortor, egestas odio parturient. Morbi ut lorem in erat. Et et molestie diam 
              diam ultricies. Scelerisque duis diam ac cras dictum adipiscing. Venenatis at sit proin 
              ut vitae adipiscing id facilisis.
            </p>
          </div>

          {/* Featured Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-safari-pink transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* View All Products Button */}
          <div className="text-center mt-16">
            <Button
              onClick={() => handleCategoryClick('clothes')}
              className="bg-safari-pink hover:bg-safari-pink-dark text-white px-8 py-3 text-lg font-medium"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Category Navigation Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Browse Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Clothes Category */}
            <div
              onClick={() => handleCategoryClick('clothes')}
              className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square bg-linear-to-br from-pink-100 to-pink-200">
                <img
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=450&fit=crop"
                  alt="Clothes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-safari-pink transition-colors">
                  Clothes
                </h3>
                <p className="text-gray-600">Discover our latest fashion collection</p>
              </div>
            </div>

            {/* Shoes Category */}
            <div
              onClick={() => handleCategoryClick('shoes')}
              className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square bg-linear-to-br from-blue-100 to-blue-200">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=450&fit=crop"
                  alt="Shoes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-safari-pink transition-colors">
                  Shoes
                </h3>
                <p className="text-gray-600">Step up your style game</p>
              </div>
            </div>

            {/* Accessories Category */}
            <div
              onClick={() => handleCategoryClick('accessories')}
              className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square bg-linear-to-br from-purple-100 to-purple-200">
                <img
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=450&fit=crop"
                  alt="Accessories"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-safari-pink transition-colors">
                  Accessories
                </h3>
                <p className="text-gray-600">Perfect finishing touches</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;