"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button.jsx'
import HomeLink from '@/components/HomeLink'
import { useAuth } from '@/contexts/AuthContext'
import AuthService from '@/services/auth'
import GoogleLoginButton from '@/components/GoogleLoginButton'
import TwitterLoginButton from '@/components/TwitterLoginButton'

export default function RegisterPage() {
  const { register, isAuthenticated, user, getUserProfile } = useAuth()
  const router = useRouter()

  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        console.log('User is already authenticated, redirecting...');
        // Get user data if not already available
        let userData = user;

        // If we don't have user data, try to get it from the auth service
        if (!userData) {
          try {
            userData = await getUserProfile();
          } catch (error) {
            console.error('Error getting user profile:', error);
            userData = { role: 'tenant' }; // Default role if we can't get the profile
          }
        }

        // Redirect based on user role
        if (userData?.role === 'admin') {
          window.location.href = '/dashboard/admin';
        } else if (userData?.role === 'agent' || userData?.role === 'landlord') {
          window.location.href = '/dashboard/landlord';
        } else {
          window.location.href = '/dashboard/user';
        }
      }
    };

    checkAuth();
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    userType: 'tenant', // tenant or landlord
    agreeToTerms: false
  })

  // UI state
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState('')
  const [formErrors, setFormErrors] = useState({})

  // Animation state
  const [direction, setDirection] = useState('forward')
  const [animating, setAnimating] = useState(false)

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }

    // Password strength check
    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  // Check password strength
  const checkPasswordStrength = (password) => {
    let strength = 0
    let feedback = ''

    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    if (strength === 0) feedback = 'Very weak'
    else if (strength === 1) feedback = 'Weak'
    else if (strength === 2) feedback = 'Fair'
    else if (strength === 3) feedback = 'Good'
    else feedback = 'Strong'

    setPasswordStrength(strength)
    setPasswordFeedback(feedback)
  }

  // Validate current step
  const validateStep = () => {
    const errors = {}
    console.log('Validating step:', currentStep);

    if (currentStep === 1) {
      if (!formData.firstName.trim()) errors.firstName = 'First name is required'
      if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
      if (!formData.email.trim()) errors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid'
    }

    if (currentStep === 2) {
      if (!formData.password) errors.password = 'Password is required'
      else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters'

      if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password'
      else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match'
    }

    if (currentStep === 3) {
      // No validation needed for step 3 as userType is pre-selected and phone is optional
      // Just ensure userType is either tenant or landlord
      if (!['tenant', 'landlord'].includes(formData.userType)) {
        errors.userType = 'Please select either Tenant or Landlord'
      }
    }

    if (currentStep === 4) {
      if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    console.log('Validation errors:', errors);

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle next step
  const handleNextStep = () => {
    console.log('Current step:', currentStep);
    console.log('Form data:', formData);

    // Clear any previous form errors
    setFormErrors({});

    if (validateStep()) {
      setDirection('forward')
      setAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setAnimating(false)
      }, 300)
    } else {
      console.log('Validation errors:', formErrors);
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    console.log('Going back from step:', currentStep);

    // Clear any form errors when going back
    setFormErrors({});

    setDirection('backward')
    setAnimating(true)
    setTimeout(() => {
      setCurrentStep(currentStep - 1)
      setAnimating(false)
    }, 300)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submitted, current step:', currentStep);

    // Only process submission on the final step
    if (currentStep === 4 && validateStep()) {
      setIsLoading(true)
      try {
        // Generate a username from email (ensure it's at least 3 characters)
        let usernameBase = formData.email.split('@')[0];
        // If username is too short, add some random characters
        if (usernameBase.length < 3) {
          usernameBase = usernameBase + 'user';
        }
        const username = usernameBase + Math.floor(Math.random() * 1000);

        console.log('Generated username:', username);

        // Map form data to API schema
        const userData = {
          username: username,
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.userType === 'landlord' ? 'agent' : 'tenant', // Map userType to role
          phone_number: formData.phoneNumber || null
        }

        console.log('Submitting user data:', userData);

        // Register user
        await register(userData)

        // Redirect to login page
        router.push('/login?registered=true')
      } catch (error) {
        console.error('Registration error:', error)
        let errorMessage = 'Registration failed. Please try again.';

        if (error.message) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null) {
          // Try to extract a meaningful error message
          if (error.username) {
            errorMessage = `Username error: ${error.username}`;
          } else if (error.email) {
            errorMessage = `Email error: ${error.email}`;
          } else if (error.password) {
            errorMessage = `Password error: ${error.password}`;
          }
        }

        setFormErrors({
          ...formErrors,
          submit: errorMessage
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Get animation classes
  const getAnimationClasses = () => {
    if (!animating) return 'opacity-100 transform translate-x-0'

    return direction === 'forward'
      ? 'opacity-0 transform translate-x-full'
      : 'opacity-0 transform -translate-x-full'
  }

  // Progress percentage
  const progressPercentage = ((currentStep - 1) / 3) * 100

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Home Link */}
      <HomeLink />

      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-800">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Join our community and find your perfect rental home
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold inline-block text-gray-900">
                    Step {currentStep} of 4
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold inline-block text-gray-900">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-gray-900 to-gray-800 transition-all duration-500 ease-in-out"
                ></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            <div className={`transition-all duration-300 ease-in-out ${currentStep === 1 ? getAnimationClasses() : 'hidden'}`}>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 ${
                        formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 ${
                        formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full relative overflow-hidden group"
                  >
                    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                    Continue
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 2: Password */}
            <div className={`transition-all duration-300 ease-in-out ${currentStep === 2 ? getAnimationClasses() : 'hidden'}`}>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Password</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 ${
                        formErrors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
                  )}

                  {/* Password strength meter */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex space-x-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-6 rounded-sm ${
                                i < passwordStrength
                                  ? passwordStrength === 1
                                    ? 'bg-red-500'
                                    : passwordStrength === 2
                                    ? 'bg-yellow-500'
                                    : passwordStrength === 3
                                    ? 'bg-green-400'
                                    : 'bg-green-600'
                                  : 'bg-gray-200'
                              }`}
                            ></div>
                          ))}
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength === 1
                            ? 'text-red-500'
                            : passwordStrength === 2
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        }`}>
                          {passwordFeedback}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Use 8+ characters with a mix of letters, numbers & symbols
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 ${
                        formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex justify-between pt-4 space-x-4">
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    variant="outline"
                    className="w-1/2"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-1/2 relative overflow-hidden group"
                  >
                    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                    Continue
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 3: User Type */}
            <div className={`transition-all duration-300 ease-in-out ${currentStep === 3 ? getAnimationClasses() : 'hidden'}`}>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">I am a...</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      formData.userType === 'tenant'
                        ? 'border-gray-900 bg-gray-100'
                        : 'border-gray-300 hover:border-gray-700'
                    }`}
                    onClick={() => setFormData({ ...formData, userType: 'tenant' })}
                  >
                    <div className="flex justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${formData.userType === 'tenant' ? 'text-gray-900' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-center">Tenant</h3>
                    <p className="text-sm text-gray-500 text-center mt-1">I'm looking for a place to rent</p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      formData.userType === 'landlord'
                        ? 'border-gray-900 bg-gray-100'
                        : 'border-gray-300 hover:border-gray-700'
                    }`}
                    onClick={() => setFormData({ ...formData, userType: 'landlord' })}
                  >
                    <div className="flex justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${formData.userType === 'landlord' ? 'text-gray-900' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-center">Landlord</h3>
                    <p className="text-sm text-gray-500 text-center mt-1">I have properties to rent out</p>
                  </div>
                </div>

                <div className="pt-4">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 space-x-4">
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    variant="outline"
                    className="w-1/2"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      console.log('Continue button clicked on step 3');
                      handleNextStep();
                    }}
                    className="w-1/2 relative overflow-hidden group"
                  >
                    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                    Continue
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 4: Terms and Conditions */}
            <div className={`transition-all duration-300 ease-in-out ${currentStep === 4 ? getAnimationClasses() : 'hidden'}`}>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Almost Done!</h2>

              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Account Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Name:</div>
                    <div className="font-medium">{formData.firstName} {formData.lastName}</div>

                    <div className="text-gray-600">Email:</div>
                    <div className="font-medium">{formData.email}</div>

                    <div className="text-gray-600">Account Type:</div>
                    <div className="font-medium capitalize">{formData.userType}</div>

                    {formData.phoneNumber && (
                      <>
                        <div className="text-gray-600">Phone:</div>
                        <div className="font-medium">{formData.phoneNumber}</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className={`h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded ${
                          formErrors.agreeToTerms ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                        I agree to the{' '}
                        <a href="#" className="text-gray-900 hover:text-gray-700">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-gray-900 hover:text-gray-700">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                  {formErrors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.agreeToTerms}</p>
                  )}
                </div>

                {formErrors.submit && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{formErrors.submit}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4 space-x-4">
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    variant="outline"
                    className="w-1/2"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="w-1/2 relative overflow-hidden group"
                    disabled={isLoading}
                    onClick={(e) => {
                      console.log('Create Account button clicked');
                      // The form's onSubmit handler will be called
                    }}
                  >
                    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <GoogleLoginButton mode="signup" />
              <TwitterLoginButton mode="signup" />
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-gray-900 hover:text-gray-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image and animation */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>

        {/* Animated elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white opacity-10 rounded-full animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white opacity-10 rounded-full animate-float-delay"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white opacity-10 rounded-full animate-float-delay-long"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-20 h-20 border-4 border-white opacity-20 rounded-lg transform rotate-12"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 border-4 border-white opacity-20 rounded-full"></div>

        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="mb-8 text-white/80">
              Create an account to unlock all features of our platform. Save your favorite properties,
              get personalized recommendations, and connect with landlords or tenants.
            </p>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-white/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Personalized Experience</h3>
                  <p className="text-white/70">Get recommendations based on your preferences</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 bg-white/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Secure Communication</h3>
                  <p className="text-white/70">Connect safely with landlords or tenants</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 bg-white/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Save Favorites</h3>
                  <p className="text-white/70">Keep track of properties you're interested in</p>
                </div>
              </div>
            </div>

            <div className="mt-10 relative w-full h-48 rounded-xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105">
              <Image
                src="https://images.unsplash.com/photo-1560448204-61dc36dc98c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Modern apartment interior"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
