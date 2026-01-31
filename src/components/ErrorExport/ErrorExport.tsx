/**
 * Error Export Button Component
 * Allows downloading error tracking data as JSON
 */
import React from 'react';
import { useErrorTrackingStore } from '@/store/errorTracking.store';
import './ErrorExport.scss';

export const ErrorExport: React.FC = () => {
  const { errors, exportToJSON, getErrorStats } = useErrorTrackingStore();
  const stats = getErrorStats();

  const handleExport = () => {
    exportToJSON();
  };

  if (errors.length === 0) {
    return null; // Don't show button if no errors
  }

  return (
    <div className="error-export">
      <button 
        className="error-export__button"
        onClick={handleExport}
        title="Download error data as JSON"
      >
        <span className="error-export__icon">📊</span>
        <span className="error-export__text">
          Export Errors ({stats.totalErrors})
        </span>
      </button>
      
      <div className="error-export__info">
        Download your typing error data for analysis
      </div>
    </div>
  );
};
