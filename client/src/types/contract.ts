/**
 * TypeScript interfaces mirroring the backend contract model
 */

/**
 * Represents a clause (a single provision) in a contract
 */
export interface Clause {
  text: string;
  id?: string; // Optional ID for referencing
}

/**
 * Represents a subsection of a contract section
 */
export interface Subsection {
  title: string;
  clauses: Clause[];
  id?: string; // Optional ID for referencing
}

/**
 * Represents a major section of a contract
 */
export interface SectionRaw {
  title: string;
  text: string;
}

export interface Section {
  title: string;
  clauses: Clause[];
  subsections: Subsection[];
  id?: string; // Optional ID for referencing
}

/**
 * Represents a party in a contract (e.g., customer, vendor)
 */
export interface Party {
  name: string;
  // Other party attributes can be added here (address, contacts, etc.)
}

/**
 * Represents a complete contract document
 */
export interface ContractRaw {
  parties: Party[];
  title: string;
  sections: SectionRaw[];
}

/**
 * Represents a contract with its sections and metadata
 */
export interface Contract {
  id?: string;       // Made optional to allow for unsaved contracts
  title: string;
  parties: Array<{
    name: string;
    role: string;
  }>;
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  createdAt?: string;
  status?: 'draft' | 'active' | 'expired' | 'pending';
}
