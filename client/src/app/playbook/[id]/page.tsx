"use client";
import { samplePlaybook } from "@/data/samplePlaybook";
import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { motion } from "framer-motion";
import { PlaybookSearch } from "@/components/playbook/PlaybookSearch";
import { PlaybookSectionList } from "@/components/playbook/PlaybookSectionList";
import { usePlaybookNavigation } from '@/hooks/usePlaybookNavigation';
import { usePlaybookSearch, SearchResult } from '@/hooks/usePlaybookSearch';
import { ContractSection, PlaybookSection } from "@/types/playbook";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

// Helper function to get section identifier
const getSectionId = (section: any): string => {
  return section.title || section.id || '';
};

// Helper to check if a section has variants
const hasVariants = (section: any): boolean => {
  return 'variants' in section && Array.isArray(section.variants);
};

// Internal content component that uses the useSidebar hook
function PlaybookContent() {
  const sidebar = useSidebar();
  
  // Navigation state
  const { 
    activeSection, 
    activeClause, 
    openSections, 
    setOpenSections,
    handleSectionClick,
    handleClauseClick,
    contentRef,
  } = usePlaybookNavigation(samplePlaybook);

  // Search state and handlers
  const {
    search,
    setSearch,
    searchOpen,
    setSearchOpen,
    searchResults,
    activeSearchQuery,
    setActiveSearchQuery,
    handleSearchSelect,
  } = usePlaybookSearch({
    onSearchSelect: (item: SearchResult) => {
      if (item.type === "section") {
        handleSectionClick(getSectionId(item.section));
      } else if (item.type === "variant" && item.variant) {
        const sectionId = getSectionId(item.section);
        // Safely access variants with type checking
        if (hasVariants(item.section)) {
          const variantIndex = (item.section as any).variants.indexOf(item.variant);
          if (variantIndex >= 0) {
            const variantId = `variant-${variantIndex}`;
            handleClauseClick(sectionId, variantId);
          }
        }
      } else if (item.type === "clause" && "clause" in item) {
        // Handle legacy format with clause
        const legacyItem = item as any;
        handleClauseClick(getSectionId(item.section), legacyItem.clause.id);
      }
    },
    playbook: samplePlaybook as any // Allow cast for transition period
  });

  return (
    <>
      <PlaybookSidebar
        sections={samplePlaybook} // Remove explicit cast
        activeSection={activeSection}
        activeClause={activeClause}
        onSectionClick={handleSectionClick}
        onClauseClick={handleClauseClick}
      />
      <SidebarInset>
        <motion.div 
          className="flex-1 overflow-y-auto scroll-smooth px-8 pt-6 pb-10" 
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Legal Contract Playbook</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              {/* Add search component with adapted search results */}
              <PlaybookSearch
                search={search}
                setSearch={setSearch}
                searchOpen={searchOpen}
                setSearchOpen={setSearchOpen}
                searchResults={searchResults as any} // Use type assertion for transition
                onSearchSelect={handleSearchSelect}
              />
            </div>
            
            {/* Main content with sections */}
            <PlaybookSectionList
              sections={samplePlaybook as any} // Use any type for transition
              openSections={openSections}
              setOpenSections={setOpenSections}
              activeSearchQuery={activeSearchQuery}
            />
          </div>
        </motion.div>
      </SidebarInset>
    </>
  );
}

export default function PlaybookPage() {
  return (
    <SidebarProvider>
      <PlaybookContent />
    </SidebarProvider>
  );
}
