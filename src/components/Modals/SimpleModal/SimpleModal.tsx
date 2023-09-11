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

enum ModalTypes {
  Error = "Error",
  Info = "Info",
  Warning = "Warning",
}

interface SimpleModalProps {
  isOpen: boolean;
  message: string;
  type: ModalTypes;
  handleClose?: () => void; // made this optional with ?
}

const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen: propsIsOpen, message, type, handleClose }) => {
  const [isOpen, setIsOpen] = useState(propsIsOpen);

  useEffect(() => {
    setIsOpen(propsIsOpen);
  }, [propsIsOpen]);

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
    setIsOpen(false);
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <Box bgColor={`${colorScheme}.500`} color="white">
            <ModalHeader>{type}</ModalHeader>
            <ModalCloseButton color="white" />
          </Box>
          <ModalBody>
            <p>{message}</p>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod reiciendis laudantium hic exercitationem animi, amet
              facere sapiente non neque perferendis aliquid, incidunt mollitia fuga dolorem facilis voluptates cumque distinctio
              blanditiis.
            </p>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" colorScheme={colorScheme} mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SimpleModal;
