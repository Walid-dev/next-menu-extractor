import React, { useEffect, useState } from "react";
import _ from "lodash";

export default function Home() {
  const [headofficeId, setHeadofficeId] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [prefixToDelete, setPrefixToDelete] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchUrl = "https://www.mobi2go.com/api/1/headoffice/XXXX/menu?export"; // replace with your API URL

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const fetchMenus = () => {
    setFetching(true);
    fetch(fetchUrl.replace("XXXX", headofficeId))
      .then((res) => {
        if (!res.ok) throw new Error(`API Request failed with status ${res.status}`);
        return res.json();
      })
      .then((content) => {
        setMenuList(content.menus);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const handleSubmit = () => {
    setFetching(true);
    fetch(fetchUrl.replace("XXXX", headofficeId))
      .then((res) => {
        if (!res.ok) throw new Error(`API Request failed with status ${res.status}`);
        return res.json();
      })
      .then((content) => {
        const menus_to_copy = [selectedMenu.backend_name];

        const menus_to_keep = content.menus.filter((menu) => menus_to_copy.includes(menu.backend_name));
        const category_names_to_keep = _.union(...menus_to_keep.map((menu) => menu.categories));
        const categories_to_keep = content.categories.filter((category) =>
          category_names_to_keep.includes(category.backend_name)
        );

        const product_names_to_keep = _.union(...categories_to_keep.map((category) => category.products));
        const products_to_keep = content.products.filter((product) => product_names_to_keep.includes(product.backend_name));

        const modifier_group_names_to_keep = _.union(...products_to_keep.map((product) => product.modifier_groups));
        const modifier_groups_to_keep = content.modifier_groups.filter((modifier_group) =>
          modifier_group_names_to_keep.includes(modifier_group.backend_name)
        );

        const modifier_names_to_keep = _.union(...modifier_groups_to_keep.map((modifier_group) => modifier_group.modifiers));
        const modifiers_to_keep = content.modifiers.filter((modifier) => modifier_names_to_keep.includes(modifier.backend_name));

        const output = {
          menus: menus_to_keep.map((menu) => ({
            ...menu,
            backend_name: `${prefix}${menu.backend_name.replace(prefixToDelete, "")}`,
            categories: menu.categories.map((category) => `${prefix}${category.replace(prefixToDelete, "")}`),
          })),
          categories: categories_to_keep.map((category) => ({
            ...category,
            backend_name: `${prefix}${category.backend_name.replace(prefixToDelete, "")}`,
            products: category.products.map((product) => `${prefix}${product.replace(prefixToDelete, "")}`),
          })),
          products: products_to_keep.map((product) => ({
            ...product,
            backend_name: `${prefix}${product.backend_name.replace(prefixToDelete, "")}`,
            modifier_groups: product.modifier_groups.map(
              (modifier_group) => `${prefix}${modifier_group.replace(prefixToDelete, "")}`
            ),
          })),
          modifier_groups: modifier_groups_to_keep.map((modifier_group) => ({
            ...modifier_group,
            backend_name: `${prefix}${modifier_group.backend_name.replace(prefixToDelete, "")}`,
            modifiers: modifier_group.modifiers.map((modifier) => `${prefix}${modifier.replace(prefixToDelete, "")}`),
          })),
          modifiers: modifiers_to_keep.map((modifier) => ({
            ...modifier,
            backend_name: `${prefix}${modifier.backend_name.replace(prefixToDelete, "")}`,
          })),
        };

        setExtractedData(output);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (selectedMenu) fetchMenus();
  }, [selectedMenu]);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(extractedData, null, 2)], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${prefix}${selectedMenu.backend_name}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div>
      <h4>Menu Copy Tool</h4>

      <input
        id="headoffice-id"
        placeholder="Headoffice ID"
        value={headofficeId}
        onChange={(e) => setHeadofficeId(e.target.value)}
      />
      <button onClick={fetchMenus} disabled={fetching}>
        {fetching ? "Fetching..." : "Fetch Menus"}
      </button>

      {menuList.map((menu, index) => (
        <button key={index} onClick={() => handleMenuClick(menu)}>
          {menu.backend_name}
        </button>
      ))}

      {selectedMenu && (
        <div>
          <input
            id="prefix-to-delete"
            placeholder="Prefix to Delete"
            value={prefixToDelete}
            onChange={(e) => setPrefixToDelete(e.target.value)}
          />
          <input id="new-prefix" placeholder="New Prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
          <button onClick={handleSubmit} disabled={fetching}>
            {fetching ? "Processing..." : "Process Menu"}
          </button>
        </div>
      )}

      {extractedData && (
        <div>
          <h5>Modified Menu:</h5>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
          <button onClick={handleCopy}>{copied ? "Copied!" : "Copy Menu"}</button>
          <button onClick={handleDownload}>Download Menu</button>
        </div>
      )}
    </div>
  );
}
