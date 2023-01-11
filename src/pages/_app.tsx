import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { ExexuteIdContext } from "../context";
import { useState } from "react";

const theme = createTheme({
  type: "light",
  theme: {
    colors: {
      background: "#eeeeee",
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [executeId, setExecuteId] = useState<string>("");

  return (
    <ExexuteIdContext.Provider value={{ executeId, setExecuteId }}>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </ExexuteIdContext.Provider>
  );
}
