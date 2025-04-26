import React, { useState, useEffect } from 'react';
import { ContractClause, ContractSection } from '../../types/playbook';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PlaybookContentProps {
  sections: ContractSection[];
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

const ClauseViewer = ({ clause, searchQuery }: { clause: ContractClause; searchQuery?: string }) => {
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
      
      {clause.arguments && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 pt-6 border-t border-border/50"
        >
          <h4 className="font-medium text-foreground mb-5 px-1">Negotiation Arguments</h4>
          
          <div className="space-y-5 px-1">
            {clause.arguments.toMostFavorable && (
              <motion.div 
                className="flex flex-col lg:flex-row gap-4"
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="lg:w-32 shrink-0">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Most Favorable
                  </span>
                </div>
                <div className="flex-1 rounded-lg py-4 px-5 bg-green-50/50">
                  <HighlightText 
                    text={clause.arguments.toMostFavorable} 
                    searchQuery={searchQuery}
                  />
                </div>
              </motion.div>
            )}
            
            {clause.arguments.toBalanced && (
              <motion.div 
                className="flex flex-col lg:flex-row gap-4"
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="lg:w-32 shrink-0">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    Balanced
                  </span>
                </div>
                <div className="flex-1 rounded-lg py-4 px-5 bg-blue-50/50">
                  <HighlightText 
                    text={clause.arguments.toBalanced} 
                    searchQuery={searchQuery}
                  />
                </div>
              </motion.div>
            )}
            
            {clause.arguments.fromUnacceptable && (
              <motion.div 
                className="flex flex-col lg:flex-row gap-4"
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="lg:w-32 shrink-0">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    From Unacceptable
                  </span>
                </div>
                <div className="flex-1 rounded-lg py-4 px-5 bg-red-50/50">
                  <HighlightText 
                    text={clause.arguments.fromUnacceptable}
                    searchQuery={searchQuery}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const SectionViewer = ({ section, showHeader = true, searchQuery }: { 
  section: ContractSection; 
  showHeader?: boolean;
  searchQuery?: string;
}) => {
  return (
    <div id={`section-${section.id}`} className="space-y-10">
      {showHeader && (
        <div className="mb-8 px-1">
          <h2 className="text-2xl font-bold mb-3">
            {searchQuery ? (
              <HighlightText text={section.title} searchQuery={searchQuery} />
            ) : (
              section.title
            )}
          </h2>
          <div className="text-muted-foreground">
            <HighlightText text={section.description} searchQuery={searchQuery} />
          </div>
        </div>
      )}
      
      <div className="space-y-12 divide-y divide-border">
        {section.clauses?.map((clause, index) => (
          <div key={clause.id} className={index > 0 ? "pt-10" : ""}>
            <ClauseViewer clause={clause} searchQuery={searchQuery} />
          </div>
        ))}
      </div>
    </div>
  );
};

export function PlaybookContent({ sections, showSectionHeaders = true, searchQuery }: PlaybookContentProps) {
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
          key={section.id} 
          section={section} 
          showHeader={showSectionHeaders && sections.length > 1}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}
