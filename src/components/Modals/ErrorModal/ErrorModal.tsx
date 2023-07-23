// components/ErrorModal/index.tsx

import React from "react";
import "@/components/Modals/ErrorModal/ErrorModal.css";

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  handleClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, message, handleClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="error-modal">
      <div className="error-modal-content">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default ErrorModal;
