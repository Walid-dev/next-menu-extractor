// @ts-nocheck

import React, { useEffect, useState, useRef } from "react";
// Update the import path to the correct location
import _ from "lodash";
import "../style/main.css";
// Components
import SimpleModal from "@/components/Modals/SimpleModal/SimpleModal";
import HeaderMain from "../components/Header/HeaderMain";
import TypewriterEffect from "@/components/Effects/TypewriterEffect";
import ActionHoverButton from "../components/Buttons/ActionHoverButton";
import Mobi2GoStorefront from "@/components/Embed/Mobi2goStorefront";
import MenuSearch from "@/components/Search/MenusSearch";
import updatePricesFromExcel from "@/utils/updatePricesFromExcel";

// Chakra
import { Flex, VStack, HStack, Heading, Input, Button, ButtonGroup, Stack, Code, Box, InputGroup } from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
// Utils
import fetchData from "@/api/fetchData";
import assignMenuColors from "@/utils/assignMenuColors";
import generateExcel from "@/utils/generateExcel";
import handleCopy from "@/utils/handleCopy";
import { handleExcelFileUpload } from "@/utils/excelUtils";
// Types
import { SimpleModalType } from "@/components/Modals/SimpleModal/SimpleModal";
import { calcLength } from "framer-motion";

