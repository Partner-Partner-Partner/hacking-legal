import React from 'react';
import { diffWords, diffLines } from 'diff';
import { PlusCircle, MinusCircle } from 'lucide-react';

export enum DiffMethod {
  WORDS = 'words',
  LINES = 'lines',
}

interface DiffProps {
  oldText: string;
  newText: string;
  method?: DiffMethod;
  splitView?: boolean;
}

export const Diff: React.FC<DiffProps> = ({
  oldText,
  newText,
  method = DiffMethod.WORDS,
  splitView = false,
}) => {
  // Calculate differences based on method
  const differences = method === DiffMethod.WORDS 
    ? diffWords(oldText, newText)
    : diffLines(oldText, newText);
  
  if (splitView) {
    // For split view, render old and new texts separately with highlights
    return (
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
    );
  }

  // For unified view, show inline changes
  return (
    <div className="text-sm">
      {differences.map((part, index) => {
        const backgroundColor = part.added 
          ? 'bg-green-100 text-green-800' 
          : part.removed 
            ? 'bg-red-100 text-red-800' 
            : '';
        
        const icon = part.added 
          ? <PlusCircle className="h-3 w-3 inline-block mr-1 text-green-600" /> 
          : part.removed 
            ? <MinusCircle className="h-3 w-3 inline-block mr-1 text-red-600" /> 
            : null;
        
        // Style differently if added or removed
        return (
          <span 
            key={index}
            className={`${backgroundColor} ${part.removed ? 'line-through' : ''} whitespace-pre-wrap`}
          >
            {part.added || part.removed ? icon : null}
            {part.value}
          </span>
        );
      })}
    </div>
  );
};
