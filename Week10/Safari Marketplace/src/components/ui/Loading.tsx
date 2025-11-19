interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-pink-500 h-full w-full"></div>
    </div>
  );
};

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loading: React.FC<LoadingProps> = ({ 
  text = 'Loading...', 
  size = 'md' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
};

export { LoadingSpinner };
export default Loading;