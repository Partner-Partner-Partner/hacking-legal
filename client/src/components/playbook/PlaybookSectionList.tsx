import React from 'react';
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { PlaybookSection, ContractSection } from '@/types/playbook';
import { PlaybookContent } from './PlaybookContent';

// Support both new and legacy formats
type SectionType = PlaybookSection | ContractSection;

// Helper to check if a section is the new PlaybookSection type
const isPlaybookSection = (section: any): section is PlaybookSection => {
  return 'variants' in section;
};

// Get a unique ID for the section
const getSectionId = (section: SectionType): string => {
  return isPlaybookSection(section) ? section.title : section.id;
};

interface PlaybookSectionListProps {
  sections: SectionType[];
  openSections: string[];
  setOpenSections: (sections: string[]) => void;
  activeSearchQuery?: string;
}

export function PlaybookSectionList({
  sections,
  openSections,
  setOpenSections,
  activeSearchQuery,
}: PlaybookSectionListProps) {
  return (
    <Accordion 
      type="multiple" 
      className="space-y-6" 
      value={openSections}
      onValueChange={setOpenSections}
    >
      {sections.map((section, index) => {
        const sectionId = getSectionId(section);
        
        return (
          <motion.div
            key={sectionId}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
          >
            <AccordionItem 
              value={sectionId}
              className="border rounded-xl overflow-hidden shadow-sm bg-card"
            >
              <AccordionTrigger className="px-8 py-5 hover:no-underline data-[state=open]:bg-accent/20">
                <h2 className="text-xl font-semibold text-left">{section.title}</h2>
              </AccordionTrigger>
              
              <AccordionContent className="px-8 py-6">
                <div id={`section-${sectionId}`} className="space-y-8">
                  {!isPlaybookSection(section) && "description" in section && (
                    <p className="text-muted-foreground leading-relaxed">{section.description}</p>
                  )}
                  <PlaybookContent 
                    sections={[section] as any} // Type assertion to handle both formats
                    showSectionHeaders={false}
                    searchQuery={activeSearchQuery}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        );
      })}
    </Accordion>
  );
}
