// @ts-nocheck

import {
    Flex,
    Button
  } from "@chakra-ui/react";

const MenuList = ({ menuList, handleMenuClick, menuColors }) => {
    return (
        <Flex wrap="wrap" direction="row" spacing={2}>
            {menuList.map((menu, index) => (
                <Button
                    key={index}
                    colorScheme={menuColors[index]}
                    color="black"
                    size="xs"
                    m={1}
                    fontSize=".75em"
                    onClick={() => handleMenuClick(menu)}>
                    {menu.backend_name}
                </Button>
            ))}
        </Flex>
    );
};


export default MenuList;