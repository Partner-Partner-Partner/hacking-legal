import React, { useState, useEffect } from 'react';
import { PlaybookSection, ContractSection } from '@/types/playbook';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// Support both new and legacy formats
type SectionType = PlaybookSection | ContractSection;

interface PlaybookSidebarProps {
  sections: SectionType[];
  activeSection: string;
  activeClause?: string;
  onSectionClick: (sectionId: string) => void;
  onClauseClick?: (sectionId: string, clauseId: string) => void;
}

// Helper to check if a section is the new type
const isPlaybookSection = (section: SectionType): section is PlaybookSection => {
  return 'variants' in section;
}

export function PlaybookSidebar({
  sections,
  activeSection,
  activeClause,
  onSectionClick,
  onClauseClick,
}: PlaybookSidebarProps) {
  // Track expanded sections to manage the sidebar state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  // Automatically expand active section when it changes
  useEffect(() => {
    if (activeSection && !expandedSections.has(activeSection)) {
      setExpandedSections(prev => new Set([...prev, activeSection]));
    }
  }, [activeSection]);

  const toggleSection = (sectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };
  
  // Get section ID safely
  const getSectionId = (section: SectionType): string => {
    return isPlaybookSection(section) ? section.title : section.id;
  };
  
  return (
    <motion.div 
      className="w-72 border-r h-screen flex flex-col bg-muted/40"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-14 items-center gap-3 border-b px-6">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="text-base font-medium">Contract Playbook</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          {sections.map((section) => {
            const sectionId = getSectionId(section);
            const sectionTitle = isPlaybookSection(section) ? section.title : section.title;
            
            return (
              <motion.div 
                key={sectionId}
                className="mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Section header with indicator and better padding */}
                <div 
                  className={cn(
                    "flex items-center justify-between py-2 px-4 rounded-md",
                    "cursor-pointer transition-colors",
                    activeSection === sectionId
                      ? "bg-accent text-accent-foreground font-medium" 
                      : "hover:bg-accent/50 text-foreground/80"
                  )}
                >
                  <button
                    className="flex-1 text-left text-sm truncate"
                    onClick={() => onSectionClick(sectionId)}
                  >
                    {sectionTitle}
                  </button>
                  <motion.button 
                    onClick={(e) => toggleSection(sectionId, e)}
                    className="h-5 w-5 rounded-sm flex items-center justify-center"
                    whileHover={{ 
                      backgroundColor: "rgba(0,0,0,0.05)",
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={expandedSections.has(sectionId) ? "Collapse section" : "Expand section"}
                  >
                    <motion.div
                      animate={{ rotate: expandedSections.has(sectionId) ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </motion.button>
                </div>
                
                {/* Clauses/Variants with active indicator and better padding */}
                <AnimatePresence>
                  {expandedSections.has(sectionId) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pr-2 py-2 space-y-1">
                        {isPlaybookSection(section) ? (
                          // New format - Render variants
                          section.variants.map((variant, index) => (
                            <div 
                              key={`${sectionId}-variant-${index}`}
                              className={cn(
                                "relative",
                                activeClause === `${sectionId}-variant-${index}` && "relative"
                              )}
                            >
                              {activeClause === `${sectionId}-variant-${index}` && (
                                <motion.div
                                  className="absolute left-0 top-1/2 -translate-x-1/2 transform"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="h-2 w-2 rounded-full bg-primary" />
                                </motion.div>
                              )}
                              
                              <motion.button
                                onClick={() => onClauseClick && onClauseClick(sectionId, `variant-${index}`)}
                                className={cn(
                                  "w-full rounded-md px-4 py-1.5 text-left text-xs",
                                  "transition-colors truncate",
                                  activeClause === `${sectionId}-variant-${index}`
                                    ? "bg-accent/80 text-primary-foreground font-medium pl-5"
                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                )}
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {variant.favorability}
                              </motion.button>
                            </div>
                          ))
                        ) : (
                          // Legacy format - Render clauses
                          section.clauses.map((clause) => (
                            <div 
                              key={clause.id}
                              className={cn(
                                "relative",
                                activeClause === clause.id && "relative"
                              )}
                            >
                              {activeClause === clause.id && (
                                <motion.div
                                  className="absolute left-0 top-1/2 -translate-x-1/2 transform"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="h-2 w-2 rounded-full bg-primary" />
                                </motion.div>
                              )}
                              
                              <motion.button
                                onClick={() => onClauseClick && onClauseClick(sectionId, clause.id)}
                                className={cn(
                                  "w-full rounded-md px-4 py-1.5 text-left text-xs",
                                  "transition-colors truncate",
                                  activeClause === clause.id
                                    ? "bg-accent/80 text-primary-foreground font-medium pl-5"
                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                )}
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {clause.title}
                              </motion.button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
