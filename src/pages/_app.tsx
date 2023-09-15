// src/pages/_app.tsx
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { AppProps } from "next/app";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
  mobiColor: {
    50: "#f3fbff",
    100: "#e1f7ff",
    200: "#c2eeff",
    300: "#a2e4ff",
    400: "#83dbff",
    500: "#9beafc", // Original Mobi Color
    600: "#62b8d9",
    700: "#4889b5",
    800: "#2f5a91",
    900: "#15326d",
  },
};

const fonts = {
  body: "Dosis, system-ui, sans-serif", // Use Roboto for body text
  heading: "Dosis, system-ui, sans-serif", // Use Roboto for headings
};

export const theme = extendTheme({ colors, fonts });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
