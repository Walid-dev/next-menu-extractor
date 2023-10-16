// @ts-nocheck

import { SimpleModalType } from "@/components/Modals/SimpleModal/SimpleModal";
/**
 * Updates product and modifier prices in the original data based on information from an Excel file.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.excelData - The data extracted from the Excel file.
 * @param {Object} params.originalData - The original product and modifier data.
 * @param {Function} params.setExtractedData - Function to set the extracted data.
 * @param {Function} params.setErrorMessage - Function to set the error message.
 * @param {Function} params.setIsSimpleModalOpen - Function to open/close the modal.
 * @param {Function} params.setSimpleModalType - Function to set the modal type.
 *
 * @throws Will throw an error if no matching backend names are found in originalData and excelData.
 * @throws Will throw an error if no prices were updated.
 *
 * @returns {Object} The updated product and modifier data.
 */
const updatePricesFromExcel = ({
  excelData,
  originalData,
  setExtractedData,
  setErrorMessage,
  setIsSimpleModalOpen,
  setSimpleModalType,
}) => {
  try {
    // Deep clone the originalData to avoid mutation
    const updatedData = JSON.parse(JSON.stringify(originalData));
    let countProductPricesUpdated = 0;
    let countModifierPricesUpdated = 0;
    let productTierCounter = 0;
    let modifierTierCounter = 0;

    // Iterate through products and update their prices
    updatedData.products.forEach((product, index) => {
      const excelProduct = excelData.Products.find((p) => p["Backend Name"] === product.backend_name);

      // Update main product price
      if (excelProduct && excelProduct.Price !== product.price) {
        updatedData.products[index].price = excelProduct.Price;
        countProductPricesUpdated++;
      }

      // Update individual tier prices for the product
      product.property_tiers.forEach((tier, tierIndex) => {
        const newTierPrice = excelProduct[`Tier ${tierIndex + 1} Price`];
        if (newTierPrice !== tier.price) {
          updatedData.products[index].property_tiers[tierIndex].price = newTierPrice;
          productTierCounter++;
        }
      });
    });

    // Iterate through modifiers and update their prices
    updatedData.modifiers.forEach((modifier, index) => {
      const excelModifier = excelData.Modifiers.find((m) => m["Backend Name"] === modifier.backend_name);

      // Update main modifier price
      if (excelModifier && excelModifier.Price !== modifier.price) {
        updatedData.modifiers[index].price = excelModifier.Price;
        countModifierPricesUpdated++;
      }

      // Update individual tier prices for the modifier
      modifier.property_tiers.forEach((tier, tierIndex) => {
        const newTierPrice = excelModifier[`Tier ${tierIndex + 1} Price`];
        if (newTierPrice !== tier.price) {
          updatedData.modifiers[index].property_tiers[tierIndex].price = newTierPrice;
          modifierTierCounter++;
        }
      });
    });

    // Validate if any prices were updated
    if (countProductPricesUpdated === 0 && countModifierPricesUpdated === 0) {
      setErrorMessage("No prices were updated. Verify the Excel data.");
      setIsSimpleModalOpen(true);
      setSimpleModalType(SimpleModalType.Error);
      return null;
    }

    // Set success message and modal type
    const successMessage = `Updated prices for ${countProductPricesUpdated} products and ${productTierCounter} product tiers. Updated prices for ${countModifierPricesUpdated} modifiers and ${modifierTierCounter} modifier tiers.`;
    setErrorMessage(successMessage);
    setIsSimpleModalOpen(true);
    setSimpleModalType(SimpleModalType.Info);

    return updatedData;
  } catch (error) {
    // Handle error scenarios
    setExtractedData(null);
    setErrorMessage(`Failed to update prices from Excel: ${error.message}`);
    setIsSimpleModalOpen(true);
    setSimpleModalType(SimpleModalType.Error);
    return null;
  }
};

export default updatePricesFromExcel;
