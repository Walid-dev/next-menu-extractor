// @ts-nocheck

import React, { useEffect, useState, useRef } from "react";
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

  // Create a ref for our script
  const scriptRef = useRef(null);

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

  const generateExcel = (data) => {
    let products = [];
    let modifiers = [];

    // extract product prices and tier prices
    for (const product of data.products) {
      let productData = {
        Name: product.backend_name,
        Price: product.price,
      };
      // add tier prices to product data
      for (let i = 0; i < product.property_tiers.length; i++) {
        productData[`Tier ${i + 1} Price`] = product.property_tiers[i].price;
      }
      products.push(productData);
    }

    // extract modifier prices and tier prices
    for (const modifier of data.modifiers) {
      let modifierData = {
        Name: modifier.backend_name,
        Price: modifier.price,
      };
      // add tier prices to modifier data
      for (let i = 0; i < modifier.property_tiers.length; i++) {
        modifierData[`Tier ${i + 1} Price`] = modifier.property_tiers[i].price;
      }
      modifiers.push(modifierData);
    }

    // create workbook
    const wb = window.XLSX.utils.book_new();

    // add products sheet
    const productsSheet = window.XLSX.utils.json_to_sheet(products);
    window.XLSX.utils.book_append_sheet(wb, productsSheet, "Products");

    // add modifiers sheet
    const modifiersSheet = window.XLSX.utils.json_to_sheet(modifiers);
    window.XLSX.utils.book_append_sheet(wb, modifiersSheet, "Modifiers");

    // generate and download the file
    window.XLSX.writeFile(wb, "output.xlsx");
  };

  // Add the SheetJS library to our page
  useEffect(() => {
    scriptRef.current = document.createElement("script");
    scriptRef.current.src = "https://unpkg.com/xlsx/dist/xlsx.full.min.js";
    scriptRef.current.async = true;
    document.body.appendChild(scriptRef.current);

    // Remove the script on component unmount
    return () => {
      document.body.removeChild(scriptRef.current);
    };
  }, []);

  const handleDownloadExcelPricesFile = () => {
    generateExcel(extractedData);
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
          <button onClick={handleCopy}>{copied ? "Copied!" : "Copy Menu"}</button>
          <button onClick={handleDownload}>Download Menu</button>
          <button onClick={handleDownloadExcelPricesFile}>Download Excel</button>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
