import { motion, AnimatePresence } from 'framer-motion';

export interface ToastProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 left-1/2 z-50 min-w-[300px]"
    >
      <div className={`
        px-6 py-4 rounded-lg shadow-lg flex items-center
        ${type === 'error' 
          ? 'bg-red-600 shadow-red-600/20' 
          : 'bg-[#006FF3] shadow-[#006FF3]/20'
        }
      `}>
        <div className="flex items-center gap-3 w-full">
          {type === 'error' ? (
            <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
          <p className="text-white font-medium flex-1">{message}</p>
          <button 
            onClick={onClose}
            className="ml-4 text-white/80 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
