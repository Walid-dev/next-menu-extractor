import { Button, ButtonProps } from "@chakra-ui/react";

// Define the TaskActionButton props by extending the ButtonProps from Chakra UI
type TaskActionButtonProps = ButtonProps;

/**
 * `TaskActionButton` is a custom button component built on top of Chakra UI's Button.
 * It comes with predefined styles suitable for primary tasks and actions.
 * 
 * @component
 * @param {TaskActionButtonProps} props - Props for the button, extending Chakra UI's ButtonProps.
 * @returns {React.Element} - Rendered `TaskActionButton` component.
 */
const TaskActionButton: React.FC<TaskActionButtonProps> = (props) => {
  return (
    <Button
      boxShadow="none"
      borderWidth="1px"
      borderColor="#02f9f9"
      borderRadius="2px"
      size="sm"
      fontSize="xs"
      colorScheme="transparent"
      color="white"
      _hover={{
        borderColor: "#01c8c8",
        color: "#e6e6e6",
      }}
      {...props}
    />
  );
};

export default TaskActionButton;
