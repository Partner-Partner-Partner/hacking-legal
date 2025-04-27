import { ApiResponse, PlaybookResponse } from "@/types/api";
import { ContractSection } from "@/types/playbook";

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Get a playbook by its ID
 * @param playbookId - ID of the playbook to retrieve
 * @returns Promise with the playbook data
 * 
 * For backend: Create a GET endpoint at /api/playbooks/:id that returns 
 * the playbook data structure similar to samplePlaybook.ts
 */
export async function getPlaybookById(playbookId: string): Promise<ApiResponse<PlaybookResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/playbooks/${playbookId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch playbook: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error in getPlaybookById:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred fetching playbook"
    };
  }
}

/**
 * List all available playbooks
 * @returns Promise with array of playbook summary data
 * 
 * For backend: Create a GET endpoint at /api/playbooks that returns
 * a list of available playbooks with basic information
 */
export async function listPlaybooks(): Promise<ApiResponse<{ playbooks: PlaybookResponse[] }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/playbooks`);
    
    if (!response.ok) {
      throw new Error(`Failed to list playbooks: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error in listPlaybooks:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred listing playbooks"
    };
  }
}
