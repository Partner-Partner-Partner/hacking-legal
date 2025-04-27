/**
 * TypeScript interfaces mirroring the backend contract model
 */

export interface Clause {
  text: string;
}

export interface Subsection {
  title: string;
  clauses: Clause[];
}

export interface SectionRaw {
  title: string;
  text: string;
}

export interface Section {
  title: string;
  clauses: Clause[];
  subsections: Subsection[];
}

export interface Party {
  name: string;
}

export interface ContractRaw {
  parties: Party[];
  title: string;
  sections: SectionRaw[];
}

export interface Contract {
  title: string;
  parties: Party[];
  sections: Section[];
}
