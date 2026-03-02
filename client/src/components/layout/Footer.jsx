"use client";

import Link from "next/link";
import Image from "next/image";
import {
  RiMailLine,
  RiPhoneLine,
  RiTimeLine,
  RiFacebookCircleLine,
  RiInstagramLine,
  RiYoutubeLine,
  RiLinkedinBoxLine,
  RiArrowRightSLine,
  RiShieldCheckLine,
} from "react-icons/ri";

const quickLinks = [
  { name: "Courses",            href: "/courses" },
  { name: "Categories",         href: "/categories" },
  { name: "About Us",           href: "/about" },
  { name: "Contact",            href: "/contact" },
  { name: "Privacy Policy",     href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms" },
];

const popularCourses = [
  { name: "CA Inter Audit",        href: "/courses?subject=audit" },
  { name: "CA Final Direct Tax",   href: "/courses?subject=direct-tax" },
  { name: "CA Final Indirect Tax", href: "/courses?subject=indirect-tax" },
  { name: "Standards on Auditing", href: "/courses?subject=sa" },
  { name: "View All Courses",      href: "/courses" },
];

const socialLinks = [
  { name: "Facebook",  href: "https://www.facebook.com/share/1DCsKYB5Uy/?mibextid=wwXIfr", icon: RiFacebookCircleLine,  hoverClass: "hover:bg-blue-600 hover:border-blue-600" },
  { name: "Instagram", href: "https://www.instagram.com/official_camaker/",                  icon: RiInstagramLine,       hoverClass: "hover:bg-pink-600 hover:border-pink-600" },
  { name: "YouTube",   href: "https://youtube.com/@camakerindia",                             icon: RiYoutubeLine,         hoverClass: "hover:bg-red-600 hover:border-red-600" },
  { name: "LinkedIn",  href: "https://www.linkedin.com/company/camaker",                      icon: RiLinkedinBoxLine,     hoverClass: "hover:bg-blue-700 hover:border-blue-700" },
];

export const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white">

      {/* Top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-500/70 to-transparent" />

      {/* CTA Banner — compact */}
      <div
        className="py-8 text-center border-b border-white/8"
        style={{
          background: "linear-gradient(135deg, rgba(251,146,60,0.12) 0%, rgba(250,204,21,0.06) 50%, rgba(251,146,60,0.10) 100%)",
        }}
      >
        <h3 className="text-xl md:text-2xl font-black text-white mb-2">
          Ready to Clear CA with{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #fb923c, #facc15)" }}
          >
            Confidence?
          </span>
        </h3>
        <p className="text-gray-400 mb-4 text-sm max-w-sm mx-auto">
          Join 1,000+ CA aspirants — Big 4 expertise, practical teaching.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full font-semibold text-sm
                     bg-gradient-to-r from-orange-500 to-orange-600 text-white
                     hover:from-orange-600 hover:to-orange-700
                     shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
                     transition-all duration-300"
        >
          Explore Courses
          <RiArrowRightSLine className="h-4 w-4" />
        </Link>
      </div>

      {/* ── Main 3-column grid ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="CA Maker"
                width={200}
                height={100}
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
              Expert CA coaching by CA Mohit Kukreja. Making complex audit concepts
              simple with 6+ years of Big 4 experience.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className={`w-8 h-8 rounded-lg bg-white/8 border border-white/15
                              flex items-center justify-center
                              transition-all duration-300 ${s.hoverClass}`}
                >
                  <s.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-[0.14em] text-white/50 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-gray-400 hover:text-orange-400
                               transition-colors text-sm"
                  >
                    <RiArrowRightSLine className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-[0.14em] text-white/50 mb-5">
              Contact Us
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 bg-orange-500/12 border border-orange-500/20 rounded-lg
                                flex items-center justify-center flex-shrink-0 mt-0.5">
                  <RiPhoneLine className="h-3.5 w-3.5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Phone</p>
                  <a
                    href="tel:+919876543210"
                    className="text-sm text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-7 h-7 bg-orange-500/12 border border-orange-500/20 rounded-lg
                                flex items-center justify-center flex-shrink-0 mt-0.5">
                  <RiMailLine className="h-3.5 w-3.5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Email</p>
                  <a
                    href="mailto:camakerIndia@gmail.com"
                    className="text-sm text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    camakerIndia@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-7 h-7 bg-orange-500/12 border border-orange-500/20 rounded-lg
                                flex items-center justify-center flex-shrink-0 mt-0.5">
                  <RiTimeLine className="h-3.5 w-3.5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Hours</p>
                  <p className="text-sm text-gray-300">Mon–Sat, 9 AM – 7 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-600 text-center md:text-left">
              © {new Date().getFullYear()} CA Maker. All rights reserved.
            </p>

            {/* Trust badge */}
            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
              <RiShieldCheckLine className="h-3.5 w-3.5 text-green-500" />
              <span>Secure Payments — Cards, UPI & Net Banking</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
