'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadField from '@/components/UploadField';
import { useToast } from '@/providers/ToastProvider';
import { contractApi } from '@/api/client';

export default function Home() {
  const { showToast } = useToast();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | undefined>();
  
  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadStatus('idle');
    setError(undefined);
    
    try {
      // Use the simplified API to upload files and get a playbook ID
      const playbookId = await contractApi.uploadPlaybook(files, (progress) => {
        console.log(`Upload progress: ${progress}%`);
        // You can use this progress info to update a progress bar
      });
      
      setUploadStatus('success');
      showToast('Upload successful!', 'success');
      
      // Redirect to the playbook page after successful upload
      setTimeout(() => {
        router.push(`/playbook/${playbookId}`);
      }, 1000);
      
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
