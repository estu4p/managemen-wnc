import type { Metadata } from "next";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import AuthProvider from "@/components/provider/session-provider";

export const metadata: Metadata = {
  title: "Wash & Care",
  description: "Dashboard management Wash & Care",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="w-full overflow-hidden">
          <Navbar />

          <div className="text-sm">{children}</div>
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
}
