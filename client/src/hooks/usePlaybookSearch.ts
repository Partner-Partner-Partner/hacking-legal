import { useState, useMemo } from 'react';
import { ContractSection } from '@/types/playbook';

export interface SearchResult {
  type: "section" | "clause";
  section: ContractSection;
  clause?: any;
  matchContext?: string;
  matchSource?: string;
}

interface UsePlaybookSearchProps {
  onSearchSelect: (item: SearchResult) => void;
}

export function usePlaybookSearch({ onSearchSelect }: UsePlaybookSearchProps) {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState("");

  const searchResults = useMemo<SearchResult[]>(() => [], []);

  const handleSearchSelect = (item: SearchResult) => {
    onSearchSelect(item);
    setActiveSearchQuery(search);
    setTimeout(() => {
      setSearch("");
      setSearchOpen(false);
    }, 100);
  };

  return {
    search,
    setSearch,
    searchOpen,
    setSearchOpen,
    searchResults,
    activeSearchQuery,
    setActiveSearchQuery,
    handleSearchSelect,
  };
}
