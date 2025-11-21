// Form validation utilities for authentication

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate name fields
 */
export const validateName = (name: string, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name || !name.trim()) {
    errors.push(`${fieldName} is required`);
  } else if (name.trim().length < 2) {
    errors.push(`${fieldName} must be at least 2 characters long`);
  } else if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push('Password confirmation is required');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Comprehensive form validation for authentication
 */
export const validateAuthForm = (
  formData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    confirmPassword?: string;
  },
  isSignUp: boolean = false
): { isValid: boolean; fieldErrors: Record<string, string[]> } => {
  const fieldErrors: Record<string, string[]> = {};
  
  // Email validation
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    fieldErrors.email = emailValidation.errors;
  }
  
  // Password validation
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    fieldErrors.password = passwordValidation.errors;
  }
  
  // Sign-up validations
  if (isSignUp) {
    // First name validation
    if (formData.firstName !== undefined) {
      const firstNameValidation = validateName(formData.firstName, 'First name');
      if (!firstNameValidation.isValid) {
        fieldErrors.firstName = firstNameValidation.errors;
      }
    }
    
    // Last name validation
    if (formData.lastName !== undefined) {
      const lastNameValidation = validateName(formData.lastName, 'Last name');
      if (!lastNameValidation.isValid) {
        fieldErrors.lastName = lastNameValidation.errors;
      }
    }
    
    // Password confirmation validation
    if (formData.confirmPassword !== undefined) {
      const confirmPasswordValidation = validatePasswordConfirmation(
        formData.password,
        formData.confirmPassword
      );
      if (!confirmPasswordValidation.isValid) {
        fieldErrors.confirmPassword = confirmPasswordValidation.errors;
      }
    }
  }
  
  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors
  };
};