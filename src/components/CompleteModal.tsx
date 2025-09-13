import React from "react";

interface CompleteModalProps {
  onClose: () => void;
}

export const CompleteModal: React.FC<CompleteModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 max-w-sm shadow-lg text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Complete!</h2>
        <p className="text-gray-700 mb-6">Your order has been successfully placed.</p>
        <button className="px-6 py-2 bg-black text-white rounded hover:bg-red-700" onClick={onClose}>
          Close
        </button>
        <div className="mt-4 text-sm text-gray-400">Powered by Mama Ramen</div>
      </div>
    </div>
  );
};
