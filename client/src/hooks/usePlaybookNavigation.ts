import { useState, useRef } from 'react';
import { ContractSection } from '@/types/playbook';

export function usePlaybookNavigation(playbook: ContractSection[]) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [activeClause, setActiveClause] = useState<string>('');
  const [openSections, setOpenSections] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const isManualScrollRef = useRef(false);

  const smoothScrollTo = (elementId: string, delay = 0) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (!element || !contentRef.current) return;

      isManualScrollRef.current = true;
      const yOffset = -50;
      const y = element.getBoundingClientRect().top + contentRef.current.scrollTop + yOffset;
      
      contentRef.current.scrollTo({ top: y, behavior: 'smooth' });
      setTimeout(() => { isManualScrollRef.current = false; }, 1000);
    }, delay);
  };

  const handleSectionClick = (sectionId: string) => {
    if (!openSections.includes(sectionId)) {
      setOpenSections(prev => [...prev, sectionId]);
    }
    smoothScrollTo(`section-${sectionId}`);
  };

  const handleClauseClick = (sectionId: string, clauseId: string) => {
    if (!openSections.includes(sectionId)) {
      setOpenSections(prev => [...prev, sectionId]);
      smoothScrollTo(`clause-${clauseId}`, 100);
    } else {
      smoothScrollTo(`clause-${clauseId}`);
    }
  };

  return {
    activeSection,
    setActiveSection,
    activeClause,
    setActiveClause,
    openSections,
    setOpenSections,
    handleSectionClick,
    handleClauseClick,
    contentRef,
    isManualScrollRef,
  };
}
