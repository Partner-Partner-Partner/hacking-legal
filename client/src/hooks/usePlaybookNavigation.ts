import { useState, useRef } from "react";
import { ContractSection, PlaybookSection } from "@/types/playbook";

// Support both new and legacy formats
type SectionType = PlaybookSection | ContractSection;

// Helper to check if a section is the new type
const isPlaybookSection = (section: SectionType): section is PlaybookSection => {
  return 'variants' in section;
}

// Get section ID safely
const getSectionId = (section: SectionType): string => {
  return isPlaybookSection(section) ? section.title : section.id;
}

export const usePlaybookNavigation = (sections: SectionType[]) => {
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
      let elementId;
      if (clauseId.startsWith('variant-')) {
        elementId = `section-variant-${sectionId}`;
      } else {
        elementId = `clause-${clauseId}`;
      }
      
      const element = document.getElementById(elementId);
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
