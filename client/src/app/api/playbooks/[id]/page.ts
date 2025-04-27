/**
 * API Client for fetching playbook data
 * 
 * This file provides functions to retrieve playbook data by ID
 */

import { ContractSection } from "@/types/playbook";

export interface PlaybookResponse {
  id: string;
  title: string;
  created_at: string;
  sections: ContractSection[];
}

/**
 * Fetches playbook data by ID
 * @param playbookId - ID of the playbook to fetch
 * @returns Playbook data including sections and clauses
 */
export async function getPlaybook(playbookId: string): Promise<PlaybookResponse> {
  try {
    const response = await fetch(`http://localhost:8000/playbooks/${playbookId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Failed to fetch playbook with ID ${playbookId}`);
    }
    
    const data = await response.json();
    return {
      id: data.id,
      title: data.title,
      created_at: data.created_at,
      sections: data.sections,
    };
    
  } catch (error) {
    console.error(`Error fetching playbook ${playbookId}:`, error);
    throw error;
  }
}