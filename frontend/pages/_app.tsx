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
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      resolvedTheme === "dark" ? "#1e1b18" : "#ffffff",
    );
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
        {/* load Plus Jakarta Sans */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap"
        />

        {/* force every element onto your CSS variable */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* override any Arial settings */
              html, body, #__next, * {
                font-family: var(--font-sans) !important;
              }
            `,
          }}
        />

        {/* normal metas */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>MermaidGenie – build and share Mermaid diagrams</title>
        <meta
          name="description"
          content="MermaidGenie – Create, share, and manage your Mermaid diagrams with ease."
        />
      </Head>

      <MetaUpdater />
      <Analytics />

      <div className="font-sans flex min-h-screen flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-6 py-10">
          <Component {...pageProps} />
        </main>
        <Footer />
        <Toaster richColors position="bottom-right" />
      </div>
    </ThemeProvider>
  );
}
