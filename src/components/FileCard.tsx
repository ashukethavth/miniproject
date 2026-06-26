import React from 'react';
import { DocumentIcon, PhotoIcon, VideoCameraIcon, FolderIcon } from '@heroicons/react/24/outline';

interface FileCardProps {
  file: {
    id: string;
    name: string;
    type: string;
    size: string;
  };
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const getIcon = () => {
    switch (file.type) {
      case 'pdf':
      case 'doc':
        return <DocumentIcon className="w-8 h-8 text-red-500" />;
      case 'image':
        return <PhotoIcon className="w-8 h-8 text-green-500" />;
      case 'video':
        return <VideoCameraIcon className="w-8 h-8 text-blue-500" />;
      case 'folder':
        return <FolderIcon className="w-8 h-8 text-yellow-500" />;
      default:
        return <DocumentIcon className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer">
      <div className="flex items-center justify-center mb-2">
        {getIcon()}
      </div>
      <h3 className="text-sm font-medium text-gray-900 truncate">{file.name}</h3>
      {file.size && <p className="text-xs text-gray-500">{file.size}</p>}
    </div>
  );
};

export { FileCard };