"use client";

import { ChevronDown, CirclePlus, LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import Notification from "./Notification";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((resData) => {
        setNotifications(resData);
      });
  }, []);

  return (
    <nav className="p-4 pb-3 flex items-center justify-between bg-background sticky top-0 z-50 border-b border-border">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4" />
        <DropdownMenu onOpenChange={setOpen} open={open}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-base">
              {session?.user?.name ?? "Admin"}
              <ChevronDown
                className={` transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-3 items-center">
        <Notification data={notifications} />
        <Link
          href="/invoices/new"
          className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-full flex items-center hover:bg-accent hover:text-accent-foreground transition-all"
        >
          Add Invoice
          <CirclePlus className="ml-2" strokeWidth={1} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
