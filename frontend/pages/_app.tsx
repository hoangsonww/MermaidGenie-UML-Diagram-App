import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

function MetaUpdater() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const meta = document.getElementById("theme-color");
    if (meta) {
      meta.setAttribute(
        "content",
        resolvedTheme === "dark" ? "#1e1b18" : "#ffffff",
      );
    }
  }, [resolvedTheme]);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>MermaidGenie</title>
      </Head>

      {/* kicks off the dynamic swap on mount + on toggle */}
      <MetaUpdater />

      <Analytics />

      <div className="font-sans flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 w-full px-6 py-10">
          <Component {...pageProps} />
        </main>
        <Footer />
        <Toaster richColors position="bottom-right" />
      </div>
    </ThemeProvider>
  );
}
