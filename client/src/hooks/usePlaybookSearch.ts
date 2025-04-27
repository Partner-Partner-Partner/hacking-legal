import { useState, useEffect, useCallback } from "react";
import { PlaybookSection, PlaybookVariant, ContractSection, ContractClause } from "@/types/playbook";

// Support both new and legacy formats
type SectionType = PlaybookSection | ContractSection;

// Helper to check if a section is the new PlaybookSection type
const isPlaybookSection = (section: any): section is PlaybookSection => {
  return 'variants' in section;
};

// Combined SearchResult type to support both formats
export interface SearchResult {
  type: "section" | "variant" | "clause";
  section: SectionType;
  variant?: PlaybookVariant;
  clause?: ContractClause;
  matchContext?: string;
}

interface UsePlaybookSearchProps {
  onSearchSelect?: (item: SearchResult) => void;
  playbook?: SectionType[];
}

export const usePlaybookSearch = ({ onSearchSelect, playbook = [] }: UsePlaybookSearchProps = {}) => {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeSearchQuery, setActiveSearchQuery] = useState<string | undefined>();

  // Extract context for search results
  const getMatchContext = (text: string, query: string): string => {
    if (!text || !query) return "";
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    
    if (index === -1) return text.slice(0, 100) + "...";
    
    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + query.length + 30);
    
    return (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");
  };

  // Search functionality
  useEffect(() => {
    if (!search.trim() || !playbook) {
      setSearchResults([]);
      return;
    }
    
    const query = search.toLowerCase();
    const results: SearchResult[] = [];
    
    playbook.forEach(section => {
      // Search in section title
      if (section.title.toLowerCase().includes(query)) {
        results.push({
          type: "section",
          section,
          matchContext: section.title
        });
      }
      
      // Handle both PlaybookSection and ContractSection formats
      if (isPlaybookSection(section)) {
        // New format - search in variants
        section.variants.forEach(variant => {
          if (
            variant.text.toLowerCase().includes(query) || 
            variant.justification?.toLowerCase().includes(query)
          ) {
            results.push({
              type: "variant",
              section,
              variant,
              matchContext: getMatchContext(
                variant.text.includes(query) ? variant.text : variant.justification,
                search
              )
            });
          }
        });
      } else if ('clauses' in section) {
        // Legacy format - search in clauses
        section.clauses.forEach(clause => {
          const clauseText = [
            clause.mostFavorable,
            clause.balanced,
            clause.acceptable,
            clause.unacceptable,
            clause.text
          ].join(' ');

          if (clauseText.toLowerCase().includes(query) || clause.title.toLowerCase().includes(query)) {
            results.push({
              type: "clause",
              section,
              clause,
              matchContext: getMatchContext(clause.title + ': ' + clauseText, search)
            });
          }
        });
      }
    });
    
    setSearchResults(results);
  }, [search, playbook]);

  // Handle search selection
  const handleSearchSelect = useCallback((item: SearchResult) => {
    setActiveSearchQuery(search);
    setSearchOpen(false);
    if (onSearchSelect) {
      onSearchSelect(item);
    }
  }, [search, onSearchSelect]);

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const input = document.getElementById("playbook-search-input");
        if (input) (input as HTMLInputElement).focus();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    search,
    setSearch,
    searchOpen,
    setSearchOpen,
    searchResults,
    activeSearchQuery,
    setActiveSearchQuery,
    handleSearchSelect
  };
};
