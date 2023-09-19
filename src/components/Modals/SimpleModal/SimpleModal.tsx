import React, { useState, useEffect } from "react";
import "@/components/Modals/SimpleModal/SimpleModal.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
} from "@chakra-ui/react";

export enum ModalTypes {
  Error = "Error",
  Info = "Info",
  Warning = "Warning",
}

interface SimpleModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: ModalTypes;
  handleClose?: () => void; // made this optional with ?
}

const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen: propsIsOpen, title, message, handleClose, type }) => {
  const [isOpen, setIsOpen] = useState(propsIsOpen);

  let colorScheme: string;

  switch (type) {
    case ModalTypes.Error:
      colorScheme = "red";
      break;
    case ModalTypes.Info:
      colorScheme = "blue";
      break;
    case ModalTypes.Warning:
      colorScheme = "yellow";
      break;
    default:
      colorScheme = "gray";
  }

  const onClose = () => {
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton color="black" />

        <ModalBody>
          <p>{message}</p>
          <p>{type}</p>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SimpleModal;
