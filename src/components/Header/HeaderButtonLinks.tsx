import { Flex, ButtonGroup, Button, Spacer } from "@chakra-ui/react";
import Link from "next/link";

/**
 * Props for HeaderButtonLinks component.
 */
interface HeaderButtonLinksProps {
  task?: "update" | "extract"; // Optional task prop
  setTask?: (task: "update" | "extract") => void; // Optional setTask prop
}

/**
 * Component to render the main button links for header.
 *
 * @param {HeaderButtonLinksProps} props - Props for HeaderButtonLinks.
 */
const HeaderButtonLinks: React.FC<HeaderButtonLinksProps> = ({ task, setTask }) => {
  return (
    <Flex alignItems="center" gap="2" ml="1rem">
      <Spacer />
      <ButtonGroup gap="2" alignItems="center">
        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => setTask && setTask("update")} // Check setTask existence before calling
        >
          Extract Menu
        </Button>

        <Button
          size="sm"
          colorScheme="yellow"
          onClick={() => setTask && setTask("extract")} // Check setTask existence before calling
        >
          Update Menu Price
        </Button>

        {task && <Button size="sm">{task}</Button>}

        <Link href="/menu-creation" passHref>
          <Button as="a" size="sm" colorScheme="teal">
            Menu Creation
          </Button>
        </Link>
      </ButtonGroup>
    </Flex>
  );
};

export default HeaderButtonLinks;
