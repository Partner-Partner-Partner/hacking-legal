'use client'

import React, { useEffect, useState } from "react"; // Import useState
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen, LayoutDashboard, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Type definitions
interface NavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
  label?: string;
}

interface TreeNavItem {
  id: string;
  title: string;
  children?: { id: string; title: string }[];
}

type NavigationMode = 'app' | 'tree';

interface NavigationSidebarProps {
  title?: string;
  mode?: NavigationMode;
  navItems?: NavItem[];
  treeItems?: TreeNavItem[];
  activeItem?: string;
  activeChild?: string;
  onItemClick?: (id: string) => void;
  onChildClick?: (parentId: string, childId: string) => void;
}

// Default navigation items for app navigation
const defaultNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Compare",
    href: "/compare",
    icon: FileText
  },
  {
    title: "Playbook",
    href: "/playbook",
    icon: BookOpen
  },
];

export function NavigationSidebar({
  title = "Partner³",
  mode = 'app',
  navItems = defaultNavItems,
  treeItems = [],
  activeItem = '', // Received from page component
  activeChild = '', // Received from page component
  onItemClick = () => {},
  onChildClick = () => {},
}: NavigationSidebarProps) {
  const pathname = usePathname();
  
  // Add activeItems state
  const [activeItems, setActiveItems] = useState<{
    section: string;
    clause: string;
  }>({
    section: activeItem,
    clause: activeChild
  });

  // Initialize expanded items based on activeItem or activeChild's parent
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const initialExpanded = new Set<string>();
    if (activeItem) {
      initialExpanded.add(activeItem);
    } else if (activeChild) {
      const parent = treeItems.find(item => item.children?.some(child => child.id === activeChild));
      if (parent) {
        initialExpanded.add(parent.id);
      }
    }
    // Optionally expand the first item if nothing else is active
    else if (mode === 'tree' && treeItems.length > 0) {
       initialExpanded.add(treeItems[0].id);
    }
    return initialExpanded;
  });

  // Effect to expand section when activeItem or activeChild changes
  useEffect(() => {
    setActiveItems({
      section: activeItem,
      clause: activeChild
    });
    
    if (mode === 'tree') {
      if (activeItem && !expandedItems.has(activeItem)) {
        setExpandedItems(prev => new Set([...prev, activeItem]));
      }
      if (activeChild) {
        const parentSection = treeItems.find(item => 
          item.children?.some(child => child.id === activeChild)
        );
        if (parentSection && !expandedItems.has(parentSection.id)) {
          setExpandedItems(prev => new Set([...prev, parentSection.id]));
        }
      }
    }
  }, [activeItem, activeChild, mode, treeItems, expandedItems]);

  const toggleItem = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering parent click
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Handle section click with immediate visual feedback and scroll
  const handleSectionClick = (id: string) => {
    // Visual feedback first (optimistic UI update)
    setActiveItems(prev => ({
      section: id,
      clause: ''
    }));
    
    // Expand the section if it's not already expanded
    if (!expandedItems.has(id)) {
      setExpandedItems(prev => new Set([...prev, id]));
    }
    
    // Trigger the callback to handle scrolling
    onItemClick(id);
  };
  
  // Handle clause click with immediate feedback and scroll
  const handleClauseClick = (parentId: string, childId: string) => {
    // Visual feedback first
    setActiveItems({
      section: parentId,
      clause: childId
    });
    
    // Make sure parent is expanded
    if (!expandedItems.has(parentId)) {
      setExpandedItems(prev => new Set([...prev, parentId]));
    }
    
    // Trigger the callback to handle scrolling
    onChildClick(parentId, childId);
  };
  
  return (
    <Sidebar>
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center gap-3 border-b px-6">
          <h2 className="font-semibold">{title}</h2>
        </div>
        
        {mode === 'app' ? (
          // App navigation mode - simple list of links
          <div className="flex-1 overflow-auto py-2 px-4">
            <div className="grid gap-1">
              {navItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <Button 
                    variant={pathname === item.href ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.title}
                    {item.label && (
                      <span className="ml-auto bg-primary/20 text-primary rounded-sm px-1.5 text-xs">
                        {item.label}
                      </span>
                    )}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          // Tree navigation mode
          <div className="flex-1 overflow-hidden py-2 px-4"> {/* Use flex-1 and overflow-hidden */}
            <ScrollArea className="h-full"> {/* Make ScrollArea take full height */}
              <div className="space-y-1"> {/* Use space-y for consistent spacing */}
                {treeItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="" // Remove mb-2, use space-y on parent
                    layout // Add layout animation
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Parent item header */}
                    <div 
                      className={cn(
                        "flex items-center justify-between py-2 px-3 rounded-md", // Adjusted padding
                        "cursor-pointer transition-colors group", // Add group for hover states
                        activeItems.section === item.id && !activeItems.clause // Highlight only if section itself is active (no child active)
                          ? "bg-accent text-accent-foreground font-medium" 
                          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => handleSectionClick(item.id)} // Click anywhere on the row triggers section click
                    >
                      <span // Changed button to span for semantics, click handled by div
                        className="flex-1 text-sm truncate font-medium group-hover:text-foreground" // Ensure text color changes on hover
                        title={item.title} // Add title for long text
                      >
                        {item.title}
                      </span>
                      {item.children && item.children.length > 0 && (
                        <motion.button 
                          onClick={(e) => toggleItem(item.id, e)}
                          className={cn(
                            "h-6 w-6 rounded-sm flex items-center justify-center text-muted-foreground group-hover:text-foreground",
                            "hover:bg-muted/50 z-10" // Ensure button is clickable over text
                          )}
                          whileTap={{ scale: 0.9 }}
                          aria-label={expandedItems.has(item.id) ? "Collapse section" : "Expand section"}
                          transition={{ duration: 0.1 }}
                        >
                          <motion.div
                            animate={{ rotate: expandedItems.has(item.id) ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </motion.div>
                        </motion.button>
                      )}
                    </div>
                    
                    {/* Child items with animation */}
                    <AnimatePresence initial={false}> {/* Disable initial animation for children */}
                      {expandedItems.has(item.id) && item.children && (
                        <motion.div
                          key={`children-${item.id}`} // Add key for AnimatePresence
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden ml-3 border-l border-dashed border-border pl-3" // Indentation and visual guide
                        >
                          <div className="py-1 space-y-1">
                            {item.children.map((child) => (
                              <motion.button
                                key={child.id}
                                layout // Add layout animation
                                onClick={() => handleClauseClick(item.id, child.id)}
                                className={cn(
                                  "w-full rounded-md px-3 py-1.5 text-left text-sm", // Adjusted padding
                                  "transition-colors truncate",
                                  activeItems.clause === child.id // Highlight based on activeChild prop
                                    ? "bg-accent text-accent-foreground font-medium"
                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                )}
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.1 }}
                                title={child.title} // Add title for long text
                              >
                                {child.title}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </Sidebar>
  );
}