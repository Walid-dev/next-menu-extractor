// src/utils/updatePricesFromExcel.ts
import { MenuData, Product, Modifier } from "@/types/MenuData"; // Assuming MenuData is in src/types/MenuData.ts
import { CustomModalTypes } from "@/components/Modals/CustomModal";

interface UpdatePricesFromExcelParams {
  excelData: any;
  originalData: any;
  setExtractedData: (data: any) => void;
  setErrorMessage: (message: string) => void;
  setIsCustomModalOpen: (isOpen: boolean) => void;
  setCustomModalType: (type: CustomModalTypes) => void;
}

/**
 * Updates product and modifier prices in the original data based on information from an Excel file.
 *
 * @param {UpdatePricesFromExcelParams} params - The parameters object.
 * @throws Will throw an error if no matching backend names are found in originalData and excelData.
 * @throws Will throw an error if no prices were updated.
 * @returns {MenuData | null} The updated product and modifier data, or null if an error occurs.
 */
const updatePricesFromExcel = ({
  excelData,
  originalData,
  setExtractedData,
  setErrorMessage,
  setIsCustomModalOpen,
  setCustomModalType,
}: UpdatePricesFromExcelParams): MenuData | null => {
  try {
    // Deep clone the originalData to avoid mutation
    const updatedData = JSON.parse(JSON.stringify(originalData)) as MenuData;
    let countProductPricesUpdated = 0;
    let countModifierPricesUpdated = 0;
    let productTierCounter = 0;
    let modifierTierCounter = 0;

    // Iterate through products and update their prices
    updatedData.products.forEach((product: Product, index: number) => {
      const excelProduct = excelData.Products.find((p: any) => p["Backend Name"] === product.backend_name);

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
    updatedData.modifiers.forEach((modifier: Modifier, index: number) => {
      const excelModifier = excelData.Modifiers.find((m: any) => m["Backend Name"] === modifier.backend_name);

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
      setErrorMessage("Unable to find matching items. Ensure Excel data and menu name are correct.");
      setIsCustomModalOpen(true);
      setCustomModalType(CustomModalTypes.Warning);
      return null;
    }

    // Set success message and modal type
    const successMessage = `Successfully updated prices for: ${countProductPricesUpdated} products, ${productTierCounter} product tiers, ${countModifierPricesUpdated} modifiers, ${modifierTierCounter} modifier tiers.`;
    setErrorMessage(successMessage);
    setIsCustomModalOpen(true);
    setCustomModalType(CustomModalTypes.Info);

    return updatedData;
  } catch (error: any) {
    // Handle error scenarios
    // setExtractedData(null);
    setErrorMessage(`Failed to update prices from Excel: ${error.message}`);
    setIsCustomModalOpen(true);
    setCustomModalType(CustomModalTypes.Error);
    return null;
  }
};

export default updatePricesFromExcel;
