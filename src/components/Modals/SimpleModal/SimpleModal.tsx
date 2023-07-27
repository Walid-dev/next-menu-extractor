// components/SimpleModal/index.tsx

import React from "react";
import "@/components/Modals/SimpleModal/SimpleModal.css";

enum ModalTypes {
  Error = "Error",
  Info = "Info",
  Warning = "Warning",
}

interface SimpleModalProps {
  isOpen: boolean;
  message: string;
  type: ModalTypes;
  handleClose: () => void;
}

const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, message, type, handleClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="simple-modal">
      <div className="simple-modal-content">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default SimpleModal;
