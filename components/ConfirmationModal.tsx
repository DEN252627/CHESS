import React from 'react';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-lg shadow-2xl flex flex-col items-center max-w-sm text-center">
        <h3 className="text-xl font-bold mb-6 text-white">{message}</h3>
        <div className="flex gap-4 w-full">
          <button
            onClick={onCancel}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;