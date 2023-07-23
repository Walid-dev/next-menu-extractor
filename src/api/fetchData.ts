const fetchUrl = "https://www.mobi2go.com/api/1/headoffice/XXXX/menu?export";

// This function is responsible for fetching data from the API
const fetchData = async (headofficeId: string): Promise<any> => {
  const res = await fetch(fetchUrl.replace("XXXX", headofficeId));
  if (!res.ok) throw new Error(`API Request failed with status ${res.status}`);
  const content = await res.json();
  return content;
};

export default fetchData;
