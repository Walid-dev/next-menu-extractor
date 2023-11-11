import { Flex, Button, ButtonGroup, Spacer, Image } from "@chakra-ui/react";
import HeaderButtonLinks from "./HeaderButtonLinks";

/**
 * Props for HeaderMain component.
 */
interface HeaderMainProps {
  task?: "update" | "extract"; // Optional task prop
  setTask?: (task: "update" | "extract") => void; // Optional setTask prop
}

/**
 * Component to render the main header with logo, buttons, and image.
 *
 * @param {HeaderMainProps} props - Props for HeaderMain.
 */
const HeaderMain: React.FC<HeaderMainProps> = ({ task, setTask }) => {
  return (
    <Flex alignItems="center" gap="2" w="100%">
      <Image boxSize="80px" src="https://www.mobi2go.com/admin/images/logos/mobi-logo-light-blue.svg" alt="Mobi logo" />
      <Spacer />
      <HeaderButtonLinks task={task} setTask={setTask} />
      <Spacer />
      <ButtonGroup gap="2" alignItems="center">
        <Button size="sm" colorScheme="teal">
          Log in
        </Button>
        <Image boxSize="40px" src="https://static.mobi2go.com/images/216165" alt="sustaining team logo" />
      </ButtonGroup>
    </Flex>
  );
};

export default HeaderMain;