"use client";
import { samplePlaybook } from "@/data/samplePlaybook";
import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { PlaybookSearch } from "@/components/playbook/PlaybookSearch";
import { PlaybookSectionList } from "@/components/playbook/PlaybookSectionList";
import { usePlaybookNavigation } from '@/hooks/usePlaybookNavigation';
import { usePlaybookSearch } from '@/hooks/usePlaybookSearch';

export default function PlaybookPage() {
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
    <div className="flex h-screen bg-background">
      <PlaybookSidebar
        sections={samplePlaybook}
        activeSection={activeSection}
        activeClause={activeClause}
        onSectionClick={handleSectionClick}
        onClauseClick={handleClauseClick}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <motion.div 
          className="flex-1 overflow-y-auto scroll-smooth px-8 pt-6 pb-10" 
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-3xl mx-auto">
            {/* Top section with title and search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <motion.h1 
                className="text-2xl font-bold text-foreground"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                Legal Contract Playbook
              </motion.h1>
              
              <PlaybookSearch
                search={search}
                searchOpen={searchOpen}
                searchResults={searchResults}
                setSearch={setSearch}
                setSearchOpen={setSearchOpen}
                onSearchSelect={handleSearchSelect}
              />
            </div>
            
            {/* Search results indicator */}
            {activeSearchQuery && (
              <div className="mb-6 px-3 py-2 text-sm border-l-4 border-yellow-400 bg-yellow-50 flex items-center justify-between">
                <span>Results for "{activeSearchQuery}"</span>
                <button 
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  onClick={() => setActiveSearchQuery("")}
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              </div>
            )}
            
            {/* Main content with sections */}
            <PlaybookSectionList
              sections={samplePlaybook}
              openSections={openSections}
              setOpenSections={setOpenSections}
              activeSearchQuery={activeSearchQuery}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
