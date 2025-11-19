import { Link } from 'react-router-dom';
import { Button } from '../components';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-96 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-pink-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page not found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="space-x-4">
          <Link to="/">
            <Button>
              Go Home
            </Button>
          </Link>
          <Link to="/clothes">
            <Button variant="outline">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;