/** @format */

"use client";

import Link from "next/link";
import { Search, Bell, Plus, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center gap-4 px-4 max-w-6xl mx-auto">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link href="/feed" className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-primary" />
            <span className="font-bold sm:inline-block text-xl tracking-tight">
              Soma
            </span>
          </Link>
        </div>

        {/* Search Bar - Center */}
        <div className="flex-1 justify-center max-w-md mx-auto hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Soma..."
              className="w-full bg-muted/50 focus:bg-background pl-9 h-9 rounded-full border-none focus:ring-1 transition-all"
            />
          </div>
        </div>

        {/* Mobile Search Icon */}
        <div className="flex-1 md:hidden" />

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-background" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-border bg-muted/50 hover:bg-muted ml-1"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 focus:text-red-500">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="md:hidden ml-1">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
