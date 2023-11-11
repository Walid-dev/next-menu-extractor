// @ts-nocheck

import { useReducer, useState } from "react"; // useRef is removed since it's not used
import MenuReducer, { INITIAL_SINGLE_MENU_STATE } from "@/reducer/MenuReducer";
import HeaderMain from "@/components/Header/HeaderMain";
import { Box, Text, VStack, Textarea, Button, Input } from "@chakra-ui/react";
import "../style/main.css";


const MenuCreation = () => {
  const [state, dispatch] = useReducer(MenuReducer, INITIAL_SINGLE_MENU_STATE);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "CHANGE_MENU_INPUT", payload: { name, value } });
  };

  const addCategory = () => {
    dispatch({ type: "ADD_CATEGORY", payload: { name: '', backend_name: '', description: '' } });
  };

  const handleCategoryChange = (e, index) => {
    const { name, value } = e.target;
    dispatch({
      type: "UPDATE_CATEGORY",
      payload: {
        index,
        data: { [name]: value }
      }
    });
  };

  const selectCategory = (index) => {
    setSelectedCategoryIndex(index);
  };

  return (
    <VStack spacing={5} p={5} align="start" w="100%" border="1px solid aqua" color="white">
      <HeaderMain />
      <Text fontSize="2xl" mb={4}>
        Menu Creation Page
      </Text>
      <Box p={4} border="1px solid lime">
        <Text mb={4}>Menu:</Text>
        <Input
          placeholder="Menu Name"
          name="name"
          onChange={handleChange}
          value={state.name}
          mb={2}
        />
        <Input
          placeholder="Backend Name"
          name="backend_name"
          onChange={handleChange}
          value={state.backend_name}
          mb={4}
        />
        <Textarea
          placeholder="Description"
          name="description"
          onChange={handleChange}
          value={state.description}
          mb={4}
        />
        <Button onClick={addCategory} colorScheme="teal">+ Add Category</Button>
      </Box>
      <Textarea
        value={JSON.stringify(state, null, 2)}
        readOnly
        height="400px"
        overflowY="scroll"
        fontSize=".75em"
      />
      <VStack p={4} border="1px solid lime">
        {state.categories.map((category, index) => (
          <Box key={index} mb={4} p={3} borderWidth="1px" borderRadius="lg" onClick={() => selectCategory(index)}>
            <Text fontWeight="bold">{category.name || `Category ${index + 1}`}</Text>
            {selectedCategoryIndex === index && (
              <VStack spacing={2} mt={3}>
                <Input
                  placeholder="Category Name"
                  name="name"
                  value={category.name}
                  onChange={(e) => handleCategoryChange(e, index)}
                />
                <Input
                  placeholder="Backend Name"
                  name="backend_name"
                  value={category.backend_name}
                  onChange={(e) => handleCategoryChange(e, index)}
                />
                <Textarea
                  placeholder="Category Description"
                  name="description"
                  value={category.description}
                  onChange={(e) => handleCategoryChange(e, index)}
                />
              </VStack>
            )}
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};

export default MenuCreation;
