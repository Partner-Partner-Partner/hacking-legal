/**
 * Represents a contract clause with different negotiation positions
 */
export interface ContractClause {
  id: string;
  title: string;
  text: string;         // Add text property for current clause content
  mostFavorable: string;     // Customer-friendly position (optimal)
  balanced: string;          // Fair compromise position
  acceptable: string;        // Minimal acceptable position
  unacceptable: string;      // Vendor-friendly position (to be avoided)
  currentState?: string;     // Current language in the contract
  targetState?: string;      // Desired language we want to negotiate towards
  arguments?: {
    toMostFavorable: NegotiationArgument;
    toBalanced: NegotiationArgument;
    fromUnacceptable: NegotiationArgument;
  };
}

/**
 * Represents arguments used during contract negotiation
 */
export interface NegotiationArgument {
  external: string; // Arguments presented to the contract partner
  internal: string; // Strategic rationale for our own team
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