export default function Home() {
  const [headofficeId, setHeadofficeId] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenuName, setSelectedMenuName] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [prefixToDelete, setPrefixToDelete] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [menuColors, setMenuColors] = useState({});
  const [simpleModalType, setSimpleModalType] = useState(SimpleModalType.Info);

  const [hoveredText, setHoveredText] = useState<string | null>(null);

  const [task, setTask] = useState(null);

  // const fetchUrl = "https://www.mobi2go.com/api/1/headoffice/XXXX/menu?export";

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const fetchMenus = () => {
    setFetching(true);
    setExtractedData(null);
    setUpdatedData(null);
    fetchData(headofficeId)
      .then((content) => {
        setMenuList(content.menus);
        // This is your new menu color assignment code.
        if (Object.keys(menuColors).length === 0) {
          const newColors = assignMenuColors(content.menus);
          setMenuColors(newColors);
        }
      })
      .catch((error) => {
        setSimpleModalType(SimpleModalType.Warning);
        setIsSimpleModalOpen(true);
        setErrorMessage("Fetching menus: " + error.message);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const handleSubmit = () => {
    setSubmitting(true);

    fetchData(headofficeId)
      .then((content) => {
        const menus_to_copy = [selectedMenu.backend_name];
        const menus_to_keep = content.menus.filter((menu) => menus_to_copy.includes(menu.backend_name));
        const category_names_to_keep = _.union(...menus_to_keep.map((menu) => menu.categories));
        const categories_to_keep = content.categories.filter((category) =>
          category_names_to_keep.includes(category.backend_name)
        );

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
        setIsSimpleModalOpen(true);
        setErrorMessage("Failed to extract menu: " + error.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    if (selectedMenu) fetchMenus();
  }, [selectedMenu]);

  const handleDownload = (data) => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data, null, 2)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${prefix}${selectedMenu.backend_name}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const handleDownloadExcelPricesFile = (data) => {
    generateExcel(data, selectedMenuName, setErrorMessage, setIsSimpleModalOpen, setSimpleModalType);
    console.log("generated");
  };

  const handleFileUpload = (event) => {
    handleExcelFileUpload(
      event,
      setUpdatedData,
      extractedData,
      setExtractedData,
      setErrorMessage,
      setSimpleModalType,
      setIsSimpleModalOpen
    );
  };

  return (
    <VStack spacing={5} p={5} align="start" w="100%">
      <HeaderMain task={task} setTask={setTask} />

      <MenuSearch fetchMenus={fetchMenus} fetching={fetching} headofficeId={headofficeId} setHeadofficeId={setHeadofficeId} />

      {menuList.length > 0 && <TypewriterEffect text="Select a menu" speed={60} />}

      <Stack direction="row" spacing={2} maxW="780px" maxH="55vh" scrollBehavior="smooth" overflowY="scroll">
        <Flex wrap="wrap" direction="row" spacing={2}>
          {menuList.map((menu, index) => (
            <Button
              key={index}
              colorScheme={menuColors[index]}
              color="black"
              size="xs"
              m={1}
              fontSize=".75em"
              onClick={() => handleMenuClick(menu)}>
              {menu.backend_name}
            </Button>
          ))}
        </Flex>
      </Stack>

      {selectedMenu && (
        <VStack spacing={3} w="full" align="start">
          <Box minH="50px">
            <TypewriterEffect text="Adjust prefixes for duplication or hit Process for price update" speed={50} />
          </Box>
          <HStack spacing="18px">
            <Input
              id="new-prefix"
              size="xs"
              bg="mobiColor"
              color="black"
              maxW="300px"
              placeholder="Enter New Prefix"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
            />
            <Input
              id="prefix-to-delete"
              size="xs"
              bg="mobiColor"
              color="black"
              maxW="300px"
              placeholder="Enter Prefix to Delete"
              value={prefixToDelete}
              onChange={(e) => setPrefixToDelete(e.target.value)}
            />
          </HStack>

          <Button
            onClick={handleSubmit}
            isLoading={submitting}
            mt="1em"
            size="sm"
            fontSize="xs"
            colorScheme="transparent"
            color="white"
            border="1px solid #02f9f9">
            Process
          </Button>
        </VStack>
      )}
      <Stack direction={["column", "row"]} spacing="24px">
        {extractedData && (
          <VStack spacing={4} w="full" alignItems="start">
            <Box minH="50px">
              <TypewriterEffect text="Download/copy menu or upload Excel file to update prices" speed={70} />
            </Box>
            <Heading as="h6" size="sm" color="#ffffff">
              {selectedMenuName}
            </Heading>
            <ButtonGroup>
              <ActionHoverButton
                buttonText={copied ? "Copied!" : "Copy Menu"}
                onButtonClick={() => handleCopy(extractedData, setCopied)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs"
                isCopied={copied}
                onMouseEnter={() => setHoveredText("Copy raw Json menu")}
                onMouseLeave={() => setHoveredText(null)}
              />

              <ActionHoverButton
                buttonText="Download Menu"
                onButtonClick={() => handleDownload(extractedData)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs"
                onMouseEnter={() => setHoveredText("Download menu as a Json file")}
                onMouseLeave={() => setHoveredText(null)}
              />

              <ActionHoverButton
                buttonText="Download Excel"
                onButtonClick={() => handleDownloadExcelPricesFile(extractedData)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs"
                onMouseEnter={() => setHoveredText("Download menu as an Excel file")}
                onMouseLeave={() => setHoveredText(null)}
              />
            </ButtonGroup>
            <InputGroup size="md">
              <Input
                type="file"
                id="excel-upload"
                accept=".xlsx"
                onChange={handleFileUpload}
                style={{ display: "none" }} // Hide the default input
              />
              <label htmlFor="excel-upload">
                <Button
                  as="span"
                  rightIcon={<AttachmentIcon />}
                  size="sm"
                  colorScheme="transparent"
                  color="white"
                  border="1px solid #02f9f9">
                  Choose File to update prices
                </Button>
              </label>
            </InputGroup>

            <Box minH="50px">{hoveredText && <TypewriterEffect text={hoveredText} />}</Box>

            <Box as="pre" p={4} bg="gray.100" rounded="md" maxW="520px" maxH="45vh" scrollBehavior="smooth" overflowY="scroll">
              <Code display="block" whiteSpace="pre-wrap" fontSize="10px">
                {JSON.stringify(extractedData, null, 2)}
              </Code>
            </Box>
          </VStack>
        )}

        {updatedData && (
          <VStack spacing={4} w="full" alignItems="start">
            <Box minH="30px">
              <TypewriterEffect text="Goog job 🙌 You can now download or copy your menu with prices updated" speed={70} />
            </Box>
            <Heading as="h6" size="sm" color="#fffff">
              {selectedMenuName}
            </Heading>

            <ButtonGroup>
              <Button
                onClick={() => handleCopy(updatedData, setCopied)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs">
                {copied ? "Copied!" : "Copy Menu"}
              </Button>
              <Button onClick={() => handleDownload(updatedData)} colorScheme="mobiColor" color="black" size="sm" fontSize="xs">
                Download Menu
              </Button>
              <Button
                onClick={() => handleDownloadExcelPricesFile(updatedData)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs">
                Download Excel
              </Button>
            </ButtonGroup>

            <Button
              onClick={() => console.log("will display updated details")}
              as="span"
              rightIcon={<AttachmentIcon />}
              size="sm"
              colorScheme="green"
              variant="outline">
              Details
            </Button>

            <Box minH="50px"></Box>

            <Box as="pre" p={4} bg="gray.100" rounded="md" maxW="520px" maxH="45vh" scrollBehavior="smooth" overflowY="scroll">
              <Code display="block" whiteSpace="pre-wrap" fontSize="10px">
                {JSON.stringify(updatedData, null, 2)}
              </Code>
            </Box>
          </VStack>
        )}
      </Stack>

      {isSimpleModalOpen && (
        <SimpleModal
          isOpenInitially={isSimpleModalOpen}
          modalType={simpleModalType}
          modalTitle="Perform action title"
          modalMessage={errorMessage}
          onCloseModal={() => setIsSimpleModalOpen(false)}
        />
      )}
    </VStack>
  );
}
