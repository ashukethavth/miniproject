import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  FolderIcon,
  ShareIcon,
  TrashIcon,
  UserIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

const Sidebar: React.FC = () => {
  const location = useLocation()

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'My Files', path: '/files', icon: FolderIcon },
    { name: 'Shared Files', path: '/shared', icon: ShareIcon },
    { name: 'Trash', path: '/trash', icon: TrashIcon },
  ]

  const accountItems = [
    { name: 'Profile', path: '/profile', icon: UserIcon },
    { name: 'Security', path: '/security', icon: ShieldCheckIcon },
  ]

  // Logout handler (you can connect auth here)
  const handleLogout = () => {
    console.log('User logged out')
    // Add logout logic here (Firebase/Supabase)
  }

  // Function to check active route
  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  return (
    <div className="w-64 bg-white shadow-lg h-screen hidden md:flex flex-col">
      
      {/* Logo */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-blue-600">CloudLock</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        
        {/* Main Menu */}
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 transition group ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3 group-hover:text-blue-600" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Account Section */}
        <div className="mt-8 pt-4 border-t">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Account
          </p>

          <ul>
            {accountItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 transition group ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3 group-hover:text-blue-600" />
                  {item.name}
                </Link>
              </li>
            ))}

            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 w-full text-red-600 hover:bg-red-50 transition group"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </li>

          </ul>
        </div>

      </nav>
    </div>
  )
}

export default Sidebar