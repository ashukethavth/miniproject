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

type MenuItem = {
  name: string
  path: string
  icon: React.ElementType
}

const Sidebar: React.FC = () => {
  const location = useLocation()

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'My Files', path: '/files', icon: FolderIcon },
    { name: 'Shared Files', path: '/shared', icon: ShareIcon },
    { name: 'Trash', path: '/trash', icon: TrashIcon },
  ]

  const accountItems: MenuItem[] = [
    { name: 'Profile', path: '/profile', icon: UserIcon },
    { name: 'Security', path: '/security', icon: ShieldCheckIcon },
  ]

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    console.log('Logout clicked')
  }

  return (
    <div className="w-64 bg-white shadow-lg h-screen hidden md:flex flex-col">

      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-blue-600">CloudLock</h2>
      </div>

      <nav className="flex-1 mt-4">

        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 transition group ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-8 pt-4 border-t">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Account
          </p>

          <ul>
            {accountItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 transition group ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              )
            })}

            <li>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 w-full text-red-600 hover:bg-red-50"
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