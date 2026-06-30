import React from 'react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in-up px-4">
      <div className="glass-panel w-full max-w-sm overflow-hidden border border-white/10">
        <div className="bg-fire-gradient px-6 py-4">
          <h2 className="text-xl font-heading font-bold text-white">{title}</h2>
        </div>
        <div className="p-6">
          <p className="text-text-secondary mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 border border-border text-text-secondary font-bold py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition shadow-sm"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
