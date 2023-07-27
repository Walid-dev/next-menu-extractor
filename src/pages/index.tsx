// @ts-nocheck

import React, { useEffect, useState, useRef } from "react";
import _ from "lodash";
import * as XLSX from "xlsx";
import "../style/main.css";
import fetchData from "@/api/fetchData";
import SimpleModal from "@/components/Modals/SimpleModal/SimpleModal";

export default function Home() {
  const [headofficeId, setHeadofficeId] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenuName, setSelectedMenuName] = useState("");
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [prefixToDelete, setPrefixToDelete] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const fetchUrl = "https://www.mobi2go.com/api/1/headoffice/XXXX/menu?export";

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const fetchMenus = () => {
    setFetching(true);
    setExtractedData(null);
    setUpdatedData(null);
    fetchData(headofficeId)
      .then((content) => {
        setMenuList(content.menus);
      })
      .catch((error) => {
        setIsSimpleModalOpen(true);
        setErrorMessage("Fetching menus: " + error.message);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const handleSubmit = () => {
    setSubmitting(true);
    fetchData(headofficeId)
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

        const extractedData = {
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

        setExtractedData(extractedData);
        setSelectedMenuName(extractedData.menus[0].backend_name);
      })
      .catch((error) => {
        setIsSimpleModalOpen(true);
        setErrorMessage("Failed to extract menu: " + error.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleCopy = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (selectedMenu) fetchMenus();
  }, [selectedMenu]);

  const handleDownload = (data) => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${prefix}${selectedMenu.backend_name}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const generateExcel = (data) => {
    try {
      let products = [];
      let modifiers = [];

      // extract product prices and tier prices
      for (const product of data.products) {
        let productData = {
          Name: product.name,
          "Backend Name": product.backend_name,
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
          Name: modifier.name,
          "Backend Name": modifier.backend_name,
          Price: modifier.price,
        };
        // add tier prices to modifier data
        for (let i = 0; i < modifier.property_tiers.length; i++) {
          modifierData[`Tier ${i + 1} Price`] = modifier.property_tiers[i].price;
        }
        modifiers.push(modifierData);
      }

      // create workbook
      const wb = XLSX.utils.book_new();

      // add products sheet
      const productsSheet = XLSX.utils.json_to_sheet(products);
      XLSX.utils.book_append_sheet(wb, productsSheet, "Products");

      // add modifiers sheet
      const modifiersSheet = XLSX.utils.json_to_sheet(modifiers);
      XLSX.utils.book_append_sheet(wb, modifiersSheet, "Modifiers");

      // generate and download the file
      XLSX.writeFile(wb, `${selectedMenuName}.xlsx`);
    } catch (error) {
      setErrorMessage("Failed to generate Excel: " + error.message);
      setIsSimpleModalOpen(true);
    }
  };

  const handleDownloadExcelPricesFile = (data) => {
    generateExcel(data);
  };

  const updatePricesFromExcel = (excelData, originalData) => {
    try {
      // Check if there are any matching backend names in products and modifiers
      const matchingProducts = originalData.products.some((product) =>
        excelData.Products.some((excelProduct) => excelProduct["Backend Name"] === product.backend_name)
      );

      const matchingModifiers = originalData.modifiers.some((modifier) =>
        excelData.Modifiers.some((excelModifier) => excelModifier["Backend Name"] === modifier.backend_name)
      );

      if (!matchingProducts && !matchingModifiers) {
        setIsSimpleModalOpen(true);
        setErrorMessage(
          "No matching products or modifiers found in the uploaded data. Please verify if you uploaded the correct menu"
        );
        throw new Error(
          "No matching products or modifiers found in the uploaded data. Please verify if you uploaded the correct menu."
        );
      }

      const updatedData = { ...originalData }; // clone originalData to avoid mutation
      let countProductPricesUpdated = 0;
      let countModifierPricesUpdated = 0;
      let productTierCounter = 0;
      let modifierTierCounter = 0;

      // update product prices
      for (let product of updatedData.products) {
        const excelProduct = excelData.Products.find((p) => p["Backend Name"] === product.backend_name);
        if (excelProduct && excelProduct.Price !== product.price) {
          product.price = excelProduct.Price;
          countProductPricesUpdated++;
        }

        // update tier prices
        for (let i = 0; i < product.property_tiers.length; i++) {
          const newTierPrice = excelProduct[`Tier ${i + 1} Price`];
          if (excelProduct && newTierPrice !== product.property_tiers[i].price) {
            product.property_tiers[i].price = newTierPrice;
            productTierCounter++;
          }
        }
      }

      // update modifier prices
      for (let modifier of updatedData.modifiers) {
        const excelModifier = excelData.Modifiers.find((m) => m["Backend Name"] === modifier.backend_name);
        if (excelModifier && excelModifier.Price !== modifier.price) {
          modifier.price = excelModifier.Price;
          countModifierPricesUpdated++;
        }

        // update tier prices
        for (let i = 0; i < modifier.property_tiers.length; i++) {
          const newTierPrice = excelModifier[`Tier ${i + 1} Price`];
          if (excelModifier && newTierPrice !== modifier.property_tiers[i].price) {
            modifier.property_tiers[i].price = newTierPrice;
            modifierTierCounter++;
          }
        }
      }

      if (countProductPricesUpdated === 0 && countModifierPricesUpdated === 0) {
        setIsSimpleModalOpen(true);
        setErrorMessage("No prices were updated. Please verify if the data in the Excel file matches the existing data.");
        throw new Error("No prices were updated. Please verify if the data in the Excel file matches the existing data.");
      }

      console.log(`Updated prices for ${countProductPricesUpdated} products and ${countModifierPricesUpdated} modifiers.`);
      console.log(`Updated tier prices for ${productTierCounter} product tiers and ${modifierTierCounter} modifier tiers.`);

      return updatedData;
    } catch (error) {
      setExtractedData(null);
      setErrorMessage("Failed to update prices from Excel: " + error.message);
      setIsSimpleModalOpen(true);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // Check that file exists and is of the correct type
    if (!file || !(file instanceof Blob)) {
      console.error("No file selected, or selected file is not a Blob or File object");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const productsSheet = workbook.Sheets[workbook.SheetNames[0]];
      const modifiersSheet = workbook.Sheets[workbook.SheetNames[1]];

      const productsData = XLSX.utils.sheet_to_json(productsSheet);
      const modifiersData = XLSX.utils.sheet_to_json(modifiersSheet);

      const updatedData = updatePricesFromExcel({ Products: productsData, Modifiers: modifiersData }, _.cloneDeep(extractedData));
      // setExtractedData(_.cloneDeep(updatedData));
      setUpdatedData(_.cloneDeep(updatedData));
    };
    reader.readAsArrayBuffer(file);
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
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Processing..." : "Process Menu"}
          </button>
        </div>
      )}
      <div className="json-data-container">
        {extractedData && (
          <div>
            <h5>Modified Menu:</h5>
            <h3>{selectedMenuName}</h3>
            <button onClick={() => handleCopy(extractedData)}>{copied ? "Copied!" : "Copy Menu"}</button>
            <button onClick={() => handleDownload(extractedData)}>Download Menu</button>
            <button onClick={() => handleDownloadExcelPricesFile(extractedData)}>Download Excel</button>
            <input type="file" id="excel-upload" accept=".xlsx" onChange={handleFileUpload} />
            <pre>{JSON.stringify(extractedData, null, 2)}</pre>
          </div>
        )}
        {updatedData && (
          <div>
            <h5>Price Updated Menu:</h5>
            <h3>{selectedMenuName}</h3>
            <button onClick={() => handleCopy(updatedData)}>{copied ? "Copied!" : "Copy Menu"}</button>
            <button onClick={() => handleDownload(updatedData)}>Download Menu</button>
            <pre>{JSON.stringify(updatedData, null, 2)}</pre>
          </div>
        )}
      </div>
      <SimpleModal
        isOpen={isSimpleModalOpen}
        message={errorMessage}
        type={Error}
        handleClose={() => {
          setIsSimpleModalOpen(false);
          setErrorMessage("");
        }}
      />
    </div>
  );
}
