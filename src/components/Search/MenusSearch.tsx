// @ts-nocheck

import { Flex, Input, Button } from "@chakra-ui/react";
import TypewriterEffect from "../Effects/TypewriterEffect";
import TaskActionButton from "../Buttons/TaskActionButton";

const MenuSearch = ({ fetchMenus, fetching, headofficeId, setHeadofficeId }) => {
  return (
    <Flex direction="column" my="1em" alignItems="flex-start" gap="20px" minW="160px">
      <TypewriterEffect text="Enter your Headoffice ID" speed={60} />
      <Input
        size="xs"
        bg="white"
        color="black"
        id="headoffice-id"
        placeholder="Headoffice ID"
        maxW="220px"
        value={headofficeId}
        onChange={(e) => setHeadofficeId(e.target.value)}
      />

      <TaskActionButton
        onClick={fetchMenus}
        isLoading={fetching}
        size="sm"
        colorScheme="transparent"
        color="white"
        border="1px solid #02f9f9"
        fontSize="xs">
        Fetch Menus
      </TaskActionButton>
    </Flex>
  );
};

export default MenuSearch;
