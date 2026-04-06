"use client";

import { useRef, useState, useEffect } from "react";
import {
  RiYoutubeLine,
  RiInstagramLine,
  RiFacebookCircleLine,
  RiArrowRightLine,
  RiGroupLine,
} from "react-icons/ri";

const socialLinks = [
  {
    name: "YouTube",
    handle: "@camakerindia",
    url: "https://youtube.com/@camakerindia?si=ZkkCpU1DEh48NBSe",
    Icon: RiYoutubeLine,
    accent: "#DC2626",
    lightBg: "rgba(220, 38, 38, 0.06)",
    lightBorder: "rgba(220, 38, 38, 0.1)",
    desc: "Free lectures, exam tips, and concept explanations from CA Mohit Kukreja.",
    count: "50K+",
    countLabel: "Subscribers",
  },
  {
    name: "Instagram",
    handle: "@official_camaker",
    url: "https://www.instagram.com/official_camaker/",
    Icon: RiInstagramLine,
    accent: "#A855F7",
    lightBg: "rgba(168, 85, 247, 0.06)",
    lightBorder: "rgba(168, 85, 247, 0.1)",
    desc: "Daily exam updates, motivation, and behind-the-scenes from CA Maker.",
    count: "30K+",
    countLabel: "Followers",
  },
  {
    name: "Facebook",
    handle: "CA Maker India",
    url: "https://www.facebook.com/share/1DCsKYB5Uy/?mibextid=wwXIfr",
    Icon: RiFacebookCircleLine,
    accent: "#2563EB",
    lightBg: "rgba(37, 99, 235, 0.06)",
    lightBorder: "rgba(37, 99, 235, 0.1)",
    desc: "Join thousands of CA students in our growing learning community.",
    count: "10K+",
    countLabel: "Members",
  },
];

export function SocialMediaSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-24 overflow-hidden bg-white"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top blue accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #3B82F6 30%, #60A5FA 50%, #3B82F6 70%, transparent)",
          }}
        />

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#1E3A8A 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Soft radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-[0.04]"
          style={{
            background:
              "radial-gradient(ellipse, #3B82F6, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-1000 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >


          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Follow{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #1E40AF, #3B82F6, #60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CA Maker
            </span>
          </h2>

          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            Stay updated with free content, exam tips, and student success
            stories across all our platforms.
          </p>
        </div>

        {/* Social Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-7">
          {socialLinks.map((s, i) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col items-center text-center rounded-2xl
                         p-8 transition-all duration-700 ease-out hover:-translate-y-1.5
                         ${visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
                }`}
              style={{
                transitionDelay: `${200 + i * 150}ms`,
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = s.accent + "33";
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.06), 0 0 0 1px ${s.accent}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.04)";
              }}
            >
              {/* Icon */}
              <div
                className="relative w-16 h-16 rounded-xl flex items-center justify-center mb-5
                           transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: s.lightBg,
                  border: `1px solid ${s.lightBorder}`,
                }}
              >
                <s.Icon className="w-8 h-8" style={{ color: s.accent }} />
              </div>

              {/* Count */}
              <div className="mb-3">
                <span
                  className="text-3xl font-extrabold tracking-tight"
                  style={{ color: s.accent }}
                >
                  {s.count}
                </span>
                <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest mt-0.5">
                  {s.countLabel}
                </p>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-0.5">
                {s.name}
              </h3>
              <p className="font-semibold text-sm mb-3 text-blue-600">
                {s.handle}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-[260px]">
                {s.desc}
              </p>

              {/* CTA */}
              <div className="mt-auto flex items-center gap-2 font-bold text-sm text-blue-600
                              transition-all duration-300 group-hover:gap-3">
                <span>Follow Now</span>
                <RiArrowRightLine className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Bottom decorative bar */}
              <div
                className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full opacity-0
                           group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`,
                }}
              />
            </a>
          ))}
        </div>


      </div>
    </section>
  );
}

export default SocialMediaSection;