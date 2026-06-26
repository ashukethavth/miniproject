import React from 'react';
import { 
  DocumentIcon, 
  PhotoIcon, 
  VideoCameraIcon, 
  MusicalNoteIcon, 
  ArchiveBoxIcon, 
  CodeBracketIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { FileType } from '@/src/types/files';
import { cn } from '@/src/utils/cn';

interface FileIconProps {
  type: FileType;
  className?: string;
}

export const FileIcon = ({ type, className }: FileIconProps) => {
  const iconMap: Record<FileType, any> = {
    image: PhotoIcon,
    video: VideoCameraIcon,
    audio: MusicalNoteIcon,
    pdf: DocumentTextIcon,
    document: DocumentIcon,
    archive: ArchiveBoxIcon,
    code: CodeBracketIcon,
    other: QuestionMarkCircleIcon,
  };

  const colorMap: Record<FileType, string> = {
    image: 'text-blue-500 bg-blue-50',
    video: 'text-purple-500 bg-purple-50',
    audio: 'text-pink-500 bg-pink-50',
    pdf: 'text-rose-500 bg-rose-50',
    document: 'text-indigo-500 bg-indigo-50',
    archive: 'text-amber-500 bg-amber-50',
    code: 'text-emerald-500 bg-emerald-50',
    other: 'text-slate-500 bg-slate-50',
  };

  const Icon = iconMap[type] || QuestionMarkCircleIcon;

  return (
    <div className={cn('p-2 rounded-lg', colorMap[type], className)}>
      <Icon className="h-full w-full" />
    </div>
  );
};
