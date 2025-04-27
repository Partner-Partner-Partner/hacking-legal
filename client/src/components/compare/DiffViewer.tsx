import { useState } from "react";
import { Contract, Section, Clause } from "@/types/contract";
import { ContractSection, ContractClause } from "@/types/playbook";
import { ClauseClassification } from "@/types/comparison";
import { Check, AlertTriangle, HelpCircle, XCircle, Edit, ExternalLink, Users, Briefcase } from "lucide-react";
import { Diff, DiffMethod } from "@/components/compare/Diff";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type ClauseMode = 'current' | 'mostFavorable' | 'balanced';

interface DiffViewerProps {
  contract: Contract;
  playbook: ContractSection[];
  openSections: string[];
  activeSection: string | null;
  activeClause: string | null;
  classifications: ClauseClassification[];
  improvedClauses: Record<string, string>;
  onClassifyClause: (sectionTitle: string, clauseText: string, classification: string) => void;
  onApplyArgument: (sectionTitle: string, clauseIndex: number, newText: string) => void;
  onSectionClick: (sectionTitle: string) => void;
}

export function DiffViewer({
  contract,
  playbook,
  openSections,
  activeSection,
  activeClause,
  classifications,
  improvedClauses,
  onClassifyClause,
  onApplyArgument,
  onSectionClick,
}: DiffViewerProps) {
  // Track which mode is selected for each clause
  const [clauseModes, setClauseModes] = useState<Record<string, ClauseMode>>({});
  // Track which argument view to display (internal/external) - Keep this state as it's used in ArgumentDisplay
  const [argumentView, setArgumentView] = useState<'external' | 'internal' | 'both'>('both');

  // Find matching playbook section for a contract section
  const getPlaybookSection = (sectionTitle: string): ContractSection | undefined => {
    return playbook.find(s => s.title === sectionTitle);
  };

  // Get classification for a specific clause
  const getClassification = (sectionTitle: string, clauseText: string): string | null => {
    const classification = classifications.find(
      c => c.sectionTitle === sectionTitle && c.clauseText === clauseText
    );
    return classification?.classification || null;
  };

  // Get the improved clause text if available
  const getImprovedText = (sectionTitle: string, clauseIndex: number): string | null => {
    const key = `${sectionTitle}-${clauseIndex}`;
    return improvedClauses[key] || null;
  };

  // Set mode for a specific clause
  const setClauseMode = (sectionTitle: string, clauseIndex: number, mode: ClauseMode) => {
    const key = `${sectionTitle}-${clauseIndex}`;
    setClauseModes(prev => ({
      ...prev,
      [key]: mode
    }));
  };

  // Get the current mode for a clause
  const getClauseMode = (sectionTitle: string, clauseIndex: number): ClauseMode => {
    const key = `${sectionTitle}-${clauseIndex}`;
    return clauseModes[key] || 'current';
  };

  // Get the appropriate arguments for a clause based on mode
  const getNegotiationArguments = (playbookClause: ContractClause | undefined, mode: ClauseMode) => {
    if (!playbookClause || !playbookClause.arguments) return null;

    switch (mode) {
      case 'mostFavorable':
        return playbookClause.arguments.toMostFavorable;
      case 'balanced':
        return playbookClause.arguments.toBalanced;
      default:
        return null;
    }
  };

  // Animation variants for staggered animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 }
  };

  const buttonVariants = {
    tap: { scale: 0.97 },
    hover: { scale: 1.02 }
  };

  return (
    <div className="space-y-8">
      {contract.sections.map((section, sectionIndex) => {
        const isOpen = openSections.includes(section.title);
        const isActive = activeSection === section.title;
        const playbookSection = getPlaybookSection(section.title);

        if (!isOpen) return (
          <motion.div
            key={`section-${sectionIndex}`}
            id={`section-${section.title}`}
            className={`border rounded-lg shadow-sm ${isActive ? 'border-primary' : 'border-border'} cursor-pointer`}
            onClick={() => onSectionClick(section.title)}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
          >
            <div
              className={`px-6 py-4 font-medium flex items-center justify-between ${isActive ? "bg-primary/5 text-primary border-b border-primary/20" : "bg-muted/20"
                }`}
            >
              <h2 className="text-lg">{section.title}</h2>
            </div>
          </motion.div>
        );

        return (
          <motion.div
            key={`section-${sectionIndex}`}
            id={`section-${section.title}`}
            className={`border rounded-lg shadow-sm ${isActive ? 'border-primary' : 'border-border'}`}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
          >
            <div
              className={`px-6 py-4 font-medium flex items-center justify-between ${isActive ? "bg-primary/5 text-primary border-b border-primary/20" : "bg-muted/20"
                } cursor-pointer`}
              onClick={() => onSectionClick(section.title)}
            >
              <h2 className="text-lg">{section.title}</h2>
            </div>

            <motion.div
              className="px-6 py-4 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {section.clauses.map((clause, clauseIndex) => {
                const clauseId = `${clauseIndex}`;
                const isClauseActive = activeClause === clauseId && isActive;
                const classification = getClassification(section.title, clause.text);
                const improvedText = getImprovedText(section.title, clauseIndex);

                // Find matching playbook clause if available
                const playbookClause = playbookSection?.clauses?.[clauseIndex];

                // Current version (considering improvements)
                const currentText = improvedText || clause.text;

                // Determine which versions to offer
                const hasMostFavorable = playbookClause?.mostFavorable;
                const hasBalanced = playbookClause?.balanced;

                // Get current mode for this clause
                const mode = getClauseMode(section.title, clauseIndex);

                // Get the text to display based on mode
                let showDiff = false;
                let targetText = '';

                if (mode === 'mostFavorable' && hasMostFavorable) {
                  showDiff = true;
                  targetText = playbookClause.mostFavorable;
                } else if (mode === 'balanced' && hasBalanced) {
                  showDiff = true;
                  targetText = playbookClause.balanced;
                }

                // Get arguments for the current mode
                const negotiationArguments = getNegotiationArguments(playbookClause, mode);

                return (
                  <motion.div
                    key={`clause-${clauseIndex}`}
                    id={`clause-${section.title}-${clauseId}`}
                    className={`rounded-lg ${isClauseActive ? 'ring-2 ring-primary/20' : ''}`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3, delay: clauseIndex * 0.1 }}
                  >
                    <div className="flex flex-wrap items-center justify-between mb-3">
                      <h3 className="font-medium text-sm">Clause {clauseIndex + 1}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {/* Mode toggle buttons - visualize only */}
                        <motion.button
                          onClick={() => setClauseMode(section.title, clauseIndex, 'current')}
                          className={`text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${mode === 'current'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                            }`}
                          whileHover="hover"
                          whileTap="tap"
                          variants={buttonVariants}
                        >
                          Current
                        </motion.button>

                        {hasMostFavorable && (
                          <motion.button
                            onClick={() => {
                              setClauseMode(section.title, clauseIndex, 'mostFavorable');
                            }}
                            className={`text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${mode === 'mostFavorable'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-muted/50 hover:bg-green-50 text-muted-foreground'
                              }`}
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                          >
                            <Check className="h-3 w-3" />
                            Most Favorable
                          </motion.button>
                        )}

                        {hasBalanced && (
                          <motion.button
                            onClick={() => {
                              setClauseMode(section.title, clauseIndex, 'balanced');
                            }}
                            className={`text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${mode === 'balanced'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-muted/50 hover:bg-blue-50 text-muted-foreground'
                              }`}
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                          >
                            <HelpCircle className="h-3 w-3" />
                            Balanced
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Classification display */}
                    {classification && (
                      <motion.div
                        className="flex items-center gap-1.5 mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-xs font-medium text-muted-foreground">Classification:</span>
                        <ClassificationBadge type={classification} />
                      </motion.div>
                    )}

                    {/* Single text field with conditional diff display */}
                    <motion.div
                      className={`p-4 rounded-md border ${classification ? getClassBorder(classification) : 'border-border'} bg-card`}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {showDiff ? (
                        <Diff
                          oldText={currentText}
                          newText={targetText}
                          method={DiffMethod.WORDS}
                        />
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{currentText}</p>
                      )}
                    </motion.div>

                    {/* Mode legend when showing diff */}
                    {showDiff && (
                      <motion.div
                        className="mt-2 text-xs text-muted-foreground"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span>Showing suggested changes for {mode === 'mostFavorable' ? 'Most Favorable' : 'Balanced'} version.</span>
                        <motion.button
                          onClick={() => {
                            if (mode === 'mostFavorable' && hasMostFavorable && playbookClause) {
                              onApplyArgument(section.title, clauseIndex, playbookClause.mostFavorable);
                            } else if (mode === 'balanced' && hasBalanced && playbookClause) {
                              onApplyArgument(section.title, clauseIndex, playbookClause.balanced);
                            }
                          }}
                          className="ml-2 text-primary hover:underline"
                          whileTap={{ scale: 0.97 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          Apply these changes
                        </motion.button>
                      </motion.div>
                    )}

                    {/* Arguments display */}
                    {showDiff && negotiationArguments && (
                      <motion.div
                        className="mt-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: 1,
                          height: 'auto',
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <ArgumentDisplay
                          arguments={negotiationArguments}
                          mode={mode}
                        />
                      </motion.div>
                    )}

                    {/* Classification buttons (if needed) */}
                    {playbookClause && !classification && (
                      <motion.div
                        className="mt-3 pt-3 border-t"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        layout
                      >
                        <div className="text-xs text-muted-foreground mb-2">Classify this clause:</div>
                        <div className="flex flex-wrap gap-1.5">
                          <ClassificationButton
                            type="mostFavorable"
                            active={false}
                            onClick={() => onClassifyClause(section.title, clause.text, 'mostFavorable')}
                          />
                          <ClassificationButton
                            type="balanced"
                            active={false}
                            onClick={() => onClassifyClause(section.title, clause.text, 'balanced')}
                          />
                          <ClassificationButton
                            type="acceptable"
                            active={false}
                            onClick={() => onClassifyClause(section.title, clause.text, 'acceptable')}
                          />
                          <ClassificationButton
                            type="unacceptable"
                            active={false}
                            onClick={() => onClassifyClause(section.title, clause.text, 'unacceptable')}
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

// New component to display arguments
interface ArgumentDisplayProps {
  arguments: {
    external: string;
    internal: string;
  };
  mode: ClauseMode;
}

function ArgumentDisplay({
  arguments: negotiationArguments,
  mode,
}: ArgumentDisplayProps) {
  const title = mode === 'mostFavorable'
    ? 'Arguments for Most Favorable Position'
    : 'Arguments for Balanced Position';

  return (
    <motion.div
      className="rounded-md border overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      layout
    >
      <div className="bg-muted/30 px-4 py-2 border-b">
        <h4 className="font-medium text-sm">{title}</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
        <div className="p-4">
          <h5 className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" />
            External Argument
          </h5>
          <div className="text-sm">{negotiationArguments.external}</div>
        </div>
        <div className="p-4 bg-amber-50/30">
          <h5 className="text-sm font-medium mb-2 text-amber-800 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Internal Reasoning
          </h5>
          <div className="text-sm">{negotiationArguments.internal}</div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper component for classification badges
function ClassificationBadge({
  type,
  small = false
}: {
  type: string;
  small?: boolean;
}) {
  let icon;
  let label;
  let colors;

  switch (type) {
    case 'mostFavorable':
      icon = <Check className={`${small ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />;
      label = "Most Favorable";
      colors = "bg-green-100 text-green-800";
      break;
    case 'balanced':
      icon = <HelpCircle className={`${small ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />;
      label = "Balanced";
      colors = "bg-blue-100 text-blue-800";
      break;
    case 'acceptable':
      icon = <AlertTriangle className={`${small ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />;
      label = "Acceptable";
      colors = "bg-yellow-100 text-yellow-800";
      break;
    case 'unacceptable':
      icon = <XCircle className={`${small ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />;
      label = "Unacceptable";
      colors = "bg-red-100 text-red-800";
      break;
    default:
      icon = <HelpCircle className={`${small ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />;
      label = "Unknown";
      colors = "bg-gray-100 text-gray-800";
  }

  return (
    <span
      className={`${small ? 'px-1.5 py-0.5' : 'px-2 py-1'} ${colors} rounded-full flex items-center gap-1 text-xs`}
    >
      {icon} {label}
    </span>
  );
}

// Helper component for classification buttons
function ClassificationButton({
  type,
  active,
  onClick
}: {
  type: string;
  active: boolean;
  onClick: () => void;
}) {
  let icon;
  let label;
  let colors;

  switch (type) {
    case 'mostFavorable':
      icon = <Check className="h-3 w-3" />;
      label = "Most Favorable";
      colors = active ? "bg-green-100 text-green-800 border-green-300 border" : "bg-muted/50 hover:bg-green-50 text-muted-foreground";
      break;
    case 'balanced':
      icon = <HelpCircle className="h-3 w-3" />;
      label = "Balanced";
      colors = active ? "bg-blue-100 text-blue-800 border-blue-300 border" : "bg-muted/50 hover:bg-blue-50 text-muted-foreground";
      break;
    case 'acceptable':
      icon = <AlertTriangle className="h-3 w-3" />;
      label = "Acceptable";
      colors = active ? "bg-yellow-100 text-yellow-800 border-yellow-300 border" : "bg-muted/50 hover:bg-yellow-50 text-muted-foreground";
      break;
    case 'unacceptable':
      icon = <XCircle className="h-3 w-3" />;
      label = "Unacceptable";
      colors = active ? "bg-red-100 text-red-800 border-red-300 border" : "bg-muted/50 hover:bg-red-50 text-muted-foreground";
      break;
    // Added default case for completeness, although unlikely to be hit with defined types
    default:
      icon = <HelpCircle className="h-3 w-3" />;
      label = type; // Display the type itself if unknown
      colors = "bg-gray-100 text-gray-800";
  }

  return (
    <button
      className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 transition-colors ${colors}`}
      onClick={onClick}
    >
      {icon} {label}
    </button>
  );
}

// Helper function to get border color based on classification
function getClassBorder(classification: string) {
  switch (classification) {
    case 'mostFavorable':
      return 'border-green-300';
    case 'balanced':
      return 'border-blue-300';
    case 'acceptable':
      return 'border-yellow-300';
    case 'unacceptable':
      return 'border-red-300';
    default:
      return 'border-border';
  }
}
