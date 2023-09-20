// @ts-nocheck
import getRandomColor from "./getRandomColor";

const assignMenuColors = (menus) => {
  const newMenuColors = {};
  menus.forEach((menu, index) => {
    // Using index as a unique identifier.
    newMenuColors[index] = getRandomColor();
  });
  return newMenuColors;
};

export default assignMenuColors;
