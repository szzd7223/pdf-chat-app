import React from 'react';
import { FileText } from 'lucide-react';
import type { Document } from '../types';

interface Props {
  documents: Document[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function DocumentList({ documents, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => onSelect(doc.id)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
            selectedId === doc.id
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <FileText className="h-5 w-5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{doc.name}</p>
            <p className="text-xs text-gray-300 dark:text-gray-500">
              {new Date(doc.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
