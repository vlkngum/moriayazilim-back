import "./globals.css";

import { poppins } from "@/app/ui/fonts";
 

import ClientLayoutWrapper from "./ClientLayout";
import { AuthProvider } from "@/contexts/AuthContext";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moria Back",
  description: "Moria Back HomePage",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${poppins.className} antialiased bg-white text-black`}>
        <AuthProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}