import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import "@/components/DomeGallery/DomeGallery.css";

import Navbar from "@/components/Navbar/Navbar";
import CustomCursor from "@/components/ui/CustomCursor";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps, router }: AppProps) {
  const showHeaderFooter =
    // router.pathname !== "/" && // Enable on index
    router.pathname !== "/page" && router.pathname !== "/wordle";

  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      {showHeaderFooter && <Navbar />}
      <CustomCursor />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
