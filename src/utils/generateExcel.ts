// @ts-nocheck

import * as XLSX from "xlsx";
import { CustomModalTypes } from "@/components/Modals/CustomModal";

const generateExcel = (data, newMenuName, setErrorMessage, setIsCustomModalOpen, setCustomModalType) => {
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
    XLSX.writeFile(wb, `${newMenuName}.xlsx`);
  } catch (error) {
    setIsCustomModalOpen(true);
    setCustomModalType(CustomModalTypes.Error);
    setErrorMessage("Failed to generate Excel: " + error.message);
  }
};

export default generateExcel;
