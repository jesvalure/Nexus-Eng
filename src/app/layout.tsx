import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Cargamos la fuente Inter
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus-Eng | The Engineering Second Brain",
  description: "Manage projects, logic, and your engineering career in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark"> 
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}>
        {/* Aquí es donde se inyectan tus páginas como la Landing o el Dashboard */}
        {children}
      </body>
    </html>
  );
}