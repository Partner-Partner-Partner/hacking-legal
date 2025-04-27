import { useState } from "react";
import { Contract } from "@/types/contract";
import { ContractSection as PlaybookSection } from "@/types/playbook";
import { ClauseClassification } from "@/types/comparison";
import { Check, AlertTriangle, HelpCircle, XCircle, ArrowRight, Edit, PlusCircle, MinusCircle } from "lucide-react";
import { Diff, DiffMethod } from "@/components/compare/Diff";

interface DiffViewerProps {
  contract: Contract;
  playbook: PlaybookSection[];
  openSections: string[];
  activeSection: string | null;
  activeClause: string | null;
  classifications: ClauseClassification[];
  improvedClauses: Record<string, string>;
  onClassifyClause: (sectionTitle: string, clauseText: string, classification: string) => void;
  onApplyArgument: (sectionTitle: string, clauseIndex: number, newText: string) => void;
  viewMode?: 'unified' | 'split';
}

export function DiffViewer({
  contract,
  playbook,
  openSections,
  activeSection,
  activeClause,
  classifications,
  improvedClauses,
  onClassifyClause,
  onApplyArgument,
  viewMode = 'unified',
}: DiffViewerProps) {
  const [expandedDiff, setExpandedDiff] = useState<string | null>(null);

  // Find matching playbook section for a contract section
  const findMatchingPlaybookSection = (sectionTitle: string) => {
    return playbook.find(s => s.title === sectionTitle);
  };

  // Get classification for a specific clause
  const getClauseClassification = (sectionTitle: string, clauseText: string) => {
    const classification = classifications.find(
      c => c.sectionTitle === sectionTitle && c.clauseText === clauseText
    );
    return classification?.classification || null;
  };

  // Get the improved clause text if available
  const getImprovedText = (sectionTitle: string, clauseIndex: number) => {
    const key = `${sectionTitle}-${clauseIndex}`;
    return improvedClauses[key] || null;
  };

  // Toggle expanded diff view for a specific clause
  const toggleExpandedDiff = (key: string) => {
    if (expandedDiff === key) {
      setExpandedDiff(null);
    } else {
      setExpandedDiff(key);
    }
  };

  return (
    <div className="space-y-8">
      {contract.sections.map((section, sectionIndex) => {
        const isOpen = openSections.includes(section.title);
        const isActive = activeSection === section.title;
        const matchingPlaybookSection = findMatchingPlaybookSection(section.title);

        return (
          <div 
            key={`section-${sectionIndex}`}
            id={`section-${section.title}`}
            className={`border rounded-lg shadow-sm ${isActive ? 'border-primary' : 'border-border'}`}
          >
            <div 
              className={`px-6 py-4 font-medium flex items-center justify-between ${
                isActive ? "bg-primary/5 text-primary border-b border-primary/20" : "bg-muted/20"
              }`}
            >
              <h2 className="text-lg">{section.title}</h2>
            </div>

            {isOpen && (
              <div className="px-6 py-4 space-y-6">
                {section.clauses.map((clause, clauseIndex) => {
                  const clauseId = `${clauseIndex}`;
                  const isClauseActive = activeClause === clauseId && isActive;
                  const classification = getClauseClassification(section.title, clause.text);
                  const improvedText = getImprovedText(section.title, clauseIndex);
                  const diffKey = `${section.title}-${clauseIndex}`;
                  const isDiffExpanded = expandedDiff === diffKey;
                  
                  // Find matching playbook clause if available
                  let playbookClause = null;
                  if (matchingPlaybookSection && matchingPlaybookSection.clauses[clauseIndex]) {
                    playbookClause = matchingPlaybookSection.clauses[clauseIndex];
                  }

                  // Current version (considering improvements)
                  const currentText = improvedText || clause.text;

                  // Determine which versions to offer
                  const hasMostFavorable = playbookClause && playbookClause.mostFavorable;
                  const hasBalanced = playbookClause && playbookClause.balanced;
                  
                  return (
                    <div 
                      key={`clause-${clauseIndex}`}
                      id={`clause-${section.title}-${clauseId}`}
                      className={`rounded-lg ${
                        isClauseActive ? 'ring-2 ring-primary/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-sm">Clause {clauseIndex + 1}</h3>
                        <div className="flex items-center gap-2">
                          {/* Quick Action Buttons */}
                          {hasMostFavorable && (
                            <button
                              onClick={() => onApplyArgument(section.title, clauseIndex, playbookClause.mostFavorable)}
                              className="text-xs px-3 py-1.5 bg-green-100 text-green-800 hover:bg-green-200 rounded-md flex items-center gap-1.5 transition-colors"
                            >
                              <Check className="h-3 w-3" />
                              Apply Most Favorable
                            </button>
                          )}
                          {hasBalanced && (
                            <button
                              onClick={() => onApplyArgument(section.title, clauseIndex, playbookClause.balanced)}
                              className="text-xs px-3 py-1.5 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md flex items-center gap-1.5 transition-colors"
                            >
                              <HelpCircle className="h-3 w-3" />
                              Apply Balanced
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Clause content */}
                      {viewMode === 'unified' ? (
                        // Unified view with improved text and classification
                        <div className="space-y-3">
                          {/* Classification badges if clause is classified */}
                          {classification && (
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="text-xs font-medium text-muted-foreground">Classification:</span>
                              <ClassificationBadge type={classification} />
                            </div>
                          )}

                          {/* Current contract clause */}
                          <div className={`p-4 rounded-md border ${classification ? getClassBorder(classification) : 'border-border'} bg-card`}>
                            <p className="text-sm whitespace-pre-wrap">{currentText}</p>
                          </div>
                          
                          {/* Diff toggle button if playbook version available */}
                          {(hasMostFavorable || hasBalanced) && (
                            <button
                              onClick={() => toggleExpandedDiff(diffKey)}
                              className="text-xs flex items-center gap-1.5 text-primary hover:underline mt-2"
                            >
                              <Edit className="h-3 w-3" />
                              {isDiffExpanded ? "Hide changes" : "Show suggested changes"}
                            </button>
                          )}
                          
                          {/* Expanded diff view */}
                          {isDiffExpanded && playbookClause && (
                            <div className="mt-4 border rounded-md p-4 bg-gray-50">
                              <h4 className="text-sm font-medium mb-3">Change Preview</h4>
                              
                              {/* Most favorable diff */}
                              {hasMostFavorable && (
                                <div className="mb-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-medium">Most Favorable Version:</p>
                                    <button
                                      onClick={() => onApplyArgument(section.title, clauseIndex, playbookClause.mostFavorable)}
                                      className="text-xs px-2 py-1 bg-green-100 text-green-800 hover:bg-green-200 rounded flex items-center gap-1"
                                    >
                                      <Check className="h-3 w-3" /> Apply
                                    </button>
                                  </div>
                                  <div className="border rounded bg-white p-3">
                                    <Diff
                                      oldText={currentText}
                                      newText={playbookClause.mostFavorable}
                                      method={DiffMethod.WORDS}
                                    />
                                  </div>
                                </div>
                              )}
                              
                              {/* Balanced diff */}
                              {hasBalanced && (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-medium">Balanced Version:</p>
                                    <button
                                      onClick={() => onApplyArgument(section.title, clauseIndex, playbookClause.balanced)}
                                      className="text-xs px-2 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded flex items-center gap-1"
                                    >
                                      <Check className="h-3 w-3" /> Apply
                                    </button>
                                  </div>
                                  <div className="border rounded bg-white p-3">
                                    <Diff
                                      oldText={currentText}
                                      newText={playbookClause.balanced}
                                      method={DiffMethod.WORDS}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Classification buttons */}
                          {playbookClause && !classification && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="text-xs text-muted-foreground mb-2">Classify this clause:</div>
                              <div className="flex flex-wrap gap-1.5">
                                <ClassificationButton 
                                  type="mostFavorable" 
                                  active={false} 
                                  onClick={() => onClassifyClause(section.title, clause.text, 'mostFavorable')}
                                />
                                <ClassificationButton 
                                  type="balanced" 
                                  active={false} 
                                  onClick={() => onClassifyClause(section.title, clause.text, 'balanced')}
                                />
                                <ClassificationButton 
                                  type="acceptable" 
                                  active={false} 
                                  onClick={() => onClassifyClause(section.title, clause.text, 'acceptable')}
                                />
                                <ClassificationButton 
                                  type="unacceptable" 
                                  active={false} 
                                  onClick={() => onClassifyClause(section.title, clause.text, 'unacceptable')}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Side-by-side diff view
                        <div className="grid grid-cols-2 gap-4">
                          {/* Left side: Current contract */}
                          <div className="space-y-2">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1 flex items-center justify-between">
                              <span>Current Contract</span>
                              {classification && <ClassificationBadge type={classification} small />}
                            </div>
                            <div className={`p-4 rounded-md border ${classification ? getClassBorder(classification) : 'border-border'} bg-card h-full`}>
                              <p className="text-sm whitespace-pre-wrap">{currentText}</p>
                            </div>
                          </div>
                          
                          {/* Right side: Playbook suggestion */}
                          <div className="space-y-2">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1 flex justify-between items-center">
                              <span>Recommended Version</span>
                              {playbookClause && (
                                <select 
                                  className="text-xs border rounded p-1"
                                  onChange={(e) => onApplyArgument(section.title, clauseIndex, e.target.value)}
                                  defaultValue=""
                                >
                                  <option value="" disabled>Apply version...</option>
                                  {playbookClause.mostFavorable && (
                                    <option value={playbookClause.mostFavorable}>Most Favorable</option>
                                  )}
                                  {playbookClause.balanced && (
                                    <option value={playbookClause.balanced}>Balanced</option>
                                  )}
                                </select>
                              )}
                            </div>
                            
                            {playbookClause ? (
                              <div className="p-4 rounded-md border border-green-200 bg-green-50 h-full">
                                <Diff
                                  oldText={currentText}
                                  newText={classification === 'mostFavorable' || !classification ? 
                                    playbookClause.mostFavorable || playbookClause.balanced : 
                                    playbookClause.mostFavorable || playbookClause.balanced
                                  }
                                  method={DiffMethod.WORDS}
                                  splitView={true}
                                />
                              </div>
                            ) : (
                              <div className="p-4 rounded-md border border-border bg-muted/20 h-full flex items-center justify-center">
                                <p className="text-sm text-muted-foreground">No playbook recommendation available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Helper component for classification badges
function ClassificationBadge({ 
  type, 
  small = false 
}: { 
  type: string;
  small?: boolean;
}) {
  let icon;
  let label;
  let colors;

  switch (type) {
    case 'mostFavorable':
      icon = <Check className={`${small ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />;
      label = "Most Favorable";
      colors = "bg-green-100 text-green-800";
      break;
    case 'balanced':
      icon = <HelpCircle className={`${small ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />;
      label = "Balanced";
      colors = "bg-blue-100 text-blue-800";
      break;
    case 'acceptable':
      icon = <AlertTriangle className={`${small ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />;
      label = "Acceptable";
      colors = "bg-yellow-100 text-yellow-800";
      break;
    case 'unacceptable':
      icon = <XCircle className={`${small ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />;
      label = "Unacceptable";
      colors = "bg-red-100 text-red-800";
      break;
  }

  return (
    <span
      className={`${small ? 'px-1.5 py-0.5' : 'px-2 py-1'} ${colors} rounded-full flex items-center gap-1 text-xs`}
    >
      {icon} {label}
    </span>
  );
}

// Helper component for classification buttons
function ClassificationButton({ 
  type, 
  active, 
  onClick 
}: { 
  type: string;
  active: boolean;
  onClick: () => void;
}) {
  let icon;
  let label;
  let colors;

  switch (type) {
    case 'mostFavorable':
      icon = <Check className="h-3 w-3" />;
      label = "Most Favorable";
      colors = active ? "bg-green-100 text-green-800 border-green-300 border" : "bg-muted/50 hover:bg-green-50 text-muted-foreground";
      break;
    case 'balanced':
      icon = <HelpCircle className="h-3 w-3" />;
      label = "Balanced";
      colors = active ? "bg-blue-100 text-blue-800 border-blue-300 border" : "bg-muted/50 hover:bg-blue-50 text-muted-foreground";
      break;
    case 'acceptable':
      icon = <AlertTriangle className="h-3 w-3" />;
      label = "Acceptable";
      colors = active ? "bg-yellow-100 text-yellow-800 border-yellow-300 border" : "bg-muted/50 hover:bg-yellow-50 text-muted-foreground";
      break;
    case 'unacceptable':
      icon = <XCircle className="h-3 w-3" />;
      label = "Unacceptable";
      colors = active ? "bg-red-100 text-red-800 border-red-300 border" : "bg-muted/50 hover:bg-red-50 text-muted-foreground";
      break;
  }

  return (
    <button
      className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 transition-colors ${colors}`}
      onClick={onClick}
    >
      {icon} {label}
    </button>
  );
}

// Helper function to get border color based on classification
function getClassBorder(classification: string) {
  switch (classification) {
    case 'mostFavorable':
      return 'border-green-300';
    case 'balanced':
      return 'border-blue-300';
    case 'acceptable':
      return 'border-yellow-300';
    case 'unacceptable':
      return 'border-red-300';
    default:
      return 'border-border';
  }
}
