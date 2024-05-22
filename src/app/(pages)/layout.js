"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { SnackbarProvider } from "notistack";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        preventDuplicate
      >
        <body className={inter.className}>{children}</body>
      </SnackbarProvider>
    </html>
  );
}
