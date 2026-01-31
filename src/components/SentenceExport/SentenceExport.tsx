/**
 * Sentence Export Button Component
 * Exports sentence comparison data for Flutter integration
 */
import React from 'react';
import { useSentenceTrackingStore } from '@/store/sentenceTracking.store';
import './SentenceExport.scss';

export const SentenceExport: React.FC = () => {
  const { attempts, exportSentenceComparison } = useSentenceTrackingStore();

  const handleExport = () => {
    exportSentenceComparison();
  };

  if (attempts.length === 0) {
    return null; // Don't show if no attempts
  }

  return (
    <div className="sentence-export">
      <button 
        className="sentence-export__button"
        onClick={handleExport}
        title="Export sentence comparison for Flutter"
      >
        <span className="sentence-export__icon">📝</span>
        <span className="sentence-export__text">
          Export Sentences ({attempts.length})
        </span>
      </button>
      
      <div className="sentence-export__info">
        Export for Flutter processing
      </div>
    </div>
  );
};
