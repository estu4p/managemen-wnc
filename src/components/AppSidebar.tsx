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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Bolt,
  ChartColumn,
  ChevronRight,
  FilePlus,
  Home,
  List,
  Package,
  Search,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useState } from "react";

// Menu items.
const menuItems = [
  {
    title: "Work Monitoring",
    url: "/",
    icon: Home,
  },
  {
    title: "Financials",
    url: "/financials",
    icon: ChartColumn,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FilePlus,
    children: [
      {
        title: "Invoice List",
        url: "/invoices",
        icon: List,
      },
      {
        title: "Invoice Settings",
        url: "/invoices/settings",
        icon: Bolt,
      },
    ],
  },
  {
    title: "Customers",
    url: "/customers",
    icon: UsersRound,
  },
  {
    title: "Inventories",
    url: "/inventories",
    icon: Package,
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

const AppSidebar = () => {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const isActive = (path: string) => {
    return pathname == path || pathname.startsWith(path + "/");
  };

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isItemOpen = (item: any) => {
    const hasActiveChild = item.children?.some((child: any) =>
      isActive(child.url)
    );
    return openItems.includes(item.title) || hasActiveChild;
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
      <SidebarContent className="overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm text-white tracking-widest">
            MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="text-white gap-2 mt-1">
              {menuItems.map((item) =>
                item.children ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    open={isItemOpen(item)}
                    onOpenChange={() => toggleItem(item.title)}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
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
                      {item.children?.length ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                              <ChevronRight className="text-white" />
                            </SidebarMenuAction>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="transition-all duration-300 ease-in-out data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1">
                            <SidebarMenuSub>
                              {item.children?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={subItem.url}>
                                      <span
                                        className={cn(
                                          "text-white",
                                          pathname === subItem.url &&
                                            "text-secondary-green"
                                        )}
                                      >
                                        {subItem.title}
                                      </span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      // isActive={activeItem === item.title}
                      isActive={isActive(item.url)}
                      className={cn(
                        isActive(item.url) &&
                          "!text-secondary-green hover:!text-secondary-green"
                      )}
                    >
                      <Link href={item.url}>
                        {isActive(item.url) && (
                          <div className="absolute -left-1.5 top-0 w-1 h-8 bg-secondary-green rounded-s rotate-180" />
                        )}
                        <item.icon className="" />
                        <span className="text-white">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
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
};
export default AppSidebar;
