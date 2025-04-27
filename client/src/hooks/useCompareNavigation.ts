import { useState, useRef, useEffect } from "react";
import { Contract } from "@/types/contract";
import { ContractSection } from "@/types/playbook";

export function useCompareNavigation(contract: Contract, playbook: ContractSection[]) {
  // Track active section and clause
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeClause, setActiveClause] = useState<string | null>(null);
  
  // Track expanded sections
  const [openSections, setOpenSections] = useState<string[]>([]);
  
  // Reference to content container for scrolling
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle section click
  const handleSectionClick = (sectionTitle: string) => {
    setActiveSection(sectionTitle);
    setActiveClause(null);
    
    // Toggle open sections
    if (openSections.includes(sectionTitle)) {
      setOpenSections(openSections.filter(s => s !== sectionTitle));
    } else {
      setOpenSections([...openSections, sectionTitle]);
    }
    
    // Scroll to the section
    setTimeout(() => {
      if (contentRef.current) {
        const element = document.getElementById(`section-${sectionTitle}`);
        if (element) {
          const containerTop = contentRef.current.getBoundingClientRect().top;
          const elementTop = element.getBoundingClientRect().top;
          contentRef.current.scrollTop += elementTop - containerTop - 20;
        }
      }
    }, 100);
  };

  // Handle clause click
  const handleClauseClick = (sectionTitle: string, clauseId: string) => {
    setActiveSection(sectionTitle);
    setActiveClause(clauseId);
    
    // Ensure section is open
    if (!openSections.includes(sectionTitle)) {
      setOpenSections([...openSections, sectionTitle]);
    }
    
    // Scroll to the clause
    setTimeout(() => {
      if (contentRef.current) {
        const element = document.getElementById(`clause-${sectionTitle}-${clauseId}`);
        if (element) {
          const containerTop = contentRef.current.getBoundingClientRect().top;
          const elementTop = element.getBoundingClientRect().top;
          contentRef.current.scrollTop += elementTop - containerTop - 20;
        }
      }
    }, 100);
  };

  // Initialize with first section open
  useEffect(() => {
    if (contract.sections.length > 0 && openSections.length === 0) {
      setOpenSections([contract.sections[0].title]);
      setActiveSection(contract.sections[0].title);
    }
  }, [contract.sections, openSections.length]);

  return {
    activeSection,
    activeClause,
    openSections,
    setOpenSections,
    handleSectionClick,
    handleClauseClick,
    contentRef,
  };
}
