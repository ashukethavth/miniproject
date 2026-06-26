import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  UserCircleIcon,
  CameraIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Card } from '@/src/components/ui/Card'
import { Container } from '@/src/components/ui/Container'
import { Badge } from '@/src/components/ui/Badge'
import { cn } from '@/src/utils/cn'

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    username: '',
    phone: '',
    avatar_url: ''
  })

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.full_name || '',
        email: user.email || '',
        username: user.username || '',
        phone: user.phone || '',
        avatar_url: user.avatar_url || ''
      })
    }
  }, [user])

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await updateProfile({
        full_name: profile.full_name,
        username: profile.username,
        phone: profile.phone,
        avatar_url: profile.avatar_url
      })

      if (error) {
        setError(error.message)
      } else {
        setIsEditing(false)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setProfile({
        full_name: user.full_name || '',
        email: user.email || '',
        username: user.username || '',
        phone: user.phone || '',
        avatar_url: user.avatar_url || ''
      })
    }
    setIsEditing(false)
    setError(null)
  }

  const updateField = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return (
      <Container className="min-h-screen pt-32 pb-20">
        <div className="text-center">Loading...</div>
      </Container>
    )
  }

  return (
    <Container className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 text-center">
              <div className="relative inline-block">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-24 h-24 text-gray-400 mx-auto" />
                )}
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700">
                    <CameraIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {profile.full_name || 'No name set'}
              </h2>
              <p className="text-gray-600">{profile.email}</p>

              <div className="mt-4 flex justify-center">
                <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                  {user.role}
                </Badge>
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  {user.mfa_enabled ? 'MFA Enabled' : 'MFA Disabled'}
                </div>
                <div className="flex items-center justify-center">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  {user.email}
                </div>
                {profile.phone && (
                  <div className="flex items-center justify-center">
                    <DevicePhoneMobileIcon className="w-4 h-4 mr-2" />
                    {profile.phone}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center"
                  >
                    <PencilSquareIcon className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="flex items-center"
                    >
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center"
                    >
                      <CheckIcon className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={profile.full_name}
                      onChange={(e) => updateField('full_name', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <Input
                      value={profile.username}
                      onChange={(e) => updateField('username', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter a username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar URL
                    </label>
                    <Input
                      type="url"
                      value={profile.avatar_url}
                      onChange={(e) => updateField('avatar_url', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Container>
  )
}