/**
 * Type representing the favorability levels for playbook variants
 */
export type Favorability = "Most Favorable" | "Balanced" | "Acceptable" | "Unacceptable";

/**
 * Represents a variant of contract language with associated favorability and justification
 */
export interface PlaybookVariant {
  text: string;
  favorability: Favorability;
  justification: string;
}

/**
 * Represents a section of a playbook containing multiple variant options
 */
export interface PlaybookSection {
  title: string;
  variants: PlaybookVariant[];
}

/**
 * Represents the complete playbook containing multiple sections
 */
export interface Playbook {
  id: string;
  sections: PlaybookSection[];
}

// Helper functions for working with playbooks

/**
 * Retrieves a specific variant by favorability from a section
 */
export function getVariantByFavorability(section: PlaybookSection, favorability: Favorability): PlaybookVariant | undefined {
  return section.variants.find(variant => variant.favorability === favorability);
}

/**
 * Legacy interface - maintained for backward compatibility during transition
 * @deprecated Use PlaybookSection and PlaybookVariant instead
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
 * Legacy interface - maintained for backward compatibility during transition
 * @deprecated Use PlaybookVariant justification instead
 */
export interface NegotiationArgument {
  external: string; // Arguments presented to the contract partner
  internal: string; // Strategic rationale for our own team
}

/**
 * Legacy interface - maintained for backward compatibility during transition
 * @deprecated Use PlaybookSection instead
 */
export interface ContractSection {
  id: string;
  title: string;
  description: string;
  clauses: ContractClause[];
}
