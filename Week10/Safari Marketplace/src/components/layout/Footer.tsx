import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: Implement newsletter signup
      console.log('Newsletter signup:', email);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-pink-500 tracking-tight">
                Safari
              </span>
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              Your premier destination for fashion, shoes, and accessories.
              Quality products, exceptional service.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Links */}
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
              >
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
              >
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-2.243 0-4.062-1.819-4.062-4.062s1.819-4.062 4.062-4.062 4.062 1.819 4.062 4.062-1.819 4.062-4.062 4.062zm7.519 0c-2.243 0-4.062-1.819-4.062-4.062s1.819-4.062 4.062-4.062 4.062 1.819 4.062 4.062-1.819 4.062-4.062 4.062z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              About Us
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-pink-500 transition-colors duration-200">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-pink-500 transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-pink-500 transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-pink-500 transition-colors duration-200">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-pink-500 transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-pink-500 transition-colors duration-200">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-pink-500 transition-colors duration-200">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-pink-500 transition-colors duration-200">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Get the latest deals and new arrivals delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                required
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-l-none border-l-0"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link to="#" className="text-xs text-gray-500 hover:text-pink-500 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="#" className="text-xs text-gray-500 hover:text-pink-500 transition-colors duration-200">
                Terms & Conditions
              </Link>
              <Link to="#" className="text-xs text-gray-500 hover:text-pink-500 transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-500">
                2025 Safari Marketplace. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                667 Evergreen Rd, Roseville CA 95973
              </p>
              <p className="text-xs text-gray-500 mt-1">
                +44 365 659 459 | welcome@safari.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;