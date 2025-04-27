import React, { useState, useEffect } from 'react';
import { PlaybookSection, PlaybookVariant, ContractClause, ContractSection, Favorability } from '@/types/playbook';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Support both new and legacy formats
type SectionType = PlaybookSection | ContractSection;

// Helper to check if a section is the new PlaybookSection type
const isPlaybookSection = (section: any): section is PlaybookSection => {
  return 'variants' in section;
};

interface PlaybookContentProps {
  sections: SectionType[];
  showSectionHeaders?: boolean;
  searchQuery?: string;
}

// Simplified highlight text utility - more minimal approach
const HighlightText = ({ text, searchQuery }: { text: string; searchQuery?: string }) => {
  if (!searchQuery || !text) return <p className="leading-relaxed">{text}</p>;
  
  try {
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    if (parts.length === 1) return <p className="leading-relaxed">{text}</p>;
    
    return (
      <p className="leading-relaxed">
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-100 text-inherit border-b border-yellow-400 search-highlight">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </p>
    );
  } catch (e) {
    return <p className="leading-relaxed">{text}</p>;
  }
};

// Create a component adapter to render both formats
const SectionContent: React.FC<{section: SectionType, searchQuery?: string}> = ({section, searchQuery}) => {
  if (isPlaybookSection(section)) {
    return <PlaybookSectionVariants section={section} searchQuery={searchQuery} />;
  } else {
    return <LegacyClausesList section={section} searchQuery={searchQuery} />;
  }
};

// Legacy clauses display component
const LegacyClausesList: React.FC<{section: ContractSection, searchQuery?: string}> = ({
  section,
  searchQuery
}) => {
  return (
    <div className="space-y-12 divide-y divide-border">
      {section.clauses?.map((clause, index) => (
        <div key={clause.id} className={index > 0 ? "pt-10" : ""}>
          <ClauseViewer 
            clause={clause} 
            searchQuery={searchQuery}
          />
        </div>
      ))}
    </div>
  );
};

// Implementation of the missing ClauseViewer component
interface ClauseViewerProps {
  clause: ContractClause;
  searchQuery?: string;
}

const ClauseViewer: React.FC<ClauseViewerProps> = ({ clause, searchQuery }) => {
  const [activeTab, setActiveTab] = useState("mostFavorable");
  
  // Auto-switch to tab with search match
  useEffect(() => {
    if (!searchQuery) return;
    
    const query = searchQuery.toLowerCase();
    const tabsToCheck = ["mostFavorable", "balanced", "acceptable", "unacceptable"];
    
    for (const tab of tabsToCheck) {
      const text = clause[tab as keyof typeof clause] as string;
      if (text && text.toLowerCase().includes(query)) {
        setActiveTab(tab);
        break;
      }
    }
  }, [searchQuery, clause]);
  
  // Map tab values to their corresponding styles
  const tabStyles = {
    mostFavorable: {
      border: "border-green-400",
      background: "bg-green-50",
      text: "text-green-800",
    },
    balanced: {
      border: "border-blue-400",
      background: "bg-blue-50",
      text: "text-blue-800",
    },
    acceptable: {
      border: "border-amber-400",
      background: "bg-amber-50",
      text: "text-amber-800",
    },
    unacceptable: {
      border: "border-red-400",
      background: "bg-red-50",
      text: "text-red-800",
    },
  };
  
  // Helper to safely get argument text
  const getArgumentText = (argObj: any): { external: string, internal: string } | null => {
    if (!argObj) return null;
    
    // If it's a string (legacy format), return it as external only
    if (typeof argObj === 'string') return { external: argObj, internal: '' };
    
    // Otherwise return the structured object
    return { external: argObj.external, internal: argObj.internal };
  };
  
  return (
    <div id={`clause-${clause.id}`} className="mb-10">
      <h3 className="text-lg font-semibold mb-5 text-foreground">
        {searchQuery ? (
          <HighlightText text={clause.title} searchQuery={searchQuery} />
        ) : (
          clause.title
        )}
      </h3>
      <Tabs defaultValue="mostFavorable" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-5 bg-transparent w-full justify-start gap-2 px-1">
          <TabsTrigger 
            value="mostFavorable" 
            className={cn("data-[state=active]:text-green-800 data-[state=active]:bg-green-100", 
            "rounded-md border-2 border-transparent data-[state=active]:border-green-400")}
          >
            Most Favorable
          </TabsTrigger>
          <TabsTrigger 
            value="balanced" 
            className={cn("data-[state=active]:text-blue-800 data-[state=active]:bg-blue-100", 
            "rounded-md border-2 border-transparent data-[state=active]:border-blue-400")}
          >
            Balanced
          </TabsTrigger>
          <TabsTrigger 
            value="acceptable" 
            className={cn("data-[state=active]:text-amber-800 data-[state=active]:bg-amber-100", 
            "rounded-md border-2 border-transparent data-[state=active]:border-amber-400")}
          >
            Acceptable
          </TabsTrigger>
          <TabsTrigger 
            value="unacceptable" 
            className={cn("data-[state=active]:text-red-800 data-[state=active]:bg-red-100", 
            "rounded-md border-2 border-transparent data-[state=active]:border-red-400")}
          >
            Unacceptable
          </TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "rounded-lg p-6",
              tabStyles[activeTab as keyof typeof tabStyles].background
            )}
          >
            <div className={cn(
              "pl-5 border-l-4",
              tabStyles[activeTab as keyof typeof tabStyles].border
            )}>
              <HighlightText 
                text={clause[activeTab as keyof ContractClause] as string} 
                searchQuery={searchQuery}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

