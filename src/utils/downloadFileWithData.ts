// Constants for MIME types can be extracted and reused
const PLAIN_TEXT_MIME_TYPE = "text/plain";

/**
 * I handle downloading a file with given data.
 *
 * @param {Object} data - The data to be written to the file.
 * @param {string} fileName - The name of the file to download.
 * @return {void}
 */
export const downloadFileWithData = (data: any, fileName: string = "menu"): void => {
  const element = document.createElement("a");

  // I create a blob out of the data passed in
  const fileBlob = new Blob([JSON.stringify(data, null, 2)], {
    type: PLAIN_TEXT_MIME_TYPE,
  });

  // I create an object URL for the blob
  element.href = URL.createObjectURL(fileBlob);

  // I set the desired file name for download
  element.download = fileName;

  // I append the element to the DOM (required for Firefox)
  document.body.appendChild(element);

  // I programmatically click the link to trigger the download
  element.click();

  // I remove the element from the DOM
  document.body.removeChild(element);
};
