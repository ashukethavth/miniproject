import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { FileCard } from '../components/FileCard'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Dummy data for file grid
  const files = [
    { id: '1', name: 'Document.pdf', type: 'pdf', size: '2.5 MB' },
    { id: '2', name: 'Image.jpg', type: 'image', size: '1.2 MB' },
    { id: '3', name: 'Video.mp4', type: 'video', size: '50 MB' },
    { id: '4', name: 'Folder', type: 'folder', size: '' },
  ]

  const handleUpload = () => {
    navigate('/upload')
  }

  const handleCreateFolder = () => {
    navigate('/files')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.full_name || user?.email || 'User'}!
            </h1>
            <p className="text-gray-600">Here's what's happening with your files today.</p>
          </div>

          <div className="mb-6 flex gap-4">
            <button 
              onClick={handleUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Upload File
            </button>
            <button 
              onClick={handleCreateFolder}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition"
            >
              Create Folder
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export { Dashboard }
