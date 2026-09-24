"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShoppingBag,
  RotateCcw,
  Warehouse,
  Users,
  Truck,
  Tags,
  Ruler,
  Boxes,
  CreditCard,
  BarChart3,
  ChevronDown,
  Menu,
  X,
  LogOut,
  UserRound,
  ShieldCheck,
  Building2,
  UserCog,
  Settings,
  Bell,
  ChevronRight,
} from "lucide-react";

import Button from "@/components/ui/Button";

const menuGroups = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
    ],
  },

  {
    title: "Inventory",
    items: [
      {
        label: "Products",
        icon: Package,
        path: "/products",
      },
      {
        label: "Categories",
        icon: Tags,
        path: "/categories",
      },
      {
        label: "Brands",
        icon: Boxes,
        path: "/brands",
      },
      {
        label: "Units",
        icon: Ruler,
        path: "/units",
      },
      {
        label: "Warehouses",
        icon: Warehouse,
        path: "/warehouses",
      },
      {
        label: "Stock",
        icon: Package,
        path: "/stock",
      },
      {
        label: "Stock Movements",
        icon: BarChart3,
        path: "/stock-movements",
      },
    ],
  },

  {
    title: "Purchases",
    items: [
      {
        label: "Suppliers",
        icon: Truck,
        path: "/suppliers",
      },
      {
        label: "Purchases",
        icon: ShoppingBag,
        path: "/purchases",
      },
      {
        label: "Purchase Returns",
        icon: RotateCcw,
        path: "/purchase-returns",
      },
    ],
  },

  {
    title: "Sales",
    items: [
      {
        label: "Customers",
        icon: Users,
        path: "/customers",
      },
      {
        label: "Sales",
        icon: ShoppingCart,
        path: "/sales",
      },
      {
        label: "Sales Returns",
        icon: RotateCcw,
        path: "/sales-returns",
      },
      {
        label: "Payments",
        icon: CreditCard,
        path: "/payments",
      },
    ],
  },

  {
    title: "Reports",
    items: [
      {
        label: "Reports",
        icon: BarChart3,
        path: "/reports",
      },
    ],
  },

  {
    title: "Administration",
    items: [
      {
        label: "Tenants",
        icon: Building2,
        path: "/tenants",
      },
      {
        label: "Roles & Permissions",
        icon: ShieldCheck,
        path: "/roles",
      },
      {
        label: "Users",
        icon: UserCog,
        path: "/dashboard/users",
      },
    ],
  },
];

function SidebarItem({ item, active, onNavigate }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.path}
      onClick={onNavigate}
      className={`
        group
        flex
        h-10
        w-full
        items-center
        gap-3
        rounded-lg
        px-3
        text-sm
        font-medium
        transition-all
        duration-200

        ${
          active
            ? `
              bg-sidebar-primary
              text-sidebar-primary-foreground
              shadow-sm
              hover:bg-sidebar-primary/90
            `
            : `
              text-sidebar-foreground/65
              hover:bg-sidebar-accent
              hover:text-sidebar-accent-foreground
            `
        }
      `}
    >
      <Icon size={18} strokeWidth={active ? 2.2 : 1.9} className="shrink-0" />

      <span className="truncate">{item.label}</span>

      {active && (
        <ChevronRight
          size={14}
          strokeWidth={2}
          className="ml-auto shrink-0 opacity-70"
        />
      )}
    </Link>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="
          fixed
          left-4
          top-4
          z-60
          border-border
          bg-background
          shadow-md
          lg:hidden
        "
        aria-label="Open menu"
      >
        <Menu size={20} />
      </Button>

      {/* Mobile Overlay */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-64
          flex-col
          border-r
          border-sidebar-border
          bg-sidebar
          text-sidebar-foreground
          shadow-xl
          transition-transform
          duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}

        <div
          className="
            flex
            h-16
            shrink-0
            items-center
            justify-between
            border-b
            border-sidebar-border
            px-4
          "
        >
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 text-left"
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-sidebar-primary
                text-sm
                font-bold
                text-sidebar-primary-foreground
                shadow-sm
              "
            >
              I
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold tracking-tight">
                Inventory
              </h1>

              <p className="truncate text-[10px] text-sidebar-foreground/45">
                Management System
              </p>
            </div>
          </Link>

          {/* Mobile Close */}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="
              h-8
              w-8
              text-sidebar-foreground/60
              hover:bg-sidebar-accent
              lg:hidden
            "
            aria-label="Close menu"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Tenant Switcher */}

        <div className="px-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            fullWidth
            rightIcon={
              <ChevronDown
                size={15}
                className="shrink-0 text-sidebar-foreground/40"
              />
            }
            className="
              h-auto!
              justify-start!
              gap-3
              rounded-xl
              border
              border-sidebar-border
              bg-sidebar-accent/40
              p-2.5
              text-left
              shadow-none
              hover:bg-sidebar-accent
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-sidebar-primary/10
                text-sidebar-primary
              "
            >
              <Building2 size={17} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">My Business</p>

              <p className="truncate text-[10px] text-sidebar-foreground/45">
                Main Tenant
              </p>
            </div>
          </Button>
        </div>

        {/* Navigation */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-5
            scrollbar-thin
          "
        >
          <div className="space-y-6">
            {menuGroups.map((group) => (
              <div key={group.title}>
                <div className="mb-2 flex items-center px-3">
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-sidebar-foreground/35
                    "
                  >
                    {group.title}
                  </p>
                </div>

                <div className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarItem
                      key={item.path}
                      item={item}
                      active={
                        pathname === item.path ||
                        pathname.startsWith(`${item.path}/`)
                      }
                      onNavigate={() => setMobileOpen(false)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom */}

        <div className="shrink-0 border-t border-sidebar-border p-3">
          {/* User */}

          <div
            className="
              mt-3
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-sidebar-border
              bg-sidebar-accent/30
              p-2.5
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-sidebar-primary
                text-sidebar-primary-foreground
              "
            >
              <UserRound size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">Admin User</p>

              <p className="truncate text-[10px] text-sidebar-foreground/45">
                Super Administrator
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Logout"
              onClick={() => {
                // logout logic
              }}
              className="
                h-8
                w-8
                shrink-0
                text-sidebar-foreground/40
                shadow-none
                hover:bg-destructive/10
                hover:text-destructive
              "
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
