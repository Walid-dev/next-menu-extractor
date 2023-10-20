// @ts-nocheck

import TypewriterEffect from "../Effects/TypewriterEffect";
import { Flex, Button } from "@chakra-ui/react";

/**
 * `MenuList` is a component that displays a list of menu buttons.
 * Each button corresponds to a menu item and uses a color scheme derived from `menuColors`.
 *
 * @component
 * @param {Object[]} menuList - List of menus. Each menu should have a `backend_name` property.
 * @param {function} handleMenuClick - Callback function when a menu button is clicked.
 * @param {string[]} menuColors - Array of color schemes for each menu button.
 *
 * @returns {React.Element} - Rendered `MenuList` component.
 */
const MenuList = ({ menuList, handleMenuClick, menuColors }) => {
  return (
    <Flex wrap="wrap" direction="row" spacing={2} pb="20px">
      {menuList.length > 0 && <TypewriterEffect text="Select a menu" speed={40} />}

      {menuList.map((menu, index) => (
        <Button
          key={index}
          colorScheme={menuColors[index]}
          color="black"
          size="xs"
          m={1}
          fontSize=".75em"
          onClick={() => handleMenuClick(menu)}
          _focus={{
            outline: "none",
            borderColor: "#02f9f9",
            borderWidth: "2px",
          }}
          _active={{
            borderColor: "#02f9f9",
            borderWidth: "2px",
          }}>
          {menu.backend_name}
        </Button>
      ))}
    </Flex>
  );
};

export default MenuList;
