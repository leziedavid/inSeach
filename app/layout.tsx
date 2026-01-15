// app/layout.tsx (ou layout.js si TS non utilisé)

import { InstallPrompt } from "@/components/home/InstallPrompt"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AlertProvider } from "@/contexts/AlertContext"
import { CartProvider } from "@/contexts/CartContext"
import localFont from "next/font/local" // si tu veux des fonts locales

const poppins = localFont({
  src: "./fonts/Poppins.woff2",
  variable: "--font-poppins",
  weight: "400",
  preload: false,
});
const raleway = localFont({
  src: "./fonts/Raleway.woff2",
  variable: "--font-raleway",
  weight: "100 900",
});

const opensans = localFont({
  src: "./fonts/Open Sans.woff2",
  variable: "--font-open-sans",
  weight: "100 800",
});

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${poppins.variable} ${raleway.variable} ${opensans.variable} antialiased`}>
        <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light" disableTransitionOnChange>

          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              <AlertProvider>
                <CartProvider>
                  {children}
                  <InstallPrompt /> {/* <- Toast détect mobile */}
                </CartProvider>
              </AlertProvider>
            </main>
          </div>
        </ThemeProvider>

        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
            },
            className: "sonner-toast",
          }}
        />

      </body>
    </html>
  )
}
