import { Contract, Section, Clause } from "./contract";
import { ContractSection, ContractClause } from "./playbook";

/**
 * Types for contract comparison and analysis functionality
 */

export interface ClauseClassification {
  sectionTitle: string;
  clauseText: string;
  classification: string; // 'mostFavorable', 'balanced', 'acceptable', or 'unacceptable'
  
  // Additional properties for automatic classification
  sectionId?: string;      // ID of the section containing this clause
  clauseId?: string;       // ID of the clause
  suggestedState?: 'mostFavorable' | 'balanced' | 'acceptable'; // Target state to negotiate towards
  suggestedText?: string;  // Suggested replacement text based on playbook
  argumentsForChange?: {   // Arguments to support the suggested changes
    external: string;      // Argument to present to the counterparty
    internal: string;      // Internal rationale for the negotiation team
  };
  autoClassified?: boolean; // Whether this classification was done automatically
}

export interface ClauseImprovement {
  sectionTitle: string;
  clauseIndex: number;
  originalText: string;
  improvedText: string;
  appliedArgument: string;
}

export interface ComparisonResult {
  contract: Contract;
  playbook: ContractSection[];
  classifications: ClauseClassification[];
}

export interface DiffResult {
  added: string[];
  removed: string[];
  unchanged: string[];
}
