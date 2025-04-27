import { ApiResponse, ComparisonRequest, ComparisonResponse } from "@/types/api";
import { Contract } from "@/types/contract";
import { ContractSection } from "@/types/playbook";

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Compare a contract against a playbook
 * @param contractId - ID of the uploaded contract
 * @param playbookId - ID of the playbook to compare against
 * @returns Promise with comparison results including analysis
 * 
 * For backend: Create a POST endpoint at /api/comparisons that accepts
 * contractId and playbookId, and returns comparison analysis
 */
export async function compareContractToPlaybook(
  contractId: string,
  playbookId: string
): Promise<ApiResponse<ComparisonResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/comparisons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contractId,
        playbookId
      } as ComparisonRequest),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to compare contract: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error in compareContractToPlaybook:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during comparison"
    };
  }
}

/**
 * Upload and compare a new contract file against an existing playbook
 * @param file - Contract file to upload
 * @param playbookId - ID of the playbook to compare against
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with comparison results
 * 
 * For backend: Create a POST endpoint at /api/comparisons/upload that accepts
 * multipart form data with 'contract_file' field and a playbookId parameter,
 * and returns comparison analysis
 */
export async function uploadAndCompareContract(
  file: File,
  playbookId: string,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<ComparisonResponse>> {
  try {
    const formData = new FormData();
    formData.append('contract_file', file);
    formData.append('playbookId', playbookId);
    
    let response;
    
    // For browsers that support upload progress
    if (onProgress && window.XMLHttpRequest) {
      response = await new Promise<Response>((resolve, reject) => {
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
              // Create a Response object to match the fetch API
              const responseInit = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: new Headers()
              };
              const responseBody = JSON.parse(xhr.responseText);
              resolve(new Response(JSON.stringify(responseBody), responseInit));
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };
        
        xhr.open('POST', `${API_BASE_URL}/comparisons/upload`, true);
        xhr.send(formData);
      });
    } 
    // Fallback for browsers that don't support upload progress
    else {
      response = await fetch(`${API_BASE_URL}/comparisons/upload`, {
        method: 'POST',
        body: formData,
      });
    }
    
    if (!response.ok) {
      throw new Error(`Failed to upload and compare contract: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error in uploadAndCompareContract:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during upload and comparison"
    };
  }
}

/**
 * Get a specific comparison by its ID
 * @param comparisonId - ID of the comparison to retrieve
 * @returns Promise with the comparison data
 * 
 * For backend: Create a GET endpoint at /api/comparisons/:id that returns
 * the comparison data with contract, playbook, and analysis information
 */
export async function getComparisonById(comparisonId: string): Promise<ApiResponse<ComparisonResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/comparisons/${comparisonId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch comparison: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error in getComparisonById:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred fetching comparison"
    };
  }
}
