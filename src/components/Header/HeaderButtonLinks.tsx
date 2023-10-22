// @ts-nocheck

import { Flex, Spacer, ButtonGroup, Button } from "@chakra-ui/react";

const HeaderButtonLinks = ({ task, setTask }) => {
  return (
    <Flex alignItems="center" gap="2" ml="1rem">
      <Spacer />
      <ButtonGroup gap="2" alignItems="center">
        <Button size="sm" colorScheme="blue" onClick={() => setTask("create")}>
          Create Menu
        </Button>
        <Button size="sm" colorScheme="yellow" onClick={() => setTask("extract")}>
          Update Menu Price
        </Button>
        {task && <Button size="sm">{task}</Button>}
      </ButtonGroup>
    </Flex>
  );
};

export default HeaderButtonLinks;
