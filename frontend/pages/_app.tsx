import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="font-sans flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 w-full px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Component {...pageProps} />
        </main>
        <Footer />
        <Toaster richColors position="bottom-right" />
      </div>
    </ThemeProvider>
  );
}
