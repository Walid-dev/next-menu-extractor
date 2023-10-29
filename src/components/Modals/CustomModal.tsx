import React, { useState, useEffect } from "react";
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
  Text
} from "@chakra-ui/react";
import { calcLength } from "framer-motion";

export enum CustomModalTypes {
  Error = "Error",
  Info = "Info",
  Warning = "Warning",
  Success = "Success"
}

interface CustomModalProps {
  isOpenInitially: boolean;
  modalTitle: string;
  modalMessage: string;
  modalType: CustomModalTypes;
  secondaryButtonText?: string;
  onCloseModal?: () => void;
  onSecondaryAction?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
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
    case CustomModalTypes.Error:
      modalTitle = "Error";
      backgroundColor = "#B22222";
      fontColor = "white";
      break;
    case CustomModalTypes.Info:
      modalTitle = "Info";
      backgroundColor = "#455660";
      fontColor = "white";
      break;
    case CustomModalTypes.Warning:
      modalTitle = "Warning";
      backgroundColor = "#DAA520";
      fontColor = "white";
      break;
      case CustomModalTypes.Success:
      modalTitle = "Success";
      backgroundColor = "#4CAF50";
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
          <Text as='b' fontSize="1.1em" noOfLines={4}>{modalMessage}</Text>
        </ModalBody>
        <ModalFooter>
          {/* <Button colorScheme="white" mr={3} variant="outline" onClick={onSecondaryAction}>
            {secondaryButtonText}
          </Button> */}
          <Button colorScheme="teal" onClick={handleModalClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default CustomModal;
