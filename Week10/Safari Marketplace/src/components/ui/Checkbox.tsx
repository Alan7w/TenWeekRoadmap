import { useId } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  error,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={checkboxId}
          type="checkbox"
          className={`h-4 w-4 text-safari-pink focus:ring-safari-pink border-gray-300 rounded
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={checkboxId} className="text-gray-700 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-gray-500 mt-1">{description}</p>
        )}
        {error && (
          <p className="text-red-600 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Checkbox;