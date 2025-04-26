'use client';

import { useState } from 'react';
import UploadField from '@/components/UploadField';
import { useToast } from '@/providers/ToastProvider';

export default function Home() {
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | undefined>();
  
  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadStatus('idle');
    setError(undefined);
    
    try {
      // Create form data
      const formData = new FormData();
      files.forEach(file => {
        formData.append('contract_files', file);
      });
      
      // Simple fetch to API
      const response = await fetch('http://localhost:8000/contracts/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }
      
      setUploadStatus('success');
      
      // Reset to idle state after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
      }, 3000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload files';
      showToast(errorMessage, 'error');
      
      // Reset to idle state after 2 seconds to allow retry
      setTimeout(() => {
        setUploadStatus('idle');
      }, 2000);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="w-full max-w-3xl flex flex-col gap-8 -mt-20">
        <h2 className="text-3xl font-medium text-[#003772] text-center mb-8">Upload Contracts</h2>
        
        <UploadField 
          onFilesSelected={handleFilesSelected}
          isUploading={isUploading}
          uploadStatus={uploadStatus}
        />
      </main>
    </div>
  );
}
