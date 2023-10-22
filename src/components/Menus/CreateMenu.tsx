// @ts-nocheck

import { Box, VStack, Flex } from "@chakra-ui/react";
import TypewriterEffect from "../Effects/TypewriterEffect";

const CreateMenu = () => {
  return (
    <Flex
      direction="column"
      my="1em"
      alignItems="flex-start"
      gap="20px"
      minW="160px"
    >
      <Box minH="50px">
        <TypewriterEffect text="Create menu" speed={50} />
      </Box>
    </Flex>
  );
};

export default CreateMenu;
