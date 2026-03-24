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
  { name: "Courses", href: "/courses" },
  { name: "Categories", href: "/categories" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms" },
];

const popularCourses = [
  { name: "CA Inter Audit", href: "/courses?subject=audit" },
  { name: "CA Final Direct Tax", href: "/courses?subject=direct-tax" },
  { name: "CA Final Indirect Tax", href: "/courses?subject=indirect-tax" },
  { name: "Standards on Auditing", href: "/courses?subject=sa" },
  { name: "View All Courses", href: "/courses" },
];

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/share/1DCsKYB5Uy/?mibextid=wwXIfr", icon: RiFacebookCircleLine, hoverClass: "hover:bg-blue-600 hover:border-blue-600" },
  { name: "Instagram", href: "https://www.instagram.com/official_camaker/", icon: RiInstagramLine, hoverClass: "hover:bg-pink-600 hover:border-pink-600" },
  { name: "YouTube", href: "https://youtube.com/@camakerindia", icon: RiYoutubeLine, hoverClass: "hover:bg-red-600 hover:border-red-600" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/camaker", icon: RiLinkedinBoxLine, hoverClass: "hover:bg-blue-700 hover:border-blue-700" },
];

export const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white">
      {/* CTA Banner */}
      <div className="py-8 text-center border-b border-white/10">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
          Ready to Clear CA with{" "}
          <span className="text-[#F97316]">Confidence?</span>
        </h3>
        <p className="text-gray-400 mb-4 text-sm max-w-sm mx-auto">
          Join 10,000+ CA aspirants — Big 4 expertise, practical teaching.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded font-semibold text-sm
                     bg-[#F97316] hover:bg-[#EA580C] text-white
                     transition-all duration-200"
        >
          Explore Courses
          <RiArrowRightSLine className="h-4 w-4" />
        </Link>
      </div>

      {/* Main 4-column grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="CA Maker"
                width={160}
                height={64}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
              Expert CA coaching by CA Mohit Kukreja. Making complex audit concepts
              simple with 6+ years of Big 4 experience.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className="w-10 h-10 rounded-full bg-[#F97316]/20 border border-[#F97316]/30
                    flex items-center justify-center text-[#F97316]
                    hover:bg-[#F97316] hover:text-white transition-all duration-300"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-5">
              Courses
            </h3>
            <ul className="space-y-2.5">
              {popularCourses.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#F97316] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-5">
              Company
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.filter(l => !['Courses', 'Categories'].includes(l.name)).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#F97316] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-5">
              Connect
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-[#F97316]/20 flex items-center justify-center flex-shrink-0">
                  <RiPhoneLine className="h-4 w-4 text-[#F97316]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                  <a
                    href="tel:+919876543210"
                    className="text-sm text-gray-400 hover:text-[#F97316] transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-[#F97316]/20 flex items-center justify-center flex-shrink-0">
                  <RiMailLine className="h-4 w-4 text-[#F97316]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <a
                    href="mailto:camakerIndia@gmail.com"
                    className="text-sm text-gray-400 hover:text-[#F97316] transition-colors"
                  >
                    camakerIndia@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-[#F97316]/20 flex items-center justify-center flex-shrink-0">
                  <RiTimeLine className="h-4 w-4 text-[#F97316]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Hours</p>
                  <p className="text-sm text-gray-400">Mon–Sat, 9 AM – 7 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} CA Maker. All rights reserved.
            </p>
            <p className="text-xs text-[#F97316]">Made with ❤️ for CA Students</p>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <RiShieldCheckLine className="h-3.5 w-3.5 text-[#16A34A]" />
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
