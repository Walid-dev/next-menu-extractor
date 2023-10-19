
// @ts-nocheck

// @ts-nocheck
import _ from "lodash";
import fetchData from "@/api/fetchData";

/**
 * Handle extraction of menus and related entities.
 *
 * @param {Object} params - The parameters.
 * @param {string} params.headofficeId - The ID of the headoffice.
 * @param {string} params.prefix - Prefix to be added to backend names.
 * @param {string} params.prefixToDelete - Prefix to be removed from backend names.
 * @param {Function} params.setExtractedData - Setter for extracted data.
 * @param {Object} params.selectedMenu - Selected menu information.
 * @param {Function} params.setSelectedMenuName - Setter for selected menu name.
 * @param {Function} params.setSubmitting - Setter for submitting state.
 * @param {Function} params.setIsCustomModalOpen - Setter for modal open state.
 * @param {Function} params.setErrorMessage - Setter for error message.
 */
const fetchAndExtractMenus = ({
  headofficeId,
  prefix,
  prefixToDelete,
  setExtractedData,
  selectedMenu,
  setSelectedMenuName,
  setSubmitting,
  setIsCustomModalOpen,
  setErrorMessage,
}) => {
  fetchData(headofficeId)
    .then((content) => {
      const menus_to_copy = [selectedMenu.backend_name];
      const menus_to_keep = content.menus.filter((menu) => menus_to_copy.includes(menu.backend_name));
      const category_names_to_keep = _.union(...menus_to_keep.map((menu) => menu.categories));
      const categories_to_keep = content.categories.filter((category) => category_names_to_keep.includes(category.backend_name));

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
      setIsCustomModalOpen(true);
      setErrorMessage("Failed to extract menu: " + error.message);
    })
    .finally(() => {
      setSubmitting(false);
    });
};

export default fetchAndExtractMenus;