import React from 'react';

const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold mb-4">Alert</h3>
        <p>{message}</p>
        <button
          className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
