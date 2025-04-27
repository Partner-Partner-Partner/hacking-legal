'use client';

import React, { useState, useEffect, useRef, RefObject } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
// You need to install diff: npm install diff
// And types: npm install --save-dev @types/diff
import * as Diff from 'diff';
import { useSyncScroll } from '@/hooks/useSyncScroll';

interface DiffSegment {
  text: string;
  type: 'insert' | 'delete' | 'equal';
  id: string;
}

// Define the diff interface to fix the 'any' type issue
interface DiffChange {
  value: string;
  added?: boolean;
  removed?: boolean;
}

interface DualPaneDiffProps {
  leftText: string;
  rightText: string;
  leftTitle?: string;
  rightTitle?: string;
}

/**
 * DiffSegmentItem - Renders a single diff segment with appropriate styling
 */
const DiffSegmentItem = React.memo(({ segment }: { segment: DiffSegment }) => {
  if (segment.type === 'insert') {
    return (
      <ins className="bg-success/20 text-success underline px-0.5 rounded-sm">
        {segment.text}
      </ins>
    );
  }

  if (segment.type === 'delete') {
    return (
      <del className="bg-destructive/20 text-destructive line-through px-0.5 rounded-sm">
        {segment.text}
      </del>
    );
  }

  return <span>{segment.text}</span>;
});

DiffSegmentItem.displayName = 'DiffSegmentItem';

/**
 * DualPaneDiff - Component that shows a side-by-side diff comparison
 */
export const DualPaneDiff = ({
  leftText,
  rightText,
  leftTitle = 'Current Version',
  rightTitle = 'Ideal Version',
}: DualPaneDiffProps) => {
  const [leftSegments, setLeftSegments] = useState<DiffSegment[]>([]);
  const [rightSegments, setRightSegments] = useState<DiffSegment[]>([]);

  const leftRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const rightRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  // Use our custom hook for synced scrolling
  useSyncScroll(leftRef, rightRef);

  // Compute diffs when texts change
  useEffect(() => {
    const diffs = Diff.diffWords(leftText, rightText);
    
    const leftSegs: DiffSegment[] = [];
    const rightSegs: DiffSegment[] = [];
    
    diffs.forEach((diff: DiffChange, idx: number) => {
      const id = `diff-${idx}`;
      
      if (diff.added) {
        rightSegs.push({ 
          text: diff.value, 
          type: 'insert', 
          id 
        });
      } else if (diff.removed) {
        leftSegs.push({ 
          text: diff.value, 
          type: 'delete', 
          id 
        });
      } else {
        leftSegs.push({ 
          text: diff.value, 
          type: 'equal', 
          id 
        });
        rightSegs.push({ 
          text: diff.value, 
          type: 'equal', 
          id 
        });
      }
    });
    
    setLeftSegments(leftSegs);
    setRightSegments(rightSegs);
  }, [leftText, rightText]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="border shadow-sm bg-background">
        <div className="flex">
          <div className="w-1/2 border-r">
            <div className="p-2 bg-muted/50 border-b">
              <h3 className="font-medium">{leftTitle}</h3>
            </div>
            <ScrollArea 
              className="h-[400px]" 
              scrollHideDelay={0}
            >
              <div className="p-4" ref={leftRef}>
                {leftSegments.map((segment) => (
                  <DiffSegmentItem key={segment.id} segment={segment} />
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="w-1/2">
            <div className="p-2 bg-muted/50 border-b">
              <h3 className="font-medium">{rightTitle}</h3>
            </div>
            <ScrollArea 
              className="h-[400px]" 
              scrollHideDelay={0}
            >
              <div className="p-4" ref={rightRef}>
                {rightSegments.map((segment) => (
                  <DiffSegmentItem key={segment.id} segment={segment} />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
