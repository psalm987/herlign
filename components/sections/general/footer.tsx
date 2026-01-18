import LINKS from "@/components/constants/links";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

const MENU = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Start Anyway", href: "/start-anyway" },
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  { name: "Instagram", href: LINKS.socials.instagram, Icon: Instagram },
  { name: "LinkedIn", href: LINKS.socials.linkedin, Icon: Linkedin },
  { name: "YouTube", href: LINKS.socials.youtube, Icon: Youtube },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">Herlign FC</h3>
            <p className="font-sans text-gray-300 text-sm">
              A home for creative women who want more.
            </p>
          </div>

          <div>
            <h4 className="font-sans font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-sans text-sm">
              {MENU.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-perple-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold mb-4">
              Stalk Us. It&apos;s Encouraged.
            </h4>
            <p className="font-sans text-gray-300 text-sm mb-4">
              Catch the behind-the-scenes chaos and daily inspiration on our
              socials.
            </p>
            <div className="flex flex-row gap-2">
              {SOCIALS.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  className="opacity-100 text-white hover:text-orange-400"
                  aria-label={social.name}
                >
                  <social.Icon />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="font-sans text-sm text-gray-400">
            © {new Date().getFullYear()} Herlign FC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
