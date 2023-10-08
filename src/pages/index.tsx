// @ts-nocheck

import React, { useEffect, useState, useRef } from "react";
// Update the import path to the correct location
import _ from "lodash";
import * as XLSX from "xlsx";
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
import {
  Flex,
  VStack,
  HStack,
  Heading,
  Input,
  Button,
  ButtonGroup,
  Stack,
  Code,
  Box,
  InputGroup,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
// Utils
import fetchData from "@/api/fetchData";
import assignMenuColors from "../utils/assignMenuColors";
import handleCopyTest from "@/utils/handleCopyTest";
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
        setIsSimpleModalOpen(true);
        setErrorMessage("Fetching menus: " + error.message);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const handleSubmit = () => {
    // Check the condition to either display the menu for data extraction or show the Excel file.
    // if (!prefix || !task) {
    //   setIsSimpleModalOpen(true);
    //   setErrorMessage("Prefix needed");
    //   return;
    // }

    setSubmitting(true);

    fetchData(headofficeId)
      .then((content) => {
        const menus_to_copy = [selectedMenu.backend_name];
        const menus_to_keep = content.menus.filter((menu) =>
          menus_to_copy.includes(menu.backend_name)
        );
        const category_names_to_keep = _.union(
          ...menus_to_keep.map((menu) => menu.categories)
        );
        const categories_to_keep = content.categories.filter((category) =>
          category_names_to_keep.includes(category.backend_name)
        );

        const product_names_to_keep = _.union(
          ...categories_to_keep.map((category) => category.products)
        );
        const products_to_keep = content.products.filter((product) =>
          product_names_to_keep.includes(product.backend_name)
        );

        const modifier_group_names_to_keep = _.union(
          ...products_to_keep.map((product) => product.modifier_groups)
        );
        const modifier_groups_to_keep = content.modifier_groups.filter(
          (modifier_group) =>
            modifier_group_names_to_keep.includes(modifier_group.backend_name)
        );

        const modifier_names_to_keep = _.union(
          ...modifier_groups_to_keep.map(
            (modifier_group) => modifier_group.modifiers
          )
        );
        const modifiers_to_keep = content.modifiers.filter((modifier) =>
          modifier_names_to_keep.includes(modifier.backend_name)
        );

        const extractedData = {
          menus: menus_to_keep.map((menu) => ({
            ...menu,
            backend_name: `${prefix}${menu.backend_name.replace(
              prefixToDelete,
              ""
            )}`,
            categories: menu.categories.map(
              (category) => `${prefix}${category.replace(prefixToDelete, "")}`
            ),
          })),
          categories: categories_to_keep.map((category) => ({
            ...category,
            backend_name: `${prefix}${category.backend_name.replace(
              prefixToDelete,
              ""
            )}`,
            products: category.products.map(
              (product) => `${prefix}${product.replace(prefixToDelete, "")}`
            ),
          })),
          products: products_to_keep.map((product) => ({
            ...product,
            backend_name: `${prefix}${product.backend_name.replace(
              prefixToDelete,
              ""
            )}`,
            modifier_groups: product.modifier_groups.map(
              (modifier_group) =>
                `${prefix}${modifier_group.replace(prefixToDelete, "")}`
            ),
          })),
          modifier_groups: modifier_groups_to_keep.map((modifier_group) => ({
            ...modifier_group,
            backend_name: `${prefix}${modifier_group.backend_name.replace(
              prefixToDelete,
              ""
            )}`,
            modifiers: modifier_group.modifiers.map(
              (modifier) => `${prefix}${modifier.replace(prefixToDelete, "")}`
            ),
          })),
          modifiers: modifiers_to_keep.map((modifier) => ({
            ...modifier,
            backend_name: `${prefix}${modifier.backend_name.replace(
              prefixToDelete,
              ""
            )}`,
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

  const handleCopy = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const generateExcel = (data) => {
    try {
      let products = [];
      let modifiers = [];

      // extract product prices and tier prices
      for (const product of data.products) {
        let productData = {
          Name: product.name,
          "Backend Name": product.backend_name,
          Price: product.price,
        };
        // add tier prices to product data
        for (let i = 0; i < product.property_tiers.length; i++) {
          productData[`Tier ${i + 1} Price`] = product.property_tiers[i].price;
        }
        products.push(productData);
      }

      // extract modifier prices and tier prices
      for (const modifier of data.modifiers) {
        let modifierData = {
          Name: modifier.name,
          "Backend Name": modifier.backend_name,
          Price: modifier.price,
        };
        // add tier prices to modifier data
        for (let i = 0; i < modifier.property_tiers.length; i++) {
          modifierData[`Tier ${i + 1} Price`] =
            modifier.property_tiers[i].price;
        }
        modifiers.push(modifierData);
      }

      // create workbook
      const wb = XLSX.utils.book_new();

      // add products sheet
      const productsSheet = XLSX.utils.json_to_sheet(products);
      XLSX.utils.book_append_sheet(wb, productsSheet, "Products");

      // add modifiers sheet
      const modifiersSheet = XLSX.utils.json_to_sheet(modifiers);
      XLSX.utils.book_append_sheet(wb, modifiersSheet, "Modifiers");

      // generate and download the file
      XLSX.writeFile(wb, `${selectedMenuName}.xlsx`);
    } catch (error) {
      setErrorMessage("Failed to generate Excel: " + error.message);
      setIsSimpleModalOpen(true);
    }
  };

  const handleDownloadExcelPricesFile = (data) => {
    generateExcel(data);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // Check that file exists and is of the correct type
    if (!file || !(file instanceof Blob)) {
      console.error(
        "No file selected, or selected file is not a Blob or File object"
      );
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

      // const updatedData = updatePricesFromExcel({ Products: productsData, Modifiers: modifiersData }, _.cloneDeep(extractedData));

      const updatedData = updatePricesFromExcel({
        excelData: { Products: productsData, Modifiers: modifiersData },
        originalData: _.cloneDeep(extractedData),
        setExtractedData,
        setErrorMessage,
        setIsSimpleModalOpen,
      });

      // setExtractedData(_.cloneDeep(updatedData));
      setUpdatedData(_.cloneDeep(updatedData));
    };
    reader.readAsArrayBuffer(file);
  };

  const sayWech = () => {
    console.log("Hello");
  };

  // Random color tests

  // const colorSchemes: Array<string> = ["teal", "red", "pink", "cyan", "orange", "gray", "purple", "mobiColor", "green", "purple"];

  // let availableColors = [...colorSchemes];

  // const getRandomColor = (): string => {
  //   if (availableColors.length === 0) {
  //     availableColors = [...colorSchemes];
  //   }

  //   const randomIndex = Math.floor(Math.random() * availableColors.length);
  //   const chosenColor = availableColors[randomIndex];

  //   // Remove the chosen color from the available colors.
  //   availableColors.splice(randomIndex, 1);

  //   return chosenColor;
  // };

  return (
    <VStack spacing={5} p={5} align="start" w="100%">
      <HeaderMain task={task} setTask={setTask} />
      {/* <TypewriterEffect text="Enter your Headoffice ID" speed={60} />
      <Input
        size="xs"
        bg="mobiColor.200"
        color="black"
        id="headoffice-id"
        placeholder="Headoffice ID"
        maxW="220px"
        value={headofficeId}
        onChange={(e) => setHeadofficeId(e.target.value)}
      />

      <Button onClick={fetchMenus} isLoading={fetching} colorScheme="mobiColor" size="sm" color="black" fontSize="xs">
        Fetch Menus
      </Button> */}

      <MenuSearch
        fetchMenus={fetchMenus}
        fetching={fetching}
        headofficeId={headofficeId}
        setHeadofficeId={setHeadofficeId}
      />

      {menuList.length > 0 && (
        <TypewriterEffect text="Select a menu" speed={60} />
      )}

      <Stack
        direction="row"
        spacing={2}
        maxW="780px"
        maxH="55vh"
        scrollBehavior="smooth"
        overflowY="scroll"
      >
        <Flex wrap="wrap" direction="row" spacing={2}>
          {menuList.map((menu, index) => (
            <Button
              key={index}
              colorScheme={menuColors[index]}
              color="black"
              size="xs"
              m={1}
              fontSize=".75em"
              onClick={() => handleMenuClick(menu)}
            >
              {menu.backend_name}
            </Button>
          ))}
        </Flex>
      </Stack>

      {selectedMenu && (
        <VStack spacing={3} w="full" align="start">
          <Box minH="50px">
            <TypewriterEffect
              text="Adjust prefixes for duplication or hit Process for price update"
              speed={50}
            />
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
            border="1px solid #02f9f9"
          >
            Process
          </Button>
        </VStack>
      )}
      <Stack direction={["column", "row"]} spacing="24px">
        {extractedData && (
          <VStack spacing={4} w="full" alignItems="start">
            <Box minH="50px">
              <TypewriterEffect
                text="Download/copy menu or upload Excel file to update prices"
                speed={70}
              />
            </Box>
            <Heading as="h6" size="sm" color="#ffffff">
              {selectedMenuName}
            </Heading>
            {/* <TypewriterEffect text="Hover over buttons for details" speed={70} color="mobiColor" /> */}
            <ButtonGroup>
              <ActionHoverButton
                buttonText={copied ? "Copied!" : "Copy Menu"}
                onButtonClick={() => handleCopy(extractedData)}
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
                onMouseEnter={() =>
                  setHoveredText("Download menu as a Json file")
                }
                onMouseLeave={() => setHoveredText(null)}
              />

              <ActionHoverButton
                buttonText="Download Excel"
                onButtonClick={() =>
                  handleDownloadExcelPricesFile(extractedData)
                }
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs"
                onMouseEnter={() =>
                  setHoveredText("Download menu as an Excel file")
                }
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
                  colorScheme="transparent" color="white" border="1px solid #02f9f9"
                >
                  Choose File to update prices
                </Button>
              </label>
            </InputGroup>

            <Box minH="50px">
              {hoveredText && <TypewriterEffect text={hoveredText} />}

            </Box>

            <Box
              as="pre"
              p={4}
              bg="gray.100"
              rounded="md"
              maxW="520px"
              maxH="45vh"
              scrollBehavior="smooth"
              overflowY="scroll"
            >
              <Code display="block" whiteSpace="pre-wrap" fontSize="10px">
                {JSON.stringify(extractedData, null, 2)}
              </Code>
            </Box>
          </VStack>
        )}

        {updatedData && (
          <VStack spacing={4} w="full" alignItems="start">
            <Box minH="30px">
              <TypewriterEffect
                text="Goog job 🙌 You can now download or copy your menu with prices updated"
                speed={70}
              />
            </Box>
            <Heading as="h6" size="sm" color="#fffff">
              {selectedMenuName}
            </Heading>

            {/* <Box w="100%" minH="30px">
              <TypewriterEffect text="Hover over buttons for details" speed={70} color="mobiColor" />
            </Box> */}

            <ButtonGroup>
              <Button
                onClick={() => handleCopy(updatedData)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs"
              >
                {copied ? "Copied!" : "Copy Menu"}
              </Button>
              <Button
                onClick={() => handleDownload(updatedData)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs"
              >
                Download Menu
              </Button>
              <Button
                onClick={() => handleDownloadExcelPricesFile(updatedData)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs"
              >
                Download Excel
              </Button>
            </ButtonGroup>

            <Button
              onClick={() => console.log("will display updated details")}
              as="span"
              rightIcon={<AttachmentIcon />}
              size="sm"
              colorScheme="green"
              variant="outline"
            >
              Details
            </Button>

            <Box minH="50px"></Box>

            <Box
              as="pre"
              p={4}
              bg="gray.100"
              rounded="md"
              maxW="520px"
              maxH="45vh"
              scrollBehavior="smooth"
              overflowY="scroll"
            >
              <Code display="block" whiteSpace="pre-wrap" fontSize="10px">
                {JSON.stringify(updatedData, null, 2)}
              </Code>
            </Box>
          </VStack>
        )}
      </Stack>

      {/* <Modal isOpen={isSimpleModalOpen} onClose={() => setIsSimpleModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{errorMessage}</ModalBody>
        </ModalContent>
      </Modal> */}

      {isSimpleModalOpen && (
        <SimpleModal
          isOpenInitially={isSimpleModalOpen}
          modalType={SimpleModalType.Info}
          modalTitle="Perform action title"
          modalMessage={errorMessage}
          onCloseModal={() => setIsSimpleModalOpen(false)}
        />
      )}
    </VStack>
  );
}
