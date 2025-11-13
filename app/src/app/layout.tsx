import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inventario UNSCH",
  description: "Sistema de gestión de inventario de la Universidad Nacional de San Cristóbal de Huamanga.",
  manifest: "/manifest.json",
  metadataBase: new URL("http://localhost:3000"),
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/es-ES",
    },
  },
  openGraph: {
    title: "Inventario UNSCH",
    description: "Gestión centralizada de activos y recursos de la Universidad Nacional de San Cristóbal de Huamanga.",
    url: "http://localhost:3000",
    siteName: "Inventario UNSCH",
    images: [
      {
        url: "https://res.cloudinary.com/di6v1bacx/image/upload/v1763005174/logo_unsch_vertical_1_jpg_ywqk1z.jpg",
        width: 1024,
        height: 1024,
        alt: "Logo UNSCH",
      },
      {
        url: "https://res.cloudinary.com/di6v1bacx/image/upload/v1763005174/logo_unsch_vertical_1_jpg_ywqk1z.jpg",
        width: 1800,
        height: 1600,
        alt: "Logo UNSCH",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <SidebarProvider>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </SidebarProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}