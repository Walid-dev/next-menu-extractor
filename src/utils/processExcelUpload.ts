// @ts-nocheck

import React from "react";
import { readExcelData } from "./excelUtils"; // Import the utility function
import _ from "lodash";

/**
 * Handles the upload of an Excel file and processes its data.
 *
 * @param {Event} event - The upload event object.
 * @param {Function} setUpdatedData - State setter function for the updated data.
 * @param {Object} extractedData - The initial data before the update.
 * @param {Function} setErrorMessage - State setter function for any error messages.
 * @param {Function} setSimpleModalType - State setter function for the modal type.
 * @param {Function} setIsSimpleModalOpen - State setter function for the modal visibility.
 */

const processExcelUpload = (event, setUpdatedData, extractedData, setErrorMessage, setSimpleModalType, setIsSimpleModalOpen) => {
  // Get the file from the event object
  const file = event.target.files[0];

  // Validate the file
  if (!file || !(file instanceof Blob)) {
    console.error("No file selected, or selected file is not a Blob or File object");
    return;
  }

  // Create a FileReader to read the file
  const reader = new FileReader();

  // Define what happens when the file is successfully read
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);

    // Use the utility function to read and parse the Excel data
    const excelData = readExcelData(data);

    // Update the prices and other data based on the Excel file
    const updatedData = updatePricesFromExcel({
      excelData,
      originalData: _.cloneDeep(extractedData),
      setExtractedData,
      setErrorMessage,
      setSimpleModalType,
      setIsSimpleModalOpen,
    });

    // Update the state with the new data
    setUpdatedData(_.cloneDeep(updatedData));
  };

  // Start reading the file
  reader.readAsArrayBuffer(file);
};

export default processExcelUpload;
