"use client";

import React from "react";
import { Search, Bell, UserRound } from "lucide-react";
import ThemeToggle from "@/theme/ThemeToggle";
import Button from "./ui/Button";
import Link from "next/link";

export default function Header() {
  return (
    <header
      className="
        sticky top-0 z-30
        flex h-16 items-center justify-between
        border-b border-border
        bg-background/95
        px-4 backdrop-blur
        lg:px-6
      "
    >
      {/* Search */}
      <div className="hidden md:block">
        <div
          className="
            flex w-72 items-center gap-2
            rounded-lg border border-input
            bg-background
            px-3
          "
        >
          <Search size={17} className="shrink-0 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search..."
            className="
              h-9 w-full bg-transparent
              text-sm text-foreground
              outline-none
              placeholder:text-muted-foreground
            "
          />

          <kbd
            className="
              hidden shrink-0 rounded border
              bg-muted px-1.5 py-0.5
              text-[10px] text-muted-foreground
              lg:block
            "
          >
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="
            relative
            text-muted-foreground
            hover:text-accent-foreground
            border
          "
          onClick={() => {
            window.location.href = "/notifications";
          }}
        >
          <Bell size={18} />

          {/* Notification dot */}
          <span
            className="
              absolute right-2 top-2
              h-1.5 w-1.5
              rounded-full
              bg-destructive
            "
          />
        </Button>

        {/* Theme */}
        <ThemeToggle />
        <Link href={'/dashboard/profile'}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Profile"
            className="
            relative
            text-muted-foreground
            hover:text-accent-foreground
            border
          "

          >
            <UserRound size={18} />
          </Button>
        </Link>
      </div>
    </header>
  );
}
