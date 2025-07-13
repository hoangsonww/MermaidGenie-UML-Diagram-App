import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap"
        />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Android Chrome icons */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />

        {/* Standard favicons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Theme & tile colors */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Mobile Web App capable */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MermaidGenie" />

        {/* Social / OpenGraph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="MermaidGenie" />
        <meta
          property="og:description"
          content="Create, share, and manage your Mermaid diagrams."
        />
        <meta property="og:url" content="https://mermaidgenie.vercel.app" />
        <meta
          property="og:image"
          content="https://mermaidgenie.vercel.app/android-chrome-512x512.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@your_twitter_handle" />
        <meta name="twitter:title" content="MermaidGenie" />
        <meta
          name="twitter:description"
          content="Create, share, and manage your Mermaid diagrams."
        />
        <meta
          name="twitter:image"
          content="https://mermaidgenie.vercel.app/android-chrome-512x512.png"
        />

        {/* SEO */}
        <meta
          name="description"
          content="MermaidGenie – build and share Mermaid diagrams."
        />
        <meta
          name="keywords"
          content="Mermaid, diagrams, UML, chart, generator, PWA"
        />
        <meta name="author" content="Your Name or Company" />
        <meta name="robots" content="index, follow" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
