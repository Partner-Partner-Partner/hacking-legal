import { Contract } from './contract';
import { ContractSection } from './playbook';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadContractsResponse {
  message: string;
  contractId: string;
  playbookId: string;
  files: {
    original_name: string;
    saved_as: string;
    size: number;
  }[];
}

export interface PlaybookResponse {
  id: string;
  name: string;
  description?: string;
  sections: ContractSection[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractResponse {
  id: string;
  playbookId: string;
  contract: Contract;
  createdAt: string;
  updatedAt: string;
}

export interface ComparisonRequest {
  contractId: string;
  playbookId: string;
}

export interface ComparisonResponse {
  id: string;
  contract: Contract;
  playbook: ContractSection[];
  analysis: {
    sectionId: string;
    clauseId: string;
    classification: 'favorable' | 'neutral' | 'unfavorable';
    suggestedText?: string;
    arguments?: {
      toImprove: string;
      internal: string;
    };
  }[];
}
