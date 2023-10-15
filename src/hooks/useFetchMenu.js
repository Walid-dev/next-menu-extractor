// useFetchMenus.js

import { useState, useEffect } from "react";
import fetchData from "@/api/fetchData";

export function useFetchMenus(headofficeId) {
  const [menuList, setMenuList] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!headofficeId) return;

    setFetching(true);
    fetchData(headofficeId)
      .then((content) => {
        setMenuList(content.menus);
      })
      .catch((error) => {
        setErrorMessage("Fetching menus: " + error.message);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [headofficeId]);

  return { menuList, fetching, errorMessage };
}
