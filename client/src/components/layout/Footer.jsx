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
  RiShieldStarLine,
  RiStarFill,
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
  { name: "Facebook", href: "https://www.facebook.com/share/1DCsKYB5Uy/?mibextid=wwXIfr", icon: RiFacebookCircleLine },
  { name: "Instagram", href: "https://www.instagram.com/official_camaker/", icon: RiInstagramLine },
  { name: "YouTube", href: "https://youtube.com/@camakerindia", icon: RiYoutubeLine },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/camaker", icon: RiLinkedinBoxLine },
];

export const Footer = () => {
  return (
    <footer
      className="text-white relative overflow-hidden"
      style={{
        background:
          "linear-gradient(175deg, #020818 0%, #071334 35%, #0C1D5E 60%, #081545 85%, #020818 100%)",
      }}
    >
      {/* Top decorative border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #3B82F6 30%, #60A5FA 50%, #3B82F6 70%, transparent)",
        }}
      />

      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(ellipse, #3B82F6, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(96,165,250,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.4) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* CTA Banner */}
      <div className="relative py-12 text-center border-b border-white/[0.06]">
        {/* Ornamental divider */}


        <h3 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight">
          <span className="text-white">Ready to Clear CA with </span>
          <span
            style={{
              background: "linear-gradient(135deg, #60A5FA, #3B82F6, #93C5FD)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Confidence?
          </span>
        </h3>
        <p className="text-white/80 mb-6 text-sm max-w-md mx-auto leading-relaxed">
          Join 10,000+ CA aspirants — Big 4 expertise, practical teaching, proven results.
        </p>
        <Link
          href="/courses"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm
                     text-white transition-all duration-300 hover:scale-[1.03]"
          style={{
            background: "linear-gradient(135deg, #2563EB, #3B82F6, #2563EB)",
            boxShadow:
              "0 4px 20px rgba(37, 99, 235, 0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          Explore Courses
          <RiArrowRightSLine className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Main grid */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <h1 className="text-2xl font-extrabold tracking-tight" style={{
                background: "linear-gradient(135deg, #60A5FA, #3B82F6, #93C5FD)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                CA Maker
              </h1>
            </Link>

            <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-xs">
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
                  className="w-10 h-10 rounded-xl flex items-center justify-center
                             transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "rgba(37, 99, 235, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.15)",
                    color: "#60A5FA",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2563EB";
                    e.currentTarget.style.borderColor = "#2563EB";
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(37, 99, 235, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(37, 99, 235, 0.1)";
                    e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.15)";
                    e.currentTarget.style.color = "#60A5FA";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3
              className="font-bold text-[11px] uppercase tracking-[0.2em] mb-6"
              style={{ color: "#60A5FA" }}
            >
              Courses
            </h3>
            <ul className="space-y-3">
              {popularCourses.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-white/80 hover:text-blue-300 transition-colors text-sm"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-blue-500/30 group-hover:bg-blue-400
                                 transition-colors flex-shrink-0"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3
              className="font-bold text-[11px] uppercase tracking-[0.2em] mb-6"
              style={{ color: "#60A5FA" }}
            >
              Company
            </h3>
            <ul className="space-y-3">
              {quickLinks
                .filter((l) => !["Courses", "Categories"].includes(l.name))
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-white/80 hover:text-blue-300 transition-colors text-sm"
                    >
                      <span
                        className="w-1 h-1 rounded-full bg-blue-500/30 group-hover:bg-blue-400
                                   transition-colors flex-shrink-0"
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="font-bold text-[11px] uppercase tracking-[0.2em] mb-6"
              style={{ color: "#60A5FA" }}
            >
              Connect
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(37, 99, 235, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.12)",
                  }}
                >
                  <RiPhoneLine className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider font-semibold mb-0.5">
                    Phone
                  </p>
                  <a
                    href="tel:+919876543210"
                    className="text-sm text-white/60 hover:text-blue-300 transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(37, 99, 235, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.12)",
                  }}
                >
                  <RiMailLine className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider font-semibold mb-0.5">
                    Email
                  </p>
                  <a
                    href="mailto:camakerIndia@gmail.com"
                    className="text-sm text-white/60 hover:text-blue-300 transition-colors"
                  >
                    camakerIndia@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(37, 99, 235, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.12)",
                  }}
                >
                  <RiTimeLine className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider font-semibold mb-0.5">
                    Hours
                  </p>
                  <p className="text-sm text-white/60">Mon–Sat, 9 AM – 7 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-7"
          style={{ borderTop: "1px solid rgba(59, 130, 246, 0.08)" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/25 text-center md:text-left">
              © {new Date().getFullYear()} CA Maker. All rights reserved.
            </p>


            <div className="flex items-center gap-4">
              <p className="text-xs text-white/50">
                Made with ❤️ for CA Students
              </p>
              <div className="flex items-center gap-1.5 text-xs text-white/25">
                <RiShieldCheckLine className="h-3.5 w-3.5 text-emerald-500/60" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #3B82F6 30%, #60A5FA 50%, #3B82F6 70%, transparent)",
        }}
      />
    </footer>
  );
};