import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CarePulse",
  description: "A healthcare management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          "h-screen overflow-hidden bg-dark-300 font-sans antialiased",
          fontSans.variable,
        )}>
        <ThemeProvider attribute='class' defaultTheme='dark'>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

/* <TooltipProvider>{children}</TooltipProvider> */
