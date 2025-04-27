/**
 * Types for contract comparison and analysis functionality
 */

export interface ClauseClassification {
  sectionTitle: string;
  clauseText: string;
  classification: string; // 'mostFavorable', 'balanced', 'acceptable', or 'unacceptable'
}

export interface ClauseImprovement {
  sectionTitle: string;
  clauseIndex: number;
  originalText: string;
  improvedText: string;
  appliedArgument: string;
}

export interface ComparisonResult {
  sectionTitle: string;
  matchFound: boolean;
  playbookSectionId?: string;
  clauseMatches: {
    contractClauseIndex: number;
    playbookClauseId?: string;
    classification?: string;
    diff?: DiffResult;
  }[];
}

export interface DiffResult {
  added: string[];
  removed: string[];
  unchanged: string[];
}
