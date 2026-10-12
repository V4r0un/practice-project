import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ClientProvider from "@/ClientProvider";
import UserContext from "@/context/UserContext";


export const metadata: Metadata = {
  title: "My First Full Stack Project Using Next JS",
  description: "This is my first project of Next JS",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html>
      <body className="min-h-full flex flex-col">
        <ClientProvider>
          <UserContext>
          {children}
          </UserContext>
        </ClientProvider>
      </body>
    </html>
  );
}
