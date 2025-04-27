'use client'

import { NavigationSidebar } from "./NavigationSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import React, { useState } from "react"
import { PlaybookSearch } from "@/components/playbook/PlaybookSearch"
import { usePlaybookSearch } from "@/hooks/usePlaybookSearch"
import { samplePlaybook } from "@/data/samplePlaybook"
import { ContractSection } from "@/types/playbook"

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  mode?: 'app' | 'tree';
  navItems?: Array<{ title: string; href: string; icon?: React.ElementType; label?: string }>;
  treeItems?: Array<{ id: string; title: string; children?: Array<{ id: string; title: string }> }>;
  activeItem?: string;
  activeChild?: string;
  onItemClick?: (id: string) => void;
  onChildClick?: (parentId: string, childId: string) => void;
  onSearchSelect?: (result: any) => void;
}

export function AppLayout({ 
  children,
  title = "Partner³",
  mode = 'app',
  navItems,
  treeItems,
  activeItem,
  activeChild,
  onItemClick,
  onChildClick,
  onSearchSelect
}: AppLayoutProps) {
  const [search, setSearch] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  
  // Initialize search hook with the playbook data
  const { results: searchResults } = usePlaybookSearch(samplePlaybook, search)

  // Handle search selection - default implementation
  const handleSearchSelect = (result: any) => {
    if (onSearchSelect) {
      onSearchSelect(result)
    } else {
      // Default behavior - could be navigation or similar
      console.log("Search result selected:", result)
      setSearchOpen(false)
    }
  }

  // Convert playbook sections to tree items if in tree mode and no treeItems provided
  const convertedTreeItems = React.useMemo(() => {
    if (mode === 'tree' && !treeItems && Array.isArray(samplePlaybook)) {
      return samplePlaybook.map((section: ContractSection) => ({
        id: section.id,
        title: section.title,
        children: section.clauses?.map(clause => ({
          id: clause.id,
          title: clause.title
        }))
      }));
    }
    return treeItems;
  }, [mode, treeItems]);

  return (
    <SidebarProvider>
      <NavigationSidebar 
        title={title}
        mode={mode}
        navItems={navItems}
        treeItems={convertedTreeItems}
        activeItem={activeItem}
        activeChild={activeChild}
        onItemClick={onItemClick}
        onChildClick={onChildClick}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center border-b px-4">
          <SidebarTrigger />
          
          {/* Center the search using PlaybookSearch */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md">
              <PlaybookSearch
                search={search}
                searchOpen={searchOpen}
                searchResults={searchResults}
                setSearch={setSearch}
                setSearchOpen={setSearchOpen}
                onSearchSelect={handleSearchSelect}
              />
            </div>
          </div>
          
          {/* Adding a spacer div for symmetry */}
          <div className="w-10"></div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
