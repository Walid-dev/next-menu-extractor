// @ts-nocheck

import { Flex, Button, ButtonGroup, Spacer, Image } from "@chakra-ui/react";
import HeaderButtonLinks from "./HeaderButtonLinks";

const HeaderMain = ({ task, setTask }) => {
  return (
    <Flex alignItems="center" gap="2" w="100%">
      {/* <Heading size="md">Chakra App</Heading> */}
      <Image boxSize="80px" src="https://www.mobi2go.com/admin/images/logos/mobi-logo-light-blue.svg" alt="Mobi logo" />
      <Spacer />
      <HeaderButtonLinks task={task} setTask={setTask} />
      <Spacer />
      <ButtonGroup gap="2" alignItems="center">
        <Button size="sm" colorScheme="teal">
          Log in
        </Button>
        <Image boxSize="40px" src="https://static.mobi2go.com/images/214985" alt="sustaining team logo" />
      </ButtonGroup>
    </Flex>
  );
};

export default HeaderMain;
