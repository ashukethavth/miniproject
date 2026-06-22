import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  ShieldCheckIcon,
  LockClosedIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Card } from '@/src/components/ui/Card'
import { SecurityNotice } from '@/src/components/ui/SecurityNotice'
import { OTPInput } from '@/src/components/ui/OTPInput'
import { Container } from '@/src/components/ui/Container'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { signIn, user, mfa } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isMfaRequired, setIsMfaRequired] = useState(false)
  const [mfaType, setMfaType] = useState<'totp' | 'sms' | 'backup'>('totp')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        if (error.message.includes('MFA')) {
          setIsMfaRequired(true)
          // Determine MFA type from user profile
          // For now, assume TOTP
          setMfaType('totp')
        } else {
          setError(error.message || 'Failed to sign in. Please check your credentials.')
        }
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMfaSubmit = async (code: string) => {
    setIsLoading(true)
    setError(null)

    try {
      let error = null

      if (mfaType === 'totp') {
        const result = await mfa.verifyTOTP(code)
        error = result.error
      } else if (mfaType === 'sms') {
        const result = await mfa.verifySMS(code)
        error = result.error
      } else if (mfaType === 'backup') {
        const isValid = await mfa.verifyBackupCode(code)
        if (!isValid) {
          error = { message: 'Invalid backup code' } as any
        }
      }

      if (error) {
        setError(error.message || 'Invalid MFA code.')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid MFA code.')
    } finally {
      setIsLoading(false)
    }
  }

  const switchMfaType = (type: 'totp' | 'sms' | 'backup') => {
    setMfaType(type)
    setMfaCode('')
    setError(null)
  }

  if (isMfaRequired) {
    return (
      <Container className="min-h-screen pt-32 pb-20 bg-slate-50">
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <div className="text-center mb-6">
              <ShieldCheckIcon className="mx-auto h-12 w-12 text-primary-600" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Two-Factor Authentication
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter your authentication code to continue
              </p>
            </div>

            <div className="space-y-4">
              {/* MFA Type Selector */}
              <div className="flex justify-center space-x-2">
                <Button
                  variant={mfaType === 'totp' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => switchMfaType('totp')}
                  className="flex items-center"
                >
                  <QrCodeIcon className="h-4 w-4 mr-2" />
                  TOTP
                </Button>
                <Button
                  variant={mfaType === 'sms' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => switchMfaType('sms')}
                  className="flex items-center"
                >
                  <DevicePhoneMobileIcon className="h-4 w-4 mr-2" />
                  SMS
                </Button>
                <Button
                  variant={mfaType === 'backup' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => switchMfaType('backup')}
                  className="flex items-center"
                >
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  Backup
                </Button>
              </div>

              {/* MFA Instructions */}
              <div className="text-center text-sm text-gray-600">
                {mfaType === 'totp' && 'Enter the 6-digit code from your authenticator app'}
                {mfaType === 'sms' && 'Enter the 6-digit code sent to your phone'}
                {mfaType === 'backup' && 'Enter one of your backup codes'}
              </div>

              {/* OTP Input */}
              <OTPInput
                length={6}
                onComplete={handleMfaSubmit}
              />

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              {/* Back to Login */}
              <Button
                variant="outline"
                onClick={() => setIsMfaRequired(false)}
                className="w-full"
              >
                Back to Login
              </Button>
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
                  Welcome Back
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Sign in to your secure account
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                    <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      placeholder="Enter your password"
                    />
                    <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-4">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </Link>

                <div className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

          <SecurityNotice className="mt-6" />
        </div>
      </Container>
    </div>
  )
}
