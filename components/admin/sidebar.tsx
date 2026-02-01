"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  // MessageSquare,
  // Link2,
  Image,
  MessagesSquare,
  Video,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import Logo from "@/components/svg/logo";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Podcasts", href: "/admin/podcasts", icon: Video },
  { name: "Resources", href: "/admin/resources", icon: BookOpen },
  // { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  // { name: "Links", href: "/admin/links", icon: Link2 },
  { name: "Media", href: "/admin/media", icon: Image },
  { name: "Chat Sessions", href: "/admin/chat", icon: MessagesSquare },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex h-full w-64 flex-col border-r border-grin-200 bg-white transition-transform duration-300 ease-in-out",
          "md:relative md:translate-x-0",
          "fixed inset-y-0 left-0 z-50",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-grin-200 px-6">
          <Link href="/" className="flex items-center gap-2">
            {/* <Logo className="h-8 w-8" /> */}
            <span className="font-heading text-xl font-semibold text-grin-700">
              Herlign Admin
            </span>
          </Link>
          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname?.startsWith(item.href + "/") && item.href !== "/admin");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-grin-100 text-grin-900"
                    : "text-gray-700 hover:bg-grin-50 hover:text-grin-900",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive
                      ? "text-grin-600"
                      : "text-gray-500 group-hover:text-grin-600",
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-grin-200 p-4">
          <p className="text-xs text-gray-500">© 2026 Herlign FC</p>
        </div>
      </div>
    </>
  );
}
