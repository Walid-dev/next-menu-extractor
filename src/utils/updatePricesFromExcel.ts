// @ts-nocheck

const updatePricesFromExcel = ({ excelData, originalData, setExtractedData, setErrorMessage, setIsSimpleModalOpen }) => {
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

      // update product tier prices
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

      // update modifier tier prices
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

    console.log(`Updated prices for ${countProductPricesUpdated} products and ${productTierCounter} product tiers.`);
    console.log(`Updated prices for ${countModifierPricesUpdated} modifier tiers and ${modifierTierCounter} modifier tiers.`);

    return updatedData;
    
  } catch (error) {
    setExtractedData(null);
    setErrorMessage("Failed to update prices from Excel: " + error.message);
    setIsSimpleModalOpen(true);
  }
};

export default updatePricesFromExcel;
