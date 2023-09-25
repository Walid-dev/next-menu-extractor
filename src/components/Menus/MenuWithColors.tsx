// @ts-nocheck

const MenuWithColors = ({ menus, menuColors }) => {
  return (
    <div>
      {menus.map((menu, index) => (
        <div key={index} style={{ backgroundColor: menuColors[index] }}>
          {menu.name}
        </div>
      ))}
    </div>
  );
};

export default MenuWithColors;