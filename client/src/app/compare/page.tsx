'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { sampleContract } from "@/data/sampleContract";
import { samplePlaybook } from "@/data/samplePlaybook";
import { CompareSidebar } from "@/components/compare/CompareSidebar";
import { DiffViewer } from "@/components/compare/DiffViewer";
import { useCompareNavigation } from '@/hooks/useCompareNavigation';
import { ClauseClassification } from "@/types/comparison";

const ComparePage = () => {
  // Track active sections and clauses
  const { 
    activeSection, 
    activeClause,
    openSections,
    handleSectionClick,
    handleClauseClick,
    contentRef,
  } = useCompareNavigation(sampleContract, samplePlaybook);

  // Track classifications for contract clauses
  const [classifications, setClassifications] = useState<ClauseClassification[]>([]);
  
  // Track applied improvements
  const [improvedClauses, setImprovedClauses] = useState<Record<string, string>>({});

  const handleClassifyClause = (sectionTitle: string, clauseText: string, classification: string) => {
    const newClassification = {
      sectionTitle,
      clauseText,
      classification,
    };
    
    setClassifications(prev => {
      // Remove any existing classification for this clause
      const filtered = prev.filter(c => 
        !(c.sectionTitle === sectionTitle && c.clauseText === clauseText)
      );
      // Add the new classification
      return [...filtered, newClassification];
    });
  };

  const handleApplyArgument = (sectionTitle: string, clauseIndex: number, newText: string) => {
    const key = `${sectionTitle}-${clauseIndex}`;
    setImprovedClauses(prev => ({
      ...prev,
      [key]: newText
    }));
  };

  return (
    <div className="flex h-screen bg-background">
      <CompareSidebar
        contract={sampleContract}
        playbook={samplePlaybook}
        activeSection={activeSection}
        activeClause={activeClause}
        onSectionClick={handleSectionClick}
        onClauseClick={handleClauseClick}
        classifications={classifications}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border p-4 bg-background">
          <h1 className="text-xl font-semibold">Contract Analysis</h1>
        </div>
        <motion.div 
          className="flex-1 overflow-y-auto scroll-smooth p-6" 
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-6xl mx-auto">
            <DiffViewer
              contract={sampleContract}
              playbook={samplePlaybook}
              openSections={openSections}
              activeSection={activeSection}
              activeClause={activeClause}
              onClassifyClause={handleClassifyClause}
              classifications={classifications}
              improvedClauses={improvedClauses}
              onApplyArgument={handleApplyArgument}
              onSectionClick={handleSectionClick}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ComparePage;