import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox, Loading } from '../components';
import { useAuth } from '../context';
import { validateAuthForm } from '../utils';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  general?: string;
  [key: string]: string | undefined;
}

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  const validateForm = (): boolean => {
    const { isValid, fieldErrors } = validateAuthForm(formData, isSignUp);
    
    const convertedErrors: FormErrors = {};
    Object.entries(fieldErrors).forEach(([field, errorArray]) => {
      convertedErrors[field] = errorArray[0];
    });
    
    setErrors(convertedErrors);
    return isValid;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      if (isSignUp) {
        // Register new user
        const success = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          newsletterSubscription: newsletter
        });
        
        if (success) {
          navigate('/');
        } else {
          setErrors({ general: 'Account with this email already exists' });
        }
      } else {
        // Sign in existing user
        const success = await login(formData.email, formData.password);
        
        if (success) {
          navigate('/');
        } else {
          setErrors({ general: 'Invalid email or password' });
        }
      }
    } catch {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
              <Loading text="Please wait..." size="md" />
            </div>
          )}
          
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Hello there!
              </h1>
              <p className="text-gray-600">
                Please sign in or create account to continue
              </p>
            </div>
            
            {/* General Error */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sign In Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">SIGN IN</h2>
                
                {!isSignUp && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      required
                      className="w-full"
                    />
                    
                    <Input
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      error={errors.password}
                      required
                      className="w-full"
                    />
                    
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      label="Remember my details"
                    />
                    
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isLoading}
                      className="w-full bg-safari-pink hover:bg-safari-pink-dark"
                    >
                      {isLoading ? 'Signing In...' : 'SIGN IN'}
                    </Button>
                    
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-safari-pink"
                      >
                        Forgot password?
                      </Button>
                    </div>
                  </form>
                )}
                
                {isSignUp && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      Already have an account?
                    </p>
                    <Button
                      variant="outline"
                      onClick={switchMode}
                      className="border-safari-pink text-safari-pink hover:bg-safari-pink"
                    >
                      Sign In Instead
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Create Account Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">CREATE ACCOUNT</h2>
                
                {isSignUp && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="First name"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      error={errors.firstName}
                      required
                      className="w-full"
                    />
                    
                    <Input
                      label="Last name"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      error={errors.lastName}
                      required
                      className="w-full"
                    />
                    
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      required
                      className="w-full"
                    />
                    
                    <Input
                      label="Create Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      error={errors.password}
                      required
                      className="w-full"
                    />
                    
                    <Input
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      error={errors.confirmPassword}
                      required
                      className="w-full"
                    />
                    
                    <Checkbox
                      id="newsletter"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      label="I want to receive Safari newsletters with the best deals and offers"
                    />
                    
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isLoading}
                      className="w-full bg-safari-pink hover:bg-safari-pink-dark"
                    >
                      {isLoading ? 'Creating Account...' : 'CREATE ACCOUNT'}
                    </Button>
                  </form>
                )}
                
                {!isSignUp && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      Don't have an account yet?
                    </p>
                    <Button
                      variant="outline"
                      onClick={switchMode}
                      className="border-safari-pink text-safari-pink hover:bg-safari-pink"
                    >
                      Create Account
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;