import { useReducer, useRef } from "react";
import MenuReducer, { INITIAL_SINGLE_MENU_STATE } from "@/reducer/MenuReducer";
import HeaderMain from "@/components/Header/HeaderMain";
import { Box, Text, VStack, Textarea, Button, Input } from "@chakra-ui/react";

const MenuCreation = () => {
  const [state, dispatch] = useReducer(MenuReducer, INITIAL_SINGLE_MENU_STATE);
  const tagRef = useRef<any>();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    dispatch({ type: "CHANGE_MENU_INPUT", payload: { name: e.target.name, value: e.target.value } });
  };

  const handleCategoryChange = (e: { target: { name: any; value: any } }) => {
    dispatch({ type: "CHANGE_CATEGORY_INPUT", payload: { name: e.target.name, value: e.target.value } });
  };

  const addCategory = () => {
    // Logic to add a category can be added here
    dispatch( {type: "ADD_CATEGORY", payload: {}})
  };



  const handleCategoryChange2 = (e: { target: { name: any; value: any } }, index: number) => {
    dispatch({ 
      type: "UPDATE_CATEGORY", 
      payload: {
        index: index,
        data: { [e.target.name]: e.target.value }
      }
    });
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
        value={JSON.stringify(state, null, 2)} // Display the menu JSON in a formatted manner
        readOnly // This is just for display, so no need for it to be editable
        height="400px"
        overflowY="scroll"
        fontSize=".75em"
      />
      <Box p={4} border="1px solid lime">
        {state.categories.map((category: any, index: number) => (
          <VStack key={index} spacing={4}>
            <Input
              placeholder="Category Name"
              name="name"
              value={category.name}
              onChange={(e) => handleCategoryChange2(e, index)}
            />
            <Input
              placeholder="Backend Name"
              name="backend_name"
              value={category.backend_name}
              onChange={(e) => handleCategoryChange2(e, index)}
            />
            <Textarea
              placeholder="Category Description"
              name="description"
              value={category.description}
              onChange={(e) => handleCategoryChange2(e, index)}
            />
          </VStack>
        ))}
        <Button onClick={addCategory} colorScheme="teal">+ Add Category</Button>
      </Box>
    </VStack>
  );
  
};

export default MenuCreation;
