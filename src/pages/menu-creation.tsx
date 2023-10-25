// pages/menu-creation.tsx
import { useReducer, useRef } from "react";
import MenuReducer from "@/reducer/MenuReducer";
import { INITIAL_MENU_STATE } from "@/reducer/MenuReducer";
import HeaderMain from "@/components/Header/HeaderMain";
import { Box, Text, VStack, Textarea } from "@chakra-ui/react";

const MenuCreation = () => {
  const [state, dispatch] = useReducer(MenuReducer, INITIAL_MENU_STATE);
  const tagRef = useRef<any>();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    dispatch({ type: "CHANGE_INPUT", payload: { name: e.target.name, value: e.target.value } });
  };

  return (
    <VStack spacing={5} p={5} align="start" w="100%" border="1px solid aqua" color="white">
      <HeaderMain />
      <Text fontSize="2xl" mb={4}>
        Menu Creation Page
      </Text>
      <Textarea
        value={JSON.stringify(state, null, 2)} // Display the menu JSON in a formatted manner
        readOnly // This is just for display, so no need for it to be editable
        height="400px"
        overflowY="scroll"
        fontSize=".75em"
      />
    </VStack>
  );
};

export default MenuCreation;
