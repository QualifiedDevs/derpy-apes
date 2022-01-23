import fs from "fs";
import React, { useRef } from "react";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import App from "next/app";
import Head from "next/head";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "@src/theme";
import createEmotionCache from "@src/createEmotionCache";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

import { QuantityProvider } from "@components/ChooseQuantity";

function MyApp(props: MyAppProps) {
  //@ts-ignore
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const manifestRef = useRef(pageProps.manifest);
  pageProps.manifest = manifestRef.current;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Derpy Apes</title>
        <link href="/favicon.png" rel="icon" />
        <meta
          content="minimum-scale=1, initial-scale=1, width=device-width"
          name="viewport"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            html: { scrollBehavior: "smooth" },
          }}
        />
        <QuantityProvider>
          <Component {...pageProps} />
        </QuantityProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
