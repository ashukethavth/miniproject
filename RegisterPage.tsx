import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  ShieldCheckIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Card } from '@/src/components/ui/Card'
import { PasswordStrength } from '@/src/components/ui/PasswordStrength'
import { Container } from '@/src/components/ui/Container'
import { cn } from '@/src/utils/cn'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email)) {
      setError('Please fill in all required fields.')
      return
    }
    if (step === 2 && (!formData.password || formData.password !== formData.confirmPassword)) {
      setError('Passwords do not match.')
      return
    }
    if (step === 2 && formData.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    setError(null)
    setStep(step + 1)
  }

  const handleBack = () => setStep(step - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.name,
        organization: formData.organization
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (success) {
    return (
      <Container className="min-h-screen pt-32 pb-20 bg-slate-50">
        <div className="max-w-md mx-auto">
          <Card className="p-8 text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Account Created Successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a verification email to {formData.email}.
              Please check your email and click the verification link to activate your account.
            </p>
            <div className="mt-6 space-y-4">
              <Button onClick={() => navigate('/login')} className="w-full">
                Go to Login
              </Button>
              <p className="text-sm text-gray-500">
                Didn't receive the email?{' '}
                <button
                  onClick={() => {/* Resend email logic */}}
                  className="text-primary-600 hover:text-primary-500"
                >
                  Resend verification email
                </button>
              </p>
            </div>
          </Card>
        </div>
      </Container>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
      </div>

      <Container>
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <div className="text-center mb-6">
                <ShieldCheckIcon className="mx-auto h-12 w-12 text-primary-600" />
                <h1 className="mt-4 text-2xl font-bold text-gray-900">
                  Create Your Account
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Join CloudLock for secure file management
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                          step >= stepNumber
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        )}
                      >
                        {stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div
                          className={cn(
                            'w-12 h-0.5 mx-2',
                            step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <div className="mt-1 relative">
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          className="pl-10"
                          placeholder="Enter your full name"
                        />
                        <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <div className="mt-1 relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          className="pl-10"
                          placeholder="Enter your email"
                        />
                        <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                        Organization (Optional)
                      </label>
                      <div className="mt-1 relative">
                        <Input
                          id="organization"
                          name="organization"
                          type="text"
                          autoComplete="organization"
                          value={formData.organization}
                          onChange={(e) => updateFormData('organization', e.target.value)}
                          className="pl-10"
                          placeholder="Enter your organization"
                        />
                        <BuildingOfficeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full flex items-center justify-center"
                    >
                      Next
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password *
                      </label>
                      <div className="mt-1">
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={(e) => updateFormData('password', e.target.value)}
                          placeholder="Create a strong password"
                        />
                        <PasswordStrength password={formData.password} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password *
                      </label>
                      <div className="mt-1">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                          placeholder="Confirm your password"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="flex items-center"
                      >
                        <ArrowLeftIcon className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center"
                      >
                        Next
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </motion.form>
                )}

                {step === 3 && (
                  <motion.form
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900">Terms & Conditions</h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Please review and accept our terms of service.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md max-h-32 overflow-y-auto text-sm text-gray-700">
                      <p>
                        By creating an account, you agree to our Terms of Service and Privacy Policy.
                        We are committed to protecting your data and ensuring secure file management.
                      </p>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="acceptTerms"
                        name="acceptTerms"
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={(e) => updateFormData('acceptTerms', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    {error && (
                      <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                        {error}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="flex items-center"
                      >
                        <ArrowLeftIcon className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={!formData.acceptTerms || isLoading}
                        className="flex items-center"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            Create Account
                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
