'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadFieldProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
  uploadStatus?: 'idle' | 'success' | 'error';
}

export default function UploadField({
  onFilesSelected,
  isUploading,
  uploadStatus = 'idle',
}: UploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();
  
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return (
    <div className="w-full">
      <motion.div
        onClick={openFileDialog}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsPressed(false)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative mx-auto aspect-square w-full max-w-md
          bg-[#003772] rounded-3xl transition-colors duration-300 p-6
          cursor-pointer shadow-lg
        `}
      >
        <motion.div
          animate={{
            backgroundColor: isUploading ? '#006FF3' : '#006FF3',
            scale: isDragging ? 1.02 : 1
          }}
          className="absolute inset-6 rounded-2xl"
        >
          <motion.div
            animate={{ 
              borderColor: isDragging ? '#003772' : 'rgba(0,55,114,0.3)',
              y: isDragging ? -4 : 0
            }}
            className="absolute inset-4 rounded-xl border-4 border-dashed
              flex flex-col items-center justify-center"
          >
            {/* Icon container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${isUploading}-${uploadStatus}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 h-24 w-24"
              >
                {/* Keep existing icon and states code */}
                {!isUploading && uploadStatus === 'idle' && (
                  <svg 
                    viewBox="0 0 64 64" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transform transition-transform ${isDragging ? 'scale-110' : ''}`}
                  >
                    <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {/* Document shape */}
                      <path d="M44,18 L44,52 C44,54.209 42.209,56 40,56 L16,56 C13.791,56 12,54.209 12,52 L12,12 C12,9.791 13.791,8 16,8 L34,8 L44,18 Z" />
                      
                      {/* Folded corner */}
                      <path d="M34,8 L34,18 L44,18" />
                      
                      {/* Text lines */}
                      <line x1="20" y1="28" x2="36" y2="28" />
                      <line x1="20" y1="36" x2="36" y2="36" />
                      <line x1="20" y1="44" x2="30" y2="44" />
                      
                      {/* Arrow */}
                      <g className={`transform transition-all duration-500 ${isDragging ? 'translate-y-[-8px]' : ''}`}>
                        <path d="M52,36 L52,24" />
                        <polyline points="46 30 52 24 58 30" />
                      </g>
                    </g>
                  </svg>
                )}
                
                {/* Keep existing uploading, success, and error states */}
                {isUploading && (
                  <div className="flex flex-col items-center justify-center">
                    <svg className="animate-spin h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-sm font-bold text-white animate-pulse">Uploading...</p>
                  </div>
                )}
                
                {/* Success state */}
                {!isUploading && uploadStatus === 'success' && (
                  <div className="flex flex-col items-center justify-center animate-fadeIn">
                    <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="mt-2 text-sm font-bold text-white">Upload Complete!</p>
                  </div>
                )}
                
                {/* Error state */}
                {!isUploading && uploadStatus === 'error' && (
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Text content */}
            <AnimatePresence mode="wait">
              {!isUploading && uploadStatus === 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="mb-2 text-sm font-medium text-white">
                    <span className="font-bold">Click to upload</span> or drag & drop
                  </p>
                  <p className="text-xs text-white/90">
                    Upload PDF, Word or text documents
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </motion.div>
    </div>
  );
}