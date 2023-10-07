// @ts-nocheck

import { Flex, Input, Button } from "@chakra-ui/react";
import TypewriterEffect from "../Effects/TypewriterEffect";

const MenuSearch = ({ fetchMenus, fetching, headofficeId, setHeadofficeId }) => {
  return (
    <Flex direction="column" alignItems="flex-start" gap="20px" minW="160px">
      <TypewriterEffect text="Enter your Headoffice ID" speed={60} />
      <Input
        size="xs"
        bg="mobiColor.200"
        color="black"
        id="headoffice-id"
        placeholder="Headoffice ID"
        maxW="220px"
        value={headofficeId}
        onChange={(e) => setHeadofficeId(e.target.value)}
      />

      <Button onClick={fetchMenus} isLoading={fetching} colorScheme="mobiColor" size="sm" color="black" fontSize="xs">
        Fetch Menus
      </Button>
    </Flex>
  );
};

export default MenuSearch;
