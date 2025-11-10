// Enhanced User Profile Component
import React, { useState, useCallback, useMemo } from 'react';
import type {
  EnhancedUserProfileProps,
  UpdateUserInput,
  UserPreferences,
  ValidationResult,
  LoadingState,
} from '../types';
import { isValidEmail, isValidUrl, ROLE_CONFIG, USER_PERMISSIONS, hasPermission } from '../types';

interface UserFormData extends Record<string, unknown> {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
}

interface PreferencesFormData extends Record<string, unknown> {
  notifications: boolean;
  language: string;
  timezone: string;
}

// Form Validation
const validateUserForm = (data: UserFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (data.bio.length > 500) {
    errors.bio = 'Bio must be less than 500 characters';
  }

  if (data.avatarUrl && !isValidUrl(data.avatarUrl)) {
    errors.avatarUrl = 'Please enter a valid URL';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Form State Hook
function useFormState<T extends Record<string, unknown>>(
  initialValues: T,
  validator: (data: T) => ValidationResult
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues(prev => ({ ...prev, [field]: value }));

      if (errors[field as string]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateForm = useCallback(() => {
    const validation = validator(values);
    setErrors(validation.errors);
    return validation;
  }, [values, validator]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = useMemo(() => {
    return validator(values).isValid;
  }, [values, validator]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setFieldTouched,
    validateForm,
    resetForm,
    setIsSubmitting,
  };
}

// Main Profile Component
export const EnhancedUserProfile: React.FC<EnhancedUserProfileProps> = ({
  user,
  onUpdateUser,
  onUpdatePreferences,
  readonly = false,
  showPreferences = true,
  className = '',
  'data-testid': testId,
  children,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');
  const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: false });

  const profileForm = useFormState<UserFormData>(
    {
      name: user.name,
      email: user.email,
      bio: user.bio || '',
      avatarUrl: user.avatarUrl || '',
    },
    validateUserForm
  );

  const preferencesForm = useFormState<PreferencesFormData>(
    {
      notifications: user.preferences.notifications,
      language: user.preferences.language,
      timezone: user.preferences.timezone || '',
    },
    () => ({ isValid: true, errors: {} })
  );

  const handleProfileSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validation = profileForm.validateForm();
      if (!validation.isValid) {
        return;
      }

      setLoadingState({ isLoading: true });
      profileForm.setIsSubmitting(true);

      try {
        const updates: UpdateUserInput = {
          name: profileForm.values.name,
          email: profileForm.values.email,
          ...(profileForm.values.bio ? { bio: profileForm.values.bio } : {}),
          ...(profileForm.values.avatarUrl ? { avatarUrl: profileForm.values.avatarUrl } : {}),
        };

        await onUpdateUser(updates);
        setIsEditing(false);
        setLoadingState({ isLoading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
        setLoadingState({ isLoading: false, error: errorMessage });
      } finally {
        profileForm.setIsSubmitting(false);
      }
    },
    [profileForm, onUpdateUser]
  );

  const handlePreferencesUpdate = useCallback(async () => {
    setLoadingState({ isLoading: true });

    try {
      const updates: Partial<UserPreferences> = {
        notifications: preferencesForm.values.notifications,
        language: preferencesForm.values.language,
        ...(preferencesForm.values.timezone ? { timezone: preferencesForm.values.timezone } : {}),
      };

      await onUpdatePreferences(updates);
      setLoadingState({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preferences';
      setLoadingState({ isLoading: false, error: errorMessage });
    }
  }, [preferencesForm.values, onUpdatePreferences]);

  const handleCancel = useCallback(() => {
    profileForm.resetForm();
    setIsEditing(false);
    setLoadingState({ isLoading: false });
  }, [profileForm]);

  const displayAvatar = useMemo(() => {
    return profileForm.values.avatarUrl || user.avatarUrl || '/default-avatar.png';
  }, [profileForm.values.avatarUrl, user.avatarUrl]);

  const statusBadgeColor = useMemo((): string => {
    switch (user.status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, [user.status]);

  const renderFormField = useCallback(
    (
      fieldName: keyof UserFormData,
      label: string,
      type: string = 'text',
      placeholder?: string
    ): React.ReactElement => (
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
        <input
          type={type}
          value={String(profileForm.values[fieldName])}
          onChange={e =>
            profileForm.setValue(fieldName, e.target.value as UserFormData[typeof fieldName])
          }
          onBlur={() => profileForm.setFieldTouched(fieldName)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            profileForm.errors[fieldName] ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loadingState.isLoading}
        />
        {profileForm.errors[fieldName] && (
          <p className='mt-1 text-sm text-red-600'>{profileForm.errors[fieldName]}</p>
        )}
      </div>
    ),
    [profileForm, loadingState.isLoading]
  );

  const renderTextArea = useCallback(
    (fieldName: keyof UserFormData, label: string, placeholder?: string): React.ReactElement => (
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
        <textarea
          value={String(profileForm.values[fieldName])}
          onChange={e =>
            profileForm.setValue(fieldName, e.target.value as UserFormData[typeof fieldName])
          }
          onBlur={() => profileForm.setFieldTouched(fieldName)}
          placeholder={placeholder}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            profileForm.errors[fieldName] ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loadingState.isLoading}
        />
        {profileForm.errors[fieldName] && (
          <p className='mt-1 text-sm text-red-600'>{profileForm.errors[fieldName]}</p>
        )}
      </div>
    ),
    [profileForm, loadingState.isLoading]
  );

  return (
    <div
      className={`max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      data-testid={testId}
    >
      {/* Header */}
      <div className='px-6 py-4 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-900'>User Profile</h2>
          <div className='flex items-center space-x-2'>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadgeColor}`}>
              {user.status.toUpperCase()}
            </span>
            <div className='flex items-center space-x-2'>
              <span
                className='px-3 py-1 text-xs font-semibold rounded-full text-white'
                style={{ backgroundColor: ROLE_CONFIG[user.role].color }}
              >
                {ROLE_CONFIG[user.role].label}
              </span>
              {hasPermission(user.role, USER_PERMISSIONS.ADMIN) && (
                <span className='text-xs text-amber-600 font-medium'>👑 Admin</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {loadingState.error && (
        <div className='mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-sm text-red-600'>{loadingState.error}</p>
        </div>
      )}

      {/* Navigation Tabs */}
      {showPreferences && (
        <div className='border-b border-gray-200'>
          <nav className='flex space-x-8 px-6' aria-label='Profile sections'>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'preferences'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Preferences
            </button>
          </nav>
        </div>
      )}

      <div className='p-6'>
        {activeTab === 'profile' ? (
          // Profile Tab
          <div>
            {/* Avatar Section */}
            <div className='flex items-center mb-6'>
              <div className='relative'>
                <img
                  src={displayAvatar}
                  alt={`${user.name}'s avatar`}
                  className='w-20 h-20 rounded-full object-cover'
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'https://th.bing.com/th/id/OIP.NQi3uKSoL560CydnY65nNgHaHa?w=198&h=198&c=7&r=0&o=7&cb=12&dpr=2&pid=1.7&rm=3';
                  }}
                />
                {loadingState.isLoading && (
                  <div className='absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
                  </div>
                )}
              </div>
              <div className='ml-4 flex-1'>
                <h3 className='text-lg font-medium text-gray-900'>{user.name}</h3>
                <p className='text-gray-600'>{user.email}</p>
                <p className='text-sm text-gray-500'>
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!readonly && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={loadingState.isLoading}
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              )}
            </div>

            {/* Profile Form */}
            {isEditing ? (
              <form onSubmit={handleProfileSubmit} className='space-y-4'>
                {renderFormField('name', 'Full Name', 'text', 'Enter your full name')}
                {renderFormField('email', 'Email Address', 'email', 'Enter your email address')}
                {renderFormField('avatarUrl', 'Avatar URL', 'url', 'Enter avatar image URL')}
                {renderTextArea('bio', 'Bio', 'Tell us about yourself...')}

                <div className='flex space-x-3 pt-4'>
                  <button
                    type='submit'
                    disabled={!profileForm.isValid || loadingState.isLoading}
                    className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
                  >
                    {loadingState.isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type='button'
                    onClick={handleCancel}
                    className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Profile Display
              <div className='space-y-4'>
                <div>
                  <h4 className='text-sm font-medium text-gray-700'>Bio</h4>
                  <p className='mt-1 text-gray-900'>{user.bio || 'No bio provided'}</p>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-gray-700'>Last Updated</h4>
                  <p className='mt-1 text-gray-900'>{new Date(user.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Preferences Tab
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>User Preferences</h3>

              <div className='space-y-4'>
                {/* Notifications Toggle */}
                <div className='flex items-center justify-between'>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Notifications</label>
                    <p className='text-sm text-gray-500'>Receive email notifications</p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={preferencesForm.values.notifications}
                      onChange={e => preferencesForm.setValue('notifications', e.target.checked)}
                      className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Language Selection */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Language</label>
                  <input
                    type='text'
                    value={preferencesForm.values.language}
                    onChange={e => preferencesForm.setValue('language', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='e.g., en, es, fr'
                  />
                </div>

                {/* Timezone */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Timezone</label>
                  <input
                    type='text'
                    value={preferencesForm.values.timezone}
                    onChange={e => preferencesForm.setValue('timezone', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='e.g., America/New_York'
                  />
                </div>
              </div>

              <button
                onClick={handlePreferencesUpdate}
                disabled={loadingState.isLoading}
                className='mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
              >
                {loadingState.isLoading ? 'Updating...' : 'Update Preferences'}
              </button>
            </div>
          </div>
        )}
      </div>

      {children}
    </div>
  );
};

export default EnhancedUserProfile;
