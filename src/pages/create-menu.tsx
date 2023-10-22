// src/pages/createMenu.tsx
// @ts-nocheck

import { Heading, VStack, Box } from "@chakra-ui/react";
import Layout from "@/app/layout";
import TypewriterEffect from "@/components/Effects/TypewriterEffect";

const CreateMenu = () => {
  return (
    <Layout>
      <VStack spacing={5} p={5} align="start" w="100%">
        <Box minH="50px">
          <TypewriterEffect text="Create menu" speed={50} />
        </Box>
      </VStack>
    </Layout>
  );
};

export default CreateMenu;
