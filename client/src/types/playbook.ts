/**
 * Represents a contract clause with different negotiation positions
 */
export interface ContractClause {
  id: string;
  title: string;
  mostFavorable: string;     // Customer-friendly position (optimal)
  balanced: string;          // Fair compromise position
  acceptable: string;        // Minimal acceptable position
  unacceptable: string;      // Vendor-friendly position (to be avoided)
  arguments?: {              // Making arguments optional with '?'
    toMostFavorable: string; // Arguments to move from balanced to most favorable
    toBalanced: string;      // Arguments to move from acceptable to balanced
    fromUnacceptable: string; // Arguments to move away from unacceptable positions
  };
}

/**
 * Represents a section of a contract containing related clauses
 */
export interface ContractSection {
  id: string;
  title: string;
  description: string;
  clauses: ContractClause[];
}
