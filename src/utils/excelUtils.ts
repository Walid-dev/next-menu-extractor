// @ts-nocheck

// excelUtils.ts
import * as XLSX from "xlsx";
import _ from "lodash";
import updatePricesFromExcel from "./updatePricesFromExcel"; // Replace with the actual path

/**
 * Reads Excel data and processes it to update prices.
 *
 * @param {Event} event - The upload event object.
 * @param {Function} setUpdatedData - State setter function for the updated data.
 * @param {Object} extractedData - The initial data before the update.
 * @param {Function} setErrorMessage - State setter function for any error messages.
 * @param {Function} setCustomModalType - State setter function for the modal type.
 * @param {Function} setIsCustomModalOpen - State setter function for the modal visibility.
 */
export const handleExcelFileUpload = (
  event,
  setUpdatedData,
  extractedData,
  setExtractedData,
  setErrorMessage,
  setCustomModalType,
  setIsCustomModalOpen
) => {
  const file = event.target.files[0];

  // Check for valid file
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

    const updatedData = updatePricesFromExcel({
      excelData: { Products: productsData, Modifiers: modifiersData },
      originalData: _.cloneDeep(extractedData),
      setExtractedData,
      setErrorMessage,
      setCustomModalType,
      setIsCustomModalOpen,
    });

    setUpdatedData(_.cloneDeep(updatedData));
  };

  reader.readAsArrayBuffer(file);
};
