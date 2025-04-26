import React from 'react';
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ContractSection } from '@/types/playbook';
import { PlaybookContent } from './PlaybookContent';

interface PlaybookSectionListProps {
  sections: ContractSection[];
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
      {sections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
        >
          <AccordionItem 
            value={section.id}
            className="border rounded-xl overflow-hidden shadow-sm bg-card"
          >
            <AccordionTrigger className="px-8 py-5 hover:no-underline data-[state=open]:bg-accent/20">
              <h2 className="text-xl font-semibold text-left">{section.title}</h2>
            </AccordionTrigger>
            
            <AccordionContent className="px-8 py-6">
              <div id={`section-${section.id}`} className="space-y-8">
                <p className="text-muted-foreground leading-relaxed">{section.description}</p>
                <PlaybookContent 
                  sections={[section]} 
                  showSectionHeaders={false}
                  searchQuery={activeSearchQuery}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  );
}
