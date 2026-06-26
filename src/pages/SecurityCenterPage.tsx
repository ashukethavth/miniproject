import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FingerPrintIcon,
  KeyIcon,
  ArrowPathIcon,
  LockClosedIcon,
  ShieldExclamationIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/src/components/ui/Button'
import { Card } from '@/src/components/ui/Card'
import { Container } from '@/src/components/ui/Container'
import { Badge } from '@/src/components/ui/Badge'
import { cn } from '@/src/utils/cn'

const sessions = [
  { id: '1', device: 'MacBook Pro 16"', browser: 'Chrome', location: 'San Francisco, US', ip: '192.168.1.1', status: 'Current Session', lastActive: 'Active now', icon: ComputerDesktopIcon },
  { id: '2', device: 'iPhone 15 Pro', browser: 'Safari', location: 'New York, US', ip: '172.16.0.45', status: 'Active', lastActive: '2 hours ago', icon: DevicePhoneMobileIcon },
  { id: '3', device: 'Windows PC', browser: 'Firefox', location: 'London, UK', ip: '10.0.0.12', status: 'Active', lastActive: '1 day ago', icon: ComputerDesktopIcon },
]

const loginHistory = [
  { id: '1', status: 'success', time: '2024-03-12 14:30', location: 'San Francisco, US', ip: '192.168.1.1', method: 'MFA (Authenticator)' },
  { id: '2', status: 'failed', time: '2024-03-12 10:15', location: 'Moscow, RU', ip: '95.161.224.1', method: 'Password', alert: true },
  { id: '3', status: 'success', time: '2024-03-11 18:45', location: 'San Francisco, US', ip: '192.168.1.1', method: 'MFA (SMS)' },
]

export const SecurityCenterPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const mfaEnabled = user?.mfa_enabled || false

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <Container>
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Security Center</h1>
          <p className="text-slate-500 mt-1">Monitor your account security and manage active sessions.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Security Status */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium">Multi-Factor Authentication</span>
                  </div>
                  {mfaEnabled ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-600" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LockClosedIcon className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium">Password Strength</span>
                  </div>
                  <Badge variant="success">Strong</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GlobeAltIcon className="w-5 h-5 text-yellow-600 mr-3" />
                    <span className="text-sm font-medium">Active Sessions</span>
                  </div>
                  <Badge variant="warning">{sessions.length}</Badge>
                </div>
              </div>

              {!mfaEnabled && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">Enable MFA</p>
                      <p className="text-yellow-700 mt-1">
                        Add an extra layer of security to your account.
                      </p>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => navigate('/setup-mfa')}
                      >
                        Set Up MFA
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => navigate('/profile')}
                >
                  <span className="flex items-center">
                    <FingerPrintIcon className="w-4 h-4 mr-2" />
                    Update Profile
                  </span>
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => {/* TODO: Change password */}}
                >
                  <span className="flex items-center">
                    <KeyIcon className="w-4 h-4 mr-2" />
                    Change Password
                  </span>
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => {/* TODO: Download data */}}
                >
                  <span className="flex items-center">
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    Download Data
                  </span>
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Active Sessions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Active Sessions</h3>
                <Button variant="outline" size="sm">
                  Revoke All Other Sessions
                </Button>
              </div>

              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center">
                      <session.icon className="w-8 h-8 text-slate-400 mr-4" />
                      <div>
                        <p className="font-medium text-slate-900">{session.device}</p>
                        <p className="text-sm text-slate-600">
                          {session.browser} • {session.location} • {session.ip}
                        </p>
                        <p className="text-xs text-slate-500">{session.lastActive}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant={session.status === 'Current Session' ? 'primary' : 'secondary'}>
                        {session.status}
                      </Badge>
                      {session.status !== 'Current Session' && (
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Login History */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Login Activity</h3>

              <div className="space-y-4">
                {loginHistory.map((login) => (
                  <div key={login.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center">
                      {login.status === 'success' ? (
                        <CheckCircleIcon className="w-6 h-6 text-green-600 mr-4" />
                      ) : (
                        <XCircleIcon className="w-6 h-6 text-red-600 mr-4" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">
                          {login.status === 'success' ? 'Successful login' : 'Failed login attempt'}
                        </p>
                        <p className="text-sm text-slate-600">
                          {login.location} • {login.ip} • {login.method}
                        </p>
                        <p className="text-xs text-slate-500">{login.time}</p>
                      </div>
                    </div>

                    {login.alert && (
                      <Badge variant="danger">Suspicious</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}
