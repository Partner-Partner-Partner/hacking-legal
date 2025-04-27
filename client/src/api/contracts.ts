import { UploadResponse, uploadContracts } from "@/utils/api";
import { ApiResponse, UploadContractsResponse, ContractResponse } from "@/types/api";
import { Contract } from "@/types/contract";

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Upload contract documents to the server
 * @param files - Array of contract files to upload
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with upload response including contractId and playbookId
 * 
 * For backend: Create a POST endpoint at /api/contracts/upload that accepts 
 * multipart form data with 'contract_files' field containing one or more files.
 * Return a response with contractId and playbookId for navigation.
 */
export async function uploadContractDocuments(
  files: File[], 
  onProgress?: (progress: number) => void
): Promise<ApiResponse<UploadContractsResponse>> {
  try {
    // Use the existing utility function
    const response = await uploadContracts(files, onProgress);
    
    // Fetch additional data about the uploaded contracts
    // This simulates the additional processing needed after basic upload
    const contractData = await fetch(`${API_BASE_URL}/contracts/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileIds: response.files.map(file => file.saved_as)
      }),
    });
    
    if (!contractData.ok) {
      throw new Error(`Failed to process contracts: ${contractData.statusText}`);
    }
    
    const contractResponse = await contractData.json();
    
    return {
      success: true,
      data: {
        message: "Contracts uploaded and processed successfully",
        contractId: contractResponse.contractId,
        playbookId: contractResponse.playbookId,
        files: response.files
      }
    };
  } catch (error) {
    console.error("Error in uploadContractDocuments:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during contract upload"
    };
  }
}

/**
 * Get a contract by its ID
 * @param contractId - ID of the contract to retrieve
 * @returns Promise with the contract data
 * 
 * For backend: Create a GET endpoint at /api/contracts/:id that returns
 * the contract data structure similar to sampleContract.ts
 */
export async function getContractById(contractId: string): Promise<ApiResponse<ContractResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch contract: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error in getContractById:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred fetching contract"
    };
  }
}
