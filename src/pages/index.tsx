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
import MenuSearch from "@/components/Search/MenusSearch";
import MenuList from "@/components/Menus/MenuLists";
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
import assignMenuColors from "@/utils/assignMenuColors";
import generateExcel from "@/utils/generateExcel";
import handleCopy from "@/utils/handleCopy";
import { handleExcelFileUpload } from "@/utils/excelUtils";
import { downloadFileWithData } from "@/utils/downloadFileWithData";
import fetchAndExtractMenus from "@/utils/fetchAndExtractMenus";
// Types
import { SimpleModalType } from "@/components/Modals/SimpleModal/SimpleModal";

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

    fetchAndExtractMenus({
      headofficeId,
      prefix,
      prefixToDelete,
      selectedMenu,
      setSelectedMenuName,
      setExtractedData,
      setSubmitting,
      setIsSimpleModalOpen,
      setErrorMessage,
    });
  };

  useEffect(() => {
    if (selectedMenu) fetchMenus();
  }, [selectedMenu]);

  const handleDownloadExcelPricesFile = (data) => {
    generateExcel(
      data,
      selectedMenuName,
      setErrorMessage,
      setIsSimpleModalOpen,
      setSimpleModalType
    );
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

      <MenuSearch
        fetchMenus={fetchMenus}
        fetching={fetching}
        headofficeId={headofficeId}
        setHeadofficeId={setHeadofficeId}
      />

      <Stack
        direction="row"
        spacing={2}
        maxW="780px"
        maxH="55vh"
        scrollBehavior="smooth"
        overflowY="scroll"
      >
        <Flex wrap="wrap" direction="row" spacing={2}>
          <MenuList
            menuList={menuList}
            handleMenuClick={(menu) => setSelectedMenu(menu)}
            menuColors={menuColors}
          />
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
                onButtonClick={() =>
                  downloadFileWithData(
                    extractedData,
                    `${prefix}${selectedMenu.backend_name}.json`
                  )
                }
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
                  colorScheme="transparent"
                  color="white"
                  border="1px solid #02f9f9"
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

            <ButtonGroup>
              <Button
                onClick={() => handleCopy(updatedData, setCopied)}
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
