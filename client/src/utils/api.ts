const API_BASE_URL = 'http://localhost:8000';

export interface UploadResponse {
  message: string;
  files: {
    original_name: string;
    saved_as: string;
    size: number;
  }[];
}

export async function uploadContracts(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  
  // Append each file to the form data
  files.forEach((file) => {
    formData.append('contract_files', file);
  });
  
  try {
    // For browsers that support upload progress
    if (onProgress && window.XMLHttpRequest) {
      const xhr = new XMLHttpRequest();
      let loaded = 0;
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      });
      
      return new Promise((resolve, reject) => {
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };
        
        xhr.open('POST', `${API_BASE_URL}/contracts/upload`, true);
        xhr.send(formData);
      });
    } 
    // Fallback for browsers that don't support upload progress
    else {
      const response = await fetch(`${API_BASE_URL}/contracts/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    }
  } catch (error) {
    console.error('Error uploading contracts:', error);
    throw error;
  }
}