// New playbook variants display component
const PlaybookSectionVariants: React.FC<{section: PlaybookSection, searchQuery?: string}> = ({
  section,
  searchQuery
}) => {
  return (
    <div className="space-y-12 divide-y divide-border">
      <SectionVariants section={section} searchQuery={searchQuery} />
    </div>
  );
};

interface SectionVariantsProps {
  section: PlaybookSection;
  searchQuery?: string;
}

const SectionVariants: React.FC<SectionVariantsProps> = ({ section, searchQuery }) => {
  const [activeTab, setActiveTab] = useState<Favorability>("Most Favorable");
  
  // Auto-switch to tab with search match
  useEffect(() => {
    if (!searchQuery) return;
    
    const query = searchQuery.toLowerCase();
    const variantWithMatch = section.variants.find(variant => 
      variant.text.toLowerCase().includes(query)
    );
    
    if (variantWithMatch) {
      setActiveTab(variantWithMatch.favorability as Favorability);
    }
  }, [searchQuery, section]);
  
  // Map tab values to their corresponding styles
  const tabStyles: Record<string, { border: string; background: string; text: string }> = {
    "Most Favorable": {
      border: "border-green-400",
      background: "bg-green-50",
      text: "text-green-800",
    },
    "Balanced": {
      border: "border-blue-400",
      background: "bg-blue-50",
      text: "text-blue-800",
    },
    "Acceptable": {
      border: "border-amber-400",
      background: "bg-amber-50",
      text: "text-amber-800",
    },
    "Unacceptable": {
      border: "border-red-400",
      background: "bg-red-50",
      text: "text-red-800",
    },
  };
  
  // Get current variant by favorability
  const currentVariant = section.variants.find(v => v.favorability === activeTab);
  
  return (
    <div id={`section-variant-${section.title}`} className="mb-10">
      <h3 className="text-lg font-semibold mb-5 text-foreground">
        {searchQuery ? (
          <HighlightText text={section.title} searchQuery={searchQuery} />
        ) : (
          section.title
        )}
      </h3>
      <Tabs defaultValue="Most Favorable" value={activeTab} onValueChange={(val) => setActiveTab(val as Favorability)}>
        <TabsList className="mb-5 bg-transparent w-full justify-start gap-2 px-1">
          {section.variants.map(variant => (
            <TabsTrigger 
              key={variant.favorability}
              value={variant.favorability} 
              className={cn(
                `data-[state=active]:${tabStyles[variant.favorability].text} data-[state=active]:${tabStyles[variant.favorability].background}`, 
                "rounded-md border-2 border-transparent", 
                `data-[state=active]:${tabStyles[variant.favorability].border}`
              )}
            >
              {variant.favorability}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <AnimatePresence mode="wait">
          {currentVariant && (
            <motion.div
              key={currentVariant.favorability}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "rounded-lg p-6",
                tabStyles[currentVariant.favorability].background
              )}
            >
              <div className={cn(
                "pl-5 border-l-4",
                tabStyles[currentVariant.favorability].border
              )}>
                <HighlightText 
                  text={currentVariant.text} 
                  searchQuery={searchQuery}
                />
              </div>
              
              {/* Justification section */}
              {currentVariant.justification && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 pt-6 border-t border-border/50"
                >
                  <h4 className="font-medium text-foreground mb-5 px-1">Justification</h4>
                  <div className="px-4 py-3 bg-muted/40 rounded-md">
                    <HighlightText 
                      text={currentVariant.justification} 
                      searchQuery={searchQuery}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

interface SectionViewerProps {
  section: SectionType;
  showHeader?: boolean;
  searchQuery?: string;
}

const SectionViewer: React.FC<SectionViewerProps> = ({ 
  section, 
  showHeader = true, 
  searchQuery 
}) => {
  const sectionId = isPlaybookSection(section) ? section.title : section.id;
  
  return (
    <div id={`section-${sectionId}`} className="space-y-10">
      {showHeader && (
        <div className="mb-8 px-1">
          <h2 className="text-2xl font-bold mb-3">
            {searchQuery ? (
              <HighlightText text={section.title} searchQuery={searchQuery} />
            ) : (
              section.title
            )}
          </h2>
          {!isPlaybookSection(section) && section.description && (
            <div className="text-muted-foreground">
              <HighlightText text={section.description} searchQuery={searchQuery} />
            </div>
          )}
        </div>
      )}
      
      <SectionContent section={section} searchQuery={searchQuery} />
    </div>
  );
};

export function PlaybookContent({ 
  sections, 
  showSectionHeaders = true, 
  searchQuery 
}: PlaybookContentProps) {
  if (!sections || sections.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No playbook sections available to display
      </div>
    );
  }

  return (
    <div className="playbook-content">
      {sections.map((section) => (
        <SectionViewer 
          key={isPlaybookSection(section) ? section.title : section.id} 
          section={section} 
          showHeader={showSectionHeaders && sections.length > 1}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}
