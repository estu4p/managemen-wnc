import type { Metadata } from "next";
import { Geist, Geist_Mono, Urbanist } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";

// const urbanist = Urbanist({
//   variable: "--font-urbanist",
//   subsets: ["latin"],
//   display: "swap",
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
// });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wash & Care",
  description: "Dashboard management Wash & Care",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        // className={`${urbanist.variable} antialiased`}
      >
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main className="w-full overflow-hidden">
            <Navbar />
            <div className="text-sm">{children}</div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
