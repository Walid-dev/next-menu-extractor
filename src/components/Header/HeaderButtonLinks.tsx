import { Flex, ButtonGroup, Button, Spacer, Link as ChakraLink } from "@chakra-ui/react";
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

        <Link href="/" passHref>
          <ChakraLink as={Button} size="sm" colorScheme="teal">
            Extract Menu
          </ChakraLink>
        </Link>

        {task && <Button size="sm">{task}</Button>}

        <Link href="/menu-creation" passHref>
          <ChakraLink as={Button} size="sm" colorScheme="teal">
            Menu Creation
          </ChakraLink>
        </Link>
      </ButtonGroup>
    </Flex>
  );
};

export default HeaderButtonLinks;
