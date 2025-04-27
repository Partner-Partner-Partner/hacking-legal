import { Contract } from "@/types/contract";
import { ContractSection } from "@/types/playbook";
import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle, AlertTriangle, HelpCircle, XCircle } from "lucide-react";
import { ClauseClassification } from "@/types/comparison";

interface CompareSidebarProps {
  contract: Contract;
  playbook: ContractSection[];
  activeSection: string | null;
  activeClause: string | null;
  onSectionClick: (sectionTitle: string) => void;
  onClauseClick: (sectionTitle: string, clauseId: string) => void;
  classifications: ClauseClassification[];
}

export function CompareSidebar({
  contract,
  playbook,
  activeSection,
  activeClause,
  onSectionClick,
  onClauseClick,
  classifications,
}: CompareSidebarProps) {
  // Get classification for a specific clause
  const getClauseClassification = (sectionTitle: string, clauseText: string) => {
    const classification = classifications.find(
      c => c.sectionTitle === sectionTitle && c.clauseText === clauseText
    );
    return classification?.classification || null;
  };

  // Get icon for classification
  const getClassificationIcon = (classification: string | null) => {
    switch (classification) {
      case "mostFavorable":
        return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
      case "balanced":
        return <HelpCircle className="h-3.5 w-3.5 text-blue-500" />;
      case "acceptable":
        return <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />;
      case "unacceptable":
        return <XCircle className="h-3.5 w-3.5 text-red-500" />;
      default:
        return null;
    }
  };

  // Legend for classification icons
  const renderLegend = () => (
    <div className="px-3 py-2 border-t border-border">
      <div className="text-xs font-medium text-muted-foreground mb-1.5">Classification Legend:</div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
        <div className="flex items-center gap-1.5 text-xs">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Most Favorable</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <HelpCircle className="h-3 w-3 text-blue-500" />
          <span>Balanced</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <AlertTriangle className="h-3 w-3 text-yellow-500" />
          <span>Acceptable</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <XCircle className="h-3 w-3 text-red-500" />
          <span>Unacceptable</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-64 border-r border-border flex flex-col h-screen">
      <div className="p-3 border-b border-border bg-muted/30">
        <h2 className="font-medium">Contract Sections</h2>
      </div>
      
      {/* Contract sections list */}
      <div className="overflow-y-auto flex-1 py-2">
        <div className="space-y-1">
          {contract.sections.map((section) => {
            // Find if there's a matching playbook section
            const hasPlaybookMatch = playbook.some(p => p.title === section.title);
            
            return (
              <div key={section.title}>
                <button
                  className={`w-full text-left px-3 py-2 flex items-center text-sm ${
                    activeSection === section.title
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => onSectionClick(section.title)}
                >
                  {activeSection === section.title ? (
                    <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  )}
                  <span className="truncate flex-1">{section.title}</span>
                  
                  {!hasPlaybookMatch && (
                    <span className="w-2 h-2 bg-yellow-400 rounded-full" title="No playbook match"></span>
                  )}
                </button>
                
                {activeSection === section.title && (
                  <div className="ml-6 my-1 space-y-0.5">
                    {section.clauses.map((clause, index) => {
                      const classification = getClauseClassification(section.title, clause.text);
                      
                      return (
                        <button
                          key={`${section.title}-clause-${index}`}
                          className={`w-full text-left px-3 py-1.5 text-xs rounded-sm flex items-center ${
                            activeClause === `${index}` && activeSection === section.title
                              ? "bg-primary/5 font-medium"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => onClauseClick(section.title, `${index}`)}
                        >
                          <span className="truncate flex-1">Clause {index + 1}</span>
                          <span className="ml-1.5 flex-shrink-0">
                            {getClassificationIcon(classification)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Classification legend */}
      {renderLegend()}
    </div>
  );
}
