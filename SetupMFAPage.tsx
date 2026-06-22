import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ShieldCheckIcon,
  QrCodeIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/src/components/ui/Button'
import { Card } from '@/src/components/ui/Card'
import { Input } from '@/src/components/ui/Input'
import { Container } from '@/src/components/ui/Container'
import { OTPInput } from '@/src/components/ui/OTPInput'

export const SetupMFAPage = () => {
  const navigate = useNavigate()
  const { user, mfa } = useAuth()
  const [step, setStep] = useState(1)
  const [mfaType, setMfaType] = useState<'totp' | 'sms'>('totp')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string>('')
  const [phone, setPhone] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.mfa_enabled) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleEnrollTOTP = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await mfa.enrollTOTP()
      if (result) {
        setQrCode(result.qrCode)
        setSecret(result.secret)
        setStep(2)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to enroll TOTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyTOTP = async (code: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await mfa.verifyTOTP(code)
      if (error) {
        setError(error.message)
      } else {
        // Generate backup codes
        const codes = await mfa.generateBackupCodes()
        setBackupCodes(codes)
        setStep(3)
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnrollSMS = async () => {
    if (!phone) {
      setError('Please enter a phone number')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await mfa.enrollSMS(phone)
      if (error) {
        setError(error.message)
      } else {
        setStep(2)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to enroll SMS MFA')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifySMS = async (code: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await mfa.verifySMS(code)
      if (error) {
        setError(error.message)
      } else {
        // Generate backup codes
        const codes = await mfa.generateBackupCodes()
        setBackupCodes(codes)
        setStep(3)
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    navigate('/dashboard')
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <ShieldCheckIcon className="mx-auto h-16 w-16 text-primary-600" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Set Up Two-Factor Authentication
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Add an extra layer of security to your account
        </p>
      </div>

      <div className="space-y-4">
        <div
          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            mfaType === 'totp' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
          }`}
          onClick={() => setMfaType('totp')}
        >
          <div className="flex items-center">
            <QrCodeIcon className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Authenticator App</h3>
              <p className="text-sm text-gray-600">
                Use Google Authenticator, Authy, or similar apps
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            mfaType === 'sms' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
          }`}
          onClick={() => setMfaType('sms')}
        >
          <div className="flex items-center">
            <DevicePhoneMobileIcon className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">SMS Authentication</h3>
              <p className="text-sm text-gray-600">
                Receive verification codes via SMS
              </p>
            </div>
          </div>
        </div>
      </div>

      {mfaType === 'sms' && (
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
            className="mt-1"
          />
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button
        onClick={mfaType === 'totp' ? handleEnrollTOTP : handleEnrollSMS}
        disabled={mfaType === 'sms' && !phone}
        className="w-full"
        isLoading={isLoading}
      >
        Continue
        <ArrowRightIcon className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <QrCodeIcon className="mx-auto h-16 w-16 text-primary-600" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          {mfaType === 'totp' ? 'Scan QR Code' : 'Verify Phone Number'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {mfaType === 'totp'
            ? 'Scan this QR code with your authenticator app'
            : 'Enter the verification code sent to your phone'
          }
        </p>
      </div>

      {mfaType === 'totp' && qrCode && (
        <div className="text-center">
          <img src={qrCode} alt="QR Code" className="mx-auto" />
          <p className="mt-2 text-xs text-gray-500">
            Can't scan? Enter this code manually: {secret}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification Code
        </label>
        <OTPInput
          length={6}
          onComplete={mfaType === 'totp' ? handleVerifyTOTP : handleVerifySMS}
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button
        variant="outline"
        onClick={() => setStep(1)}
        className="w-full"
      >
        <ArrowLeftIcon className="mr-2 h-5 w-5" />
        Back
      </Button>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          MFA Setup Complete!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Save these backup codes in a safe place
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <KeyIcon className="h-5 w-5 text-yellow-600 mr-2" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800">Backup Codes</p>
            <p className="text-yellow-700 mt-1">
              These codes can be used to access your account if you lose your phone or authenticator app.
              Each code can only be used once.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          {backupCodes.map((code, index) => (
            <div key={index} className="text-center p-2 bg-white rounded border">
              {code}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>⚠️ Store these codes securely. You won't be able to see them again.</p>
      </div>

      <Button onClick={handleComplete} className="w-full">
        Complete Setup
        <ArrowRightIcon className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  )

  return (
    <Container className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="max-w-md mx-auto">
        <Card className="p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </Card>
      </div>
    </Container>
  )
}
