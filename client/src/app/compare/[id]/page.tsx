'use client';

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from "framer-motion";
import { CompareSidebar } from "@/components/compare/CompareSidebar";
import { DiffViewer } from "@/components/compare/DiffViewer";
import { useCompareNavigation } from '@/hooks/useCompareNavigation';
import { ClauseClassification } from "@/types/comparison";
import { contractApi } from "@/api/client";
import { Contract } from "@/types/contract";
import { ContractSection } from "@/types/playbook";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

// Internal wrapper component to use the useSidebar hook
function CompareSidebarContent() {
  const sidebar = useSidebar();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [playbook, setPlaybook] = useState<ContractSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the playbook ID from the URL query parameters
  const playbookId = searchParams.get('playbook');
  
  // Track classifications for contract clauses
  const [classifications, setClassifications] = useState<ClauseClassification[]>([]);
  
  // Load contract and playbook data
  useEffect(() => {
    const loadData = async () => {
      if (!params.id || !playbookId) {
        setError("Missing contract ID or playbook ID");
        setLoading(false);
        return;
      }
      
      try {
        // For a file upload comparison, we would use:
        // const result = await contractApi.compareContract(file, playbookId);
        
        // For retrieving an existing comparison:
        const contractData = await fetch(`/api/contracts/${params.id}`);
        const playbookData = await fetch(`/api/playbooks/${playbookId}`);
        const classificationData = await fetch(`/api/classifications/${params.id}`);
        
        if (!contractData.ok || !playbookData.ok) {
          throw new Error("Failed to load data");
        }
        
        const contract = await contractData.json();
        const playbook = await playbookData.json();
        
        // Load automatic classifications if available
        let autoClassifications: ClauseClassification[] = [];
        if (classificationData.ok) {
          autoClassifications = await classificationData.json();
          setClassifications(autoClassifications);
        }
        
        setContract(contract);
        setPlaybook(playbook.sections);
        
      } catch (err) {
        console.error("Error loading comparison data:", err);
        setError("Failed to load comparison data");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [params.id, playbookId]);
  
  // Track active sections and clauses
  const { 
    activeSection, 
    activeClause,
    openSections,
    handleSectionClick,
    handleClauseClick,
    contentRef,
  } = useCompareNavigation(
    // Use a properly typed fallback contract with only required properties
    contract || { 
      title: "Untitled Contract",
      parties: [],
      sections: []
    } as Contract,
    playbook
  );
  
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
    
    // Send the classification to the backend
    fetch(`/api/classifications/${params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newClassification),
    }).catch(err => {
      console.error("Error saving classification:", err);
    });
  };

  const handleApplyArgument = (sectionTitle: string, clauseIndex: number, newText: string) => {
    const key = `${sectionTitle}-${clauseIndex}`;
    setImprovedClauses(prev => ({
      ...prev,
      [key]: newText
    }));
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (error || !contract) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  return (
    <>
      <CompareSidebar
        contract={contract}
        playbook={playbook}
        activeSection={activeSection}
        activeClause={activeClause}
        onSectionClick={handleSectionClick}
        onClauseClick={handleClauseClick}
        classifications={classifications}
      />
      <SidebarInset>
        <motion.div 
          className="flex-1 overflow-y-auto scroll-smooth p-6" 
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbPage>Contract Analysis</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <DiffViewer
              contract={contract}
              playbook={playbook}
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
      </SidebarInset>
    </>
  );
}

const ComparePage = () => {
  return (
    <SidebarProvider>
      <CompareSidebarContent />
    </SidebarProvider>
  );
};

export default ComparePage;