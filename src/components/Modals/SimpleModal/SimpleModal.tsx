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

  let modalColorScheme: string;
  let modalFontColorScheme: string;

  switch (type) {
    case ModalTypes.Error:
      modalColorScheme = "red";
      modalFontColorScheme = "white";
      break;
    case ModalTypes.Info:
      modalColorScheme = "blue";
      modalFontColorScheme = "white";
      break;
    case ModalTypes.Warning:
      modalColorScheme = "yellow";
      modalFontColorScheme = "white";

      break;
    default:
      modalColorScheme = "gray";
      modalFontColorScheme = "white";
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

        <ModalBody backgroundColor={modalColorScheme} color={modalFontColorScheme}>
          <p>{message}</p>
          <p>{type}</p>
          <p>{modalColorScheme}</p>
          <p>{modalFontColorScheme}</p>
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
