import { useState, useRef } from "react";
import { ContractSection } from "@/types/playbook";
import { Contract } from "@/types/contract";

export const useCompareNavigation = (contract: Contract, playbook: ContractSection[]) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [activeClause, setActiveClause] = useState<string>("");
  const [openSections, setOpenSections] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // Add to open sections if not already there
    if (!openSections.includes(sectionId)) {
      setOpenSections([...openSections, sectionId]);
    }
    
    // Scroll to section
    setTimeout(() => {
      const element = document.getElementById(`section-${sectionId}`);
      if (element && contentRef.current) {
        contentRef.current.scrollTo({
          top: element.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    }, 100);
  };
  
  const handleClauseClick = (sectionId: string, clauseId: string) => {
    setActiveSection(sectionId);
    setActiveClause(clauseId);
    
    // Add section to open sections if not already there
    if (!openSections.includes(sectionId)) {
      setOpenSections([...openSections, sectionId]);
    }
    
    // Scroll to clause
    setTimeout(() => {
      const element = document.getElementById(`clause-${clauseId}`);
      if (element && contentRef.current) {
        contentRef.current.scrollTo({
          top: element.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    }, 100);
  };
  
  return {
    activeSection,
    activeClause,
    openSections,
    setOpenSections,
    handleSectionClick,
    handleClauseClick,
    contentRef
  };
};
