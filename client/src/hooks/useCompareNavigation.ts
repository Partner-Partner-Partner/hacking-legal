import { useCallback, useEffect, useRef, useState } from 'react';
import { Contract } from '@/types/contract';
import { ContractSection } from '@/types/playbook';

/**
 * A custom hook for navigating between sections and clauses of a contract comparison
 */
export function useCompareNavigation(contract: Contract, playbook: ContractSection[]) {
  // State for tracking active sections and clauses
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeClause, setActiveClause] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<string[]>([]);
  
  // Reference to the content scrollable area
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle section click - toggle expanded state
  const handleSectionClick = useCallback((sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
    setActiveSection(sectionId);
    setActiveClause(null);
    
    // Scroll to the section if necessary
    setTimeout(() => {
      const element = document.getElementById(`section-${sectionId}`);
      if (element && contentRef.current) {
        contentRef.current.scrollTo({
          top: element.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, []);

  // Handle clause click - set active clause
  const handleClauseClick = useCallback((sectionId: string, clauseId: string) => {
    setActiveSection(sectionId);
    setActiveClause(clauseId);
    
    // Ensure the section is open
    setOpenSections(prev => 
      prev.includes(sectionId) ? prev : [...prev, sectionId]
    );
    
    // Scroll to the clause if necessary
    setTimeout(() => {
      const element = document.getElementById(`clause-${sectionId}-${clauseId}`);
      if (element && contentRef.current) {
        contentRef.current.scrollTo({
          top: element.offsetTop - 40,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, []);

  // Initialize with the first section if no active section
  useEffect(() => {
    if (contract && contract.sections.length > 0 && !activeSection) {
      const firstSectionId = contract.sections[0].title;
      setActiveSection(firstSectionId);
      setOpenSections([firstSectionId]);
    }
  }, [contract, activeSection]);

  return {
    activeSection,
    activeClause,
    openSections,
    handleSectionClick,
    handleClauseClick,
    contentRef
  };
}
