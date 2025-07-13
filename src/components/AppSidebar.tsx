"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Bolt,
  Calendar,
  ChartColumn,
  FilePlus,
  Home,
  Inbox,
  Package,
  Search,
  Settings,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items.
const menuItems = [
  {
    title: "Work Monitoring",
    url: "/",
    icon: Home,
  },
  {
    title: "Financial",
    url: "/financial",
    icon: ChartColumn,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: UsersRound,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Add Note",
    url: "/addNote",
    icon: FilePlus,
  },
  {
    title: "Note",
    url: "/note",
    icon: Search,
  },
];

// General items.
const generalItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Bolt,
  },
  {
    title: "Security",
    url: "/security",
    icon: ShieldAlert,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname == path || pathname.startsWith(path + "/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                {/* <Image
                  src={"/images/wnc.PNG"}
                  alt="logo wnc"
                  width={32}
                  height={32}
                /> */}
                <span className="font-medium text-lg text-white">
                  Wash & Care
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* <SidebarSeparator className="ml-0" /> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm text-white tracking-widest">
            MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="text-white gap-2 mt-1">
              {menuItems.map((item) => {
                // const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      // isActive={activeItem === item.title}
                      isActive={isActive(item.url)}
                      className={cn(
                        isActive(item.url) &&
                          "!text-secondary-green hover:!text-secondary-green"
                      )}
                      // className="data-[active=true]:border-l-4 data-[active=true]:border-primary data-[active=true]:font-semibold"
                      // className="data-[active=true]:text-secondary-green"
                    >
                      <Link
                        href={item.url}
                        // onClick={() => handleItemClick(item.title)}
                        className={cn(
                          isActive(item.url)
                            ? "text-secondary-green font-medium"
                            : ""
                        )}
                        //   className="relative"
                      >
                        {isActive(item.url) && (
                          <div className="absolute -left-1.5 top-0 w-1 h-8 bg-secondary-green rounded-s rotate-180" />
                        )}
                        {/* <div className="left-0 top-0 rounded-s rounded-full bg-secondary-green w-1 h-8" /> */}
                        <item.icon className="" />
                        <span className="text-white">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <SidebarSeparator className="ml-0 mt-6 bg-muted-foreground " />
              <SidebarGroupLabel className="text-sm text-white mt-6 tracking-widest">
                GENERAL
              </SidebarGroupLabel>
              {generalItems.map((item) => {
                // const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className={cn(
                        isActive(item.url) &&
                          "!text-secondary-green hover:!text-secondary-green"
                      )}
                    >
                      <Link
                        href={item.url}
                        className={cn(
                          isActive(item.url)
                            ? "text-secondary-green font-medium"
                            : ""
                        )}
                      >
                        {isActive(item.url) && (
                          <div className="absolute -left-1.5 top-0 w-1 h-8 bg-secondary-green rounded-s rotate-180" />
                        )}
                        <item.icon className="" />
                        <span className="text-white">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
