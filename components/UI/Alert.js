'use client';

import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export const Alert = ({ type = 'info', title, children, onClose }) => {
  const Icon = icons[type];
  
  return (
    <div className={`rounded-lg border p-4 ${styles[type]}`}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${
          type === 'success' ? 'text-green-400' :
          type === 'error' ? 'text-red-400' :
          type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
        }`} />
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          {children && (
            <div className="text-sm mt-1">{children}</div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-black hover:bg-opacity-10 transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};