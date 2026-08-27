import type { Metadata, Viewport } from "next";
import "./globals.css";
import CustomCursor from "@/app/components/CustomCursor";

export const metadata: Metadata = {
  title: "Vishal Aakash | Full-Stack Developer & Systems Engineer",
  description:
    "I'm a full-stack developer and systems engineer from Chennai, India. I build high-performance web apps, DeFi protocols, and pixel-perfect UIs — 3+ years deep in React, Next.js, Node.js, and onchain development.",
  keywords: [
    "Vishal Aakash",
    "oxvishall",
    "full-stack developer",
    "systems engineer",
    "web developer Chennai",
    "DeFi developer",
    "React developer",
    "Next.js developer",
    "TypeScript",
    "Solidity",
    "onchain developer",
    "UI engineer",
    "portfolio",
    "Nothing OS portfolio",
    "monochrome portfolio",
  ],
  authors: [{ name: "Vishal Aakash", url: "https://github.com/oxvishall" }],
  creator: "Vishal Aakash",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vishalaakash.dev",
    siteName: "Vishal Aakash",
    title: "Vishal Aakash — Full-Stack Developer & Systems Engineer",
    description:
      "I build performant web apps, DeFi protocols, and pixel-perfect interfaces from Chennai. Obsessed with clean code and the last 2% of polish.",
    images: [
      {
        url: "/bp.png",
        width: 400,
        height: 400,
        alt: "Vishal Aakash",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@oxvishall",
    creator: "@oxvishall",
    title: "Vishal Aakash — Full-Stack Developer & Systems Engineer",
    description:
      "I build performant web apps, DeFi protocols, and pixel-perfect interfaces. Chennai-based, obsessed with the last 2% of polish.",
    images: ["/bp.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="antialiased"
      suppressHydrationWarning
    >
      <head>
        {/* Google Fonts - Safe Fallback */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Doto:wght@100..900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  // Default to light if no theme is stored
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <CustomCursor />
        {children}
        <div id="cursor" aria-hidden="true" />
      </body>
    </html>
  );
}
