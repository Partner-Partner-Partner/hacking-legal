import { Contract } from "@/types/contract";
import { ContractSection } from "@/types/playbook";

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Simple API client for contract analysis operations
 */
export const contractApi = {
  /**
   * Upload contract files to create a playbook
   * @param files - Contract files to upload
   * @param onProgress - Optional progress callback
   * @returns Promise with the playbook ID
   */
  uploadPlaybook: async (files: File[], onProgress?: (progress: number) => void): Promise<string> => {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('contract_files', file);
    });
    
    // Handle upload with progress reporting
    if (onProgress && window.XMLHttpRequest) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });
        
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText);
              resolve(response.playbookId);
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };
        
        xhr.open('POST', `${API_BASE_URL}/playbooks/upload`, true);
        xhr.send(formData);
      });
    }
    
    // Fallback without progress reporting
    const response = await fetch(`${API_BASE_URL}/playbooks/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.playbookId;
  },
  
  /**
   * Get a playbook by ID
   * @param playbookId - ID of the playbook to retrieve
   * @returns Promise with the playbook sections
   */
  getPlaybook: async (playbookId: string): Promise<ContractSection[]> => {
    const response = await fetch(`${API_BASE_URL}/playbooks/${playbookId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch playbook: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.sections;
  },
  
  /**
   * Compare a contract file against a playbook with automatic classification
   * @param file - Contract file to compare
   * @param playbookId - ID of the playbook to compare against
   * @param onProgress - Optional progress callback
   * @returns Promise with comparison results including automatic classifications
   */
  compareContract: async (
    file: File, 
    playbookId: string,
    onProgress?: (progress: number) => void
  ): Promise<{
    contract: Contract;
    playbook: ContractSection[];
    classifications: ClauseClassification[];
  }> => {
    const formData = new FormData();
    formData.append('contract_file', file);
    formData.append('playbook_id', playbookId);
    
    // Handle upload with progress reporting
    if (onProgress && window.XMLHttpRequest) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });
        
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText);
              resolve({
                contract: response.contract,
                playbook: response.playbook,
                classifications: response.classifications
              });
            } else {
              reject(new Error(`Comparison failed with status ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };
        
        xhr.open('POST', `${API_BASE_URL}/compare`, true);
        xhr.send(formData);
      });
    }
    
    // Fallback without progress reporting
    const response = await fetch(`${API_BASE_URL}/compare`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Comparison failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      contract: data.contract,
      playbook: data.playbook,
      classifications: data.classifications
    };
  }
};

/**
 * Represents the classification of a contract clause
 */
export interface ClauseClassification {
  sectionId: string;
  sectionTitle: string;
  clauseId: string;
  clauseText: string;
  classification: 'favorable' | 'balanced' | 'unfavorable' | 'unacceptable';
  suggestedState: 'mostFavorable' | 'balanced' | 'acceptable';
  suggestedText: string;
  argumentsForChange: {
    external: string;
    internal: string;
  };
}
