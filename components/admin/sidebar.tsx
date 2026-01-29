"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  MessageSquare,
  Link2,
  Image,
  MessagesSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
// import Logo from "@/components/svg/logo";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Resources", href: "/admin/resources", icon: BookOpen },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Links", href: "/admin/links", icon: Link2 },
  { name: "Media", href: "/admin/media", icon: Image },
  { name: "Chat Sessions", href: "/admin/chat", icon: MessagesSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-grin-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-grin-200 px-6">
        <Link href="/admin" className="flex items-center gap-2">
          {/* <Logo className="h-8 w-8" /> */}
          <span className="font-heading text-xl font-semibold text-grin-700">
            Herlign Admin
          </span>
        </Link>
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
  );
}
