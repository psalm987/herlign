import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">Herlign</h3>
            <p className="font-sans text-gray-300 text-sm">
              A home for creative women who want more.
            </p>
          </div>
          
          <div>
            <h4 className="font-sans font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-sans text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-perple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-perple-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/start-anyway" className="text-gray-300 hover:text-perple-400 transition-colors">
                  Start Anyway
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-perple-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-sans font-semibold mb-4">Connect</h4>
            <p className="font-sans text-gray-300 text-sm">
              Join our community and start your creative journey today.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="font-sans text-sm text-gray-400">
            © {new Date().getFullYear()} Herlign. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
