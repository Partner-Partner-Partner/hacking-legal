"use client";
import { samplePlaybook } from "@/data/samplePlaybook";
import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { PlaybookSearch } from "@/components/playbook/PlaybookSearch";
import { PlaybookSectionList } from "@/components/playbook/PlaybookSectionList";
import { usePlaybookNavigation } from '@/hooks/usePlaybookNavigation';
import { usePlaybookSearch } from '@/hooks/usePlaybookSearch';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

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
    onSearchSelect: (item) => {
      if (item.type === "section") {
        handleSectionClick(item.section.id);
      } else if (item.type === "clause" && item.clause) {
        handleClauseClick(item.section.id, item.clause.id);
      }
    }
  });

  return (
    <>
      <PlaybookSidebar
        sections={samplePlaybook}
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
            <div className="flex items-center mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Legal Contract Playbook</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            {/* Main content with sections */}
            <PlaybookSectionList
              sections={samplePlaybook}
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
