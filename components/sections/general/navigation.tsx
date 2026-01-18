"use client";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/components/svg/logo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/start-anyway", label: "Start Anyway" },
  { href: "/events", label: "Events" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

interface HeaderColorConfig {
  header: string;
  logo: string;
  bg: string;
  path: string;
}

const headerColorConfig: HeaderColorConfig[] = [
  {
    path: "/",
    header: "bg-peenk-500/50 text-gray-900 border-peenk-300",
    bg: "bg-peenk-500",
    logo: "fill-ohrange-500",
  },
  {
    path: "/about",
    header: "bg-perple-500/90 text-white border-perple-400",
    bg: "bg-perple-500",
    logo: "fill-ohrange-500",
  },
  {
    path: "/start-anyway",
    header: "bg-peenk-500/50 text-gray-700 border-peenk-300",
    bg: "bg-peenk-500",
    logo: "fill-ohrange-500",
  },
  {
    path: "/contact",
    header: "bg-ohrange-500/50 text-white border-ohrange-400",
    bg: "bg-ohrange-500",
    logo: "fill-white",
  },
  {
    path: "/events",
    header: "bg-grin-500/50 text-white border-grin-400",
    bg: "bg-grin-500",
    logo: "fill-lermorn-500",
  },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  const checkCurrentPath = useCallback(
    (path?: string) => {
      return path === "/"
        ? pathname === "/"
        : !!path &&
            pathname?.toLocaleLowerCase()?.includes(path?.toLocaleLowerCase());
    },
    [pathname],
  );

  const headerColor = useMemo(
    () =>
      headerColorConfig.find((config) => {
        console.log({ path: config?.path, pathname });
        return checkCurrentPath(config?.path);
      }) || headerColorConfig[0],
    [checkCurrentPath, pathname],
  );

  return (
    <>
      <div className={cn("absolute h-20 w-full", headerColor.bg)} />
      <header
        className={cn(
          "sticky top-0 z-50 w-full",
          "backdrop-blur-sm border-b",
          headerColor.header,
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button - left side */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Logo - centered */}
            <div className="flex-1 flex justify-center md:flex-none">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center "
              >
                <Logo animate className={headerColor.logo} />
              </Link>
            </div>

            {/* Desktop navigation - centered */}
            <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center">
              <div className="flex space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-bold transition-colors uppercase",
                      !checkCurrentPath(link.href?.toLocaleLowerCase()) &&
                        "font-medium opacity-70 hover:opacity-100",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Right side spacer for mobile to keep logo centered */}
            <div className="flex md:hidden w-10" />
          </div>
        </div>

        {/* Mobile menu */}
        <nav
          className={cn(
            "md:hidden bg-white overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-96" : "max-h-0",
          )}
        >
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block font-sans text-base text-gray-700 font-medium py-2 transition-colors",
                pathname?.toLowerCase() === "/" && "font-bold",
              )}
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block font-sans text-base text-gray-700 font-medium py-2 transition-colors",
                  pathname?.toLowerCase() === link.href?.toLowerCase() &&
                    "font-bold",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
