import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  onUpload: (file: File) => Promise<void>;
}

export function DocumentUpload({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(file);
      
      // Complete the progress bar
      clearInterval(progressInterval);
      setUploadProgress(100);
      toast.success('Document uploaded successfully');
      
      // Reset after a brief delay to show the completed progress
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload document');
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition">
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
          hidden
        />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Upload a document
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-500 transition"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}