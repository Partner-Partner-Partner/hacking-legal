import React from 'react';
import { diffWords, diffLines } from 'diff';
import { PlusCircle, MinusCircle, ExternalLink, Users } from 'lucide-react';

export enum DiffMethod {
  WORDS = 'words',
  LINES = 'lines',
}

interface DiffProps {
  oldText: string;
  newText: string;
  method?: DiffMethod;
  splitView?: boolean;
  showInternal?: boolean;
  argument?: {
    external: string;
    internal: string;
  };
}

export const Diff: React.FC<DiffProps> = ({
  oldText,
  newText,
  method = DiffMethod.WORDS,
  splitView = false,
  showInternal = false,
  argument,
}) => {
  // Calculate differences based on method
  const differences = method === DiffMethod.WORDS 
    ? diffWords(oldText, newText)
    : diffLines(oldText, newText);
  
  return (
    <>
      {/* Diff visualization */}
      {splitView ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm">
            {differences.map((part, index) => {
              if (part.added) return null;
              return (
                <span 
                  key={index}
                  className={part.removed ? 'bg-red-100 line-through text-red-800' : ''}
                >
                  {part.value}
                </span>
              );
            })}
          </div>
          <div className="text-sm">
            {differences.map((part, index) => {
              if (part.removed) return null;
              return (
                <span 
                  key={index}
                  className={part.added ? 'bg-green-100 text-green-800' : ''}
                >
                  {part.value}
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-sm leading-relaxed">
          {differences.map((part, index) => {
            // Enhanced styling for better readability in legal text
            const styles = part.added 
              ? 'bg-green-100 text-green-800 border-b border-green-300' 
              : part.removed 
                ? 'bg-red-100 text-red-800 line-through border-b border-red-300' 
                : '';
            
            return (
              <span 
                key={index}
                className={`${styles} whitespace-pre-wrap transition-colors duration-100`}
                title={part.added ? 'Added text' : part.removed ? 'Removed text' : ''}
              >
                {part.value}
              </span>
            );
          })}
          
          {/* Legend for the diff markers */}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 inline-block bg-green-100 border border-green-300"></span>
              Added text
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 inline-block bg-red-100 border border-red-300 line-through"></span>
              Removed text
            </span>
          </div>
        </div>
      )}

      {/* Negotiation arguments section - displayed as a table */}
      {argument && (
        <div className="mt-4 rounded-md border overflow-hidden">
          <div className="bg-muted/20 px-4 py-2 border-b flex items-center gap-2">
            <h4 className="font-medium">Supporting Arguments</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
            <div className="p-4">
              <h5 className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                External Argument
              </h5>
              <div className="text-sm">{argument.external}</div>
            </div>
            <div className="p-4 bg-amber-50/30">
              <h5 className="text-sm font-medium mb-2 text-amber-800 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Internal Reasoning
              </h5>
              <div className="text-sm">{argument.internal}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
