import Link from "next/link"
import { Mail, Zap } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="gradient-text">ConvertHub</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Convert files instantly. Your privacy is our priority.</p>
            <p className="text-xs text-muted-foreground font-semibold">DishIs Technologies, India</p>
            <p className="text-xs text-muted-foreground">Hosted on c.tools.dishis.tech</p>
          </div>

          {/* Converters */}
          <div>
            <h3 className="font-semibold mb-4">Converters</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/converters/image" className="hover:text-foreground transition">
                  Image
                </Link>
              </li>
              <li>
                <Link href="/converters/document" className="hover:text-foreground transition">
                  Document
                </Link>
              </li>
              <li>
                <Link href="/converters/video" className="hover:text-foreground transition">
                  Video
                </Link>
              </li>
              <li>
                <Link href="/converters/audio" className="hover:text-foreground transition">
                  Audio
                </Link>
              </li>
              <li>
                <Link href="/converters/archive" className="hover:text-foreground transition">
                  Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/blog" className="hover:text-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 DishIs Technologies. All rights reserved.</p>
          <div className="flex gap-4">
            <a
              href="mailto:contact@c.tools.dishis.tech"
              aria-label="Email"
              className="text-muted-foreground hover:text-foreground transition"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
