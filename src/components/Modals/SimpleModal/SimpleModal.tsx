import React, { useState, useEffect } from "react";
import "@/components/Modals/SimpleModal/SimpleModal.css";
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
} from "@chakra-ui/react";
import { calcLength } from "framer-motion";

export enum SimpleModalType {
  Error = "Error",
  Info = "Info",
  Warning = "Warning",
}

interface SimpleModalProps {
  isOpenInitially: boolean;
  modalTitle: string;
  modalMessage: string;
  modalType: SimpleModalType;
  secondaryButtonText?: string,
  onCloseModal?: () => void;
  onSecondaryAction?: () => void;
}

const SimpleModal: React.FC<SimpleModalProps> = ({
  isOpenInitially,
  modalTitle,
  modalMessage,
  secondaryButtonText = `Perform Action`,
  onCloseModal,
  onSecondaryAction,
  modalType,
}) => {
  // I use useState to manage the open/close state of the modal.
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  let backgroundColor: string;
  let fontColor: string;

  // I determine the color scheme based on the modal type.
  switch (modalType) {
    case SimpleModalType.Error:
      backgroundColor = "red";
      fontColor = "white";
      break;
    case SimpleModalType.Info:
      backgroundColor = "#455660";
      fontColor = "white";
      break;
    case SimpleModalType.Warning:
      backgroundColor = "yellow";
      fontColor = "white";
      break;
    default:
      backgroundColor = "gray";
      fontColor = "white";
  }

  // I define a function to handle the close operation of the modal.
  const handleModalClose = () => {
    if (onCloseModal) {
      onCloseModal();
    }
  };

  return (
    <ChakraModal onClose={handleModalClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent backgroundColor={backgroundColor} color={fontColor}>
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton color="black" />
        <ModalBody>
          <p>{modalMessage}</p>
          <p>{modalType}</p>
          <p>{backgroundColor}</p>
          <p>{fontColor}</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleModalClose}>
            Close
          </Button>
          <Button colorScheme="white" variant="outline" onClick={onSecondaryAction}>
            {secondaryButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default SimpleModal;
