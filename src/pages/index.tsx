// @ts-nocheck

import React, { useEffect, useState, useRef } from "react";
// Update the import path to the correct location
import _ from "lodash";
import "../style/main.css";
// Components
import CustomModal from "@/components/Modals/CustomModal";
import HeaderMain from "../components/Header/HeaderMain";
import TypewriterEffect from "@/components/Effects/TypewriterEffect";
import ActionHoverButton from "../components/Buttons/ActionHoverButton";
import MenuSearch from "@/components/Search/MenusSearch";
import MenuList from "@/components/Menus/MenuLists";
import TaskActionButton from "@/components/Buttons/TaskActionButton";
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
import { downloadFileWithData } from "@/utils/downloadFileWithData";
import fetchAndExtractMenus from "@/utils/fetchAndExtractMenus";
// Types
import { CustomModalTypes } from "@/components/Modals/CustomModal";

export default function Home() {
  const [headofficeId, setHeadofficeId] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenuName, setSelectedMenuName] = useState(null);
  const [newMenuName, setNewMenuName] = useState("");
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [prefixToDelete, setPrefixToDelete] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedUpdatedMenu, setCopiedUpdatedMenu] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [menuColors, setMenuColors] = useState({});
  const [CustomModalType, setCustomModalType] = useState(CustomModalTypes.Info);

  const [hoveredText, setHoveredText] = useState<string | null>(null);

  const [task, setTask] = useState(null);

  console.log(selectedMenuName, newMenuName);

  const fetchMenus = () => {
    setFetching(true);
    setExtractedData(null);
    setUpdatedData(null);
    fetchData(headofficeId)
      .then((content) => {
        setMenuList(content.menus);
        if (Object.keys(menuColors).length === 0) {
          const newColors = assignMenuColors(content.menus);
          setMenuColors(newColors);
        }
      })
      .catch((error) => {
        setCustomModalType(CustomModalTypes.Error);
        setIsCustomModalOpen(true);
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
      setNewMenuName,
      setExtractedData,
      setSubmitting,
      setIsCustomModalOpen,
      setErrorMessage,
    });
  };

  useEffect(() => {
    if (selectedMenu) fetchMenus();
  }, [selectedMenu]);

  const handleDownloadExcelPricesFile = (data) => {
    generateExcel(data, newMenuName, setErrorMessage, setIsCustomModalOpen, setCustomModalType);
  };

  const handleFileUpload = (event) => {
    handleExcelFileUpload(
      event,
      setUpdatedData,
      extractedData,
      setExtractedData,
      setErrorMessage,
      setCustomModalType,
      setIsCustomModalOpen
    );
  };

  return (
    <VStack spacing={5} p={5} align="start" w="100%">
      <HeaderMain task={task} setTask={setTask} />

      <MenuSearch fetchMenus={fetchMenus} fetching={fetching} headofficeId={headofficeId} setHeadofficeId={setHeadofficeId} />

      <Stack direction="row" spacing={2} maxW="780px" maxH="55vh" scrollBehavior="smooth" overflowY="scroll">
        <Flex wrap="wrap" direction="row" spacing={2}>
          <MenuList
            menuList={menuList}
            handleMenuClick={(menu) => {
              setSelectedMenu(menu);
              setSelectedMenuName(menu.backend_name);
            }}
            menuColors={menuColors}
          />
        </Flex>
      </Stack>

      {selectedMenu && (
        <VStack spacing={3} w="full" align="start">
          <Box minH="50px">
            <TypewriterEffect
              text={`${selectedMenuName}: Adjust prefixes for duplication or hit Process for price update`}
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

          <TaskActionButton onClick={handleSubmit} isLoading={submitting} mt="1em">
            Process
          </TaskActionButton>
        </VStack>
      )}
      <Stack direction={["column", "row"]} spacing="24px">
        {extractedData && (
          <VStack spacing={4} w="full" alignItems="start">
            <Box minH="50px">
              <TypewriterEffect text="Download/copy menu or upload Excel file to update prices" speed={60} />
            </Box>
            <Heading as="h6" size="sm" color="white">
              {newMenuName}
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
                onMouseLeave={() => setHoveredText("")}
              />

              <ActionHoverButton
                buttonText="Download Menu"
                onButtonClick={() => downloadFileWithData(extractedData, `${prefix}${selectedMenu.backend_name}.json`)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs"
                onMouseEnter={() => setHoveredText("Download menu as a Json file")}
                onMouseLeave={() => setHoveredText("")}
              />

              <ActionHoverButton
                buttonText="Download Excel"
                onButtonClick={() => handleDownloadExcelPricesFile(extractedData)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs"
                onMouseEnter={() => setHoveredText("Download menu as an Excel file")}
                onMouseLeave={() => setHoveredText("")}
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
                <TaskActionButton as="span" cursor="pointer" rightIcon={<AttachmentIcon />}>
                  Choose File to update prices
                </TaskActionButton>
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
            <Heading as="h6" size="sm" color="white">
              {newMenuName}
            </Heading>

            <ButtonGroup>
              <ActionHoverButton
                buttonText={copiedUpdatedMenu ? "Copied!" : "Copy Menu"}
                onButtonClick={() => handleCopy(updatedData, setCopiedUpdatedMenu)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs"
                isCopied={copiedUpdatedMenu}
                onMouseEnter={() => setHoveredText("Copy raw updated Json menu")}
                onMouseLeave={() => setHoveredText("")}
              />

              <ActionHoverButton
                buttonText="Download Menu"
                onButtonClick={() => downloadFileWithData(updatedData, `menu_updated.json`)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs"
                onMouseEnter={() => setHoveredText("Download updated menu as a Json file")}
                onMouseLeave={() => setHoveredText("")}
              />
              <ActionHoverButton
                buttonText="Download Excel"
                onButtonClick={() => handleDownloadExcelPricesFile(updatedData)}
                colorScheme="mobiColor"
                color="black"
                size="sm"
                fontSize="xs"
                onMouseEnter={() => setHoveredText("Download updated menu as an Excel file")}
                onMouseLeave={() => setHoveredText("")}
              />
            </ButtonGroup>

            <TaskActionButton
              onClick={() => {
                setIsCustomModalOpen(true);
              }}
              as="span"
              cursor="pointer"
              rightIcon={<AttachmentIcon />}>
              Show Details
            </TaskActionButton>

            <Box minH="50px"></Box>

            <Box as="pre" p={4} bg="gray.100" rounded="md" maxW="520px" maxH="45vh" scrollBehavior="smooth" overflowY="scroll">
              <Code display="block" whiteSpace="pre-wrap" fontSize="10px">
                {JSON.stringify(updatedData, null, 2)}
              </Code>
            </Box>
          </VStack>
        )}
      </Stack>

      {isCustomModalOpen && (
        <CustomModal
          isOpenInitially={isCustomModalOpen}
          modalType={CustomModalType}
          modalTitle="Custom Modal Title"
          modalMessage={errorMessage}
          onCloseModal={() => setIsCustomModalOpen(false)}
        />
      )}
    </VStack>
  );
}
