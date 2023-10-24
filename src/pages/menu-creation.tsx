// pages/menu-creation.tsx
import HeaderMain from "@/components/Header/HeaderMain";
import { Box, Text, VStack } from "@chakra-ui/react";

const MenuCreation = () => {
  return (
    <VStack border="1px solid aqua">
      <HeaderMain />

      <Box p={4} border="1px solid lime">
        <Text fontSize="2xl" mb={4}>
          Menu Creation Page
        </Text>
        {/* Add the rest of your menu creation logic/components here */}
      </Box>
    </VStack>
  );
};

export default MenuCreation;
